import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { status as OnrampStatus } from "../../../bridge/OnrampStatus.js";
import { ApiError } from "../../../bridge/types/Errors.js";
import type {
  RouteStep,
  RouteTransaction,
} from "../../../bridge/types/Route.js";
import type { Status } from "../../../bridge/types/Status.js";
import { getCachedChain } from "../../../chains/utils.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { stringify } from "../../../utils/json.js";
import type { Account, Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import {
  type BridgePrepareRequest,
  type BridgePrepareResult,
  useBridgePrepare,
} from "./useBridgePrepare.js";

/**
 * Type for completed status results from Bridge.status and Onramp.status
 */
export type CompletedStatusResult =
  | ({ type: "buy" } & Extract<Status, { status: "COMPLETED" }>)
  | ({ type: "sell" } & Extract<Status, { status: "COMPLETED" }>)
  | ({ type: "transfer" } & Extract<Status, { status: "COMPLETED" }>)
  | ({ type: "onramp" } & Extract<
      OnrampStatus.Result,
      { status: "COMPLETED" }
    >);

/**
 * Options for the step executor hook
 */
interface StepExecutorOptions {
  /** Prepared quote returned by Bridge.prepare */
  request: BridgePrepareRequest;
  /** Wallet instance providing getAccount() & sendTransaction */
  wallet: Wallet;
  /** Window adapter for opening on-ramp URLs (web / RN) */
  windowAdapter: WindowAdapter;
  /** Thirdweb client for API calls */
  client: ThirdwebClient;
  /** Auto start execution as soon as hook mounts */
  autoStart?: boolean;
  /** Callback when all steps complete successfully - receives array of all completed status results */
  onComplete?: (completedStatuses: CompletedStatusResult[]) => void;
}

/**
 * Internal flattened transaction type
 */
interface FlattenedTx extends RouteTransaction {
  /** Index in flat array */
  _index: number;
  /** Parent step index */
  _stepIndex: number;
}

/**
 * Public return type of useStepExecutor
 */
interface StepExecutorResult {
  currentStep?: RouteStep;
  currentTxIndex?: number;
  progress: number; // 0–100
  onrampStatus?: "pending" | "executing" | "completed" | "failed";
  executionState: "fetching" | "idle" | "executing" | "auto-starting";
  steps?: RouteStep[];
  error?: ApiError;
  start: () => void;
  cancel: () => void;
  retry: () => void;
}

/**
 * Flatten RouteStep[] into a linear list of transactions preserving ordering & indices.
 */
function flattenRouteSteps(steps: RouteStep[]): FlattenedTx[] {
  const out: FlattenedTx[] = [];
  steps.forEach((step, stepIdx) => {
    step.transactions?.forEach((tx, _txIdx) => {
      out.push({
        ...(tx as RouteTransaction),
        _index: out.length,
        _stepIndex: stepIdx,
      });
    });
  });
  return out;
}

/**
 * Hook that sequentially executes prepared steps.
 * NOTE: initial implementation only exposes progress + basic state machine. Actual execution logic will follow in later subtasks.
 */
export function useStepExecutor(
  options: StepExecutorOptions,
): StepExecutorResult {
  const {
    request,
    wallet,
    windowAdapter,
    client,
    autoStart = false,
    onComplete,
  } = options;

  const { data: preparedQuote, isLoading } = useBridgePrepare(request);

  // Flatten all transactions upfront
  const flatTxs = useMemo(
    () => (preparedQuote?.steps ? flattenRouteSteps(preparedQuote.steps) : []),
    [preparedQuote?.steps],
  );

  // State management
  const [currentTxIndex, setCurrentTxIndex] = useState<number | undefined>(
    undefined,
  );
  const [executionState, setExecutionState] = useState<
    "fetching" | "idle" | "executing" | "auto-starting"
  >("idle");
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [completedTxs, setCompletedTxs] = useState<Set<number>>(new Set());
  const [onrampStatus, setOnrampStatus] = useState<
    "pending" | "executing" | "completed" | "failed" | undefined
  >(preparedQuote?.type === "onramp" ? "pending" : undefined);

  useQuery({
    queryFn: async () => {
      if (!isLoading) {
        setExecutionState("idle");
      } else {
        setExecutionState("fetching");
      }
      return executionState;
    },
    queryKey: [
      "bridge-quote-execution-state",
      stringify(preparedQuote?.steps),
      isLoading,
    ],
  });

  // Cancellation tracking
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get current step based on current tx index
  const currentStep = useMemo(() => {
    if (typeof preparedQuote?.steps === "undefined") return undefined;
    if (currentTxIndex === undefined) {
      return undefined;
    }
    const tx = flatTxs[currentTxIndex];
    return tx ? preparedQuote.steps[tx._stepIndex] : undefined;
  }, [currentTxIndex, flatTxs, preparedQuote?.steps]);

  // Calculate progress including onramp step
  const progress = useMemo(() => {
    if (typeof preparedQuote?.type === "undefined") return 0;
    const totalSteps =
      flatTxs.length + (preparedQuote.type === "onramp" ? 1 : 0);
    if (totalSteps === 0) {
      return 0;
    }
    const completedSteps =
      completedTxs.size + (onrampStatus === "completed" ? 1 : 0);
    return Math.round((completedSteps / totalSteps) * 100);
  }, [completedTxs.size, flatTxs.length, preparedQuote?.type, onrampStatus]);

  // Exponential backoff polling utility
  const poller = useCallback(
    async (
      pollFn: () => Promise<{
        completed: boolean;
      }>,
      abortSignal: AbortSignal,
    ) => {
      const delay = 2000; // 2 second poll interval

      while (!abortSignal.aborted) {
        const result = await pollFn();
        if (result.completed) {
          return;
        }

        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, delay);
          abortSignal.addEventListener("abort", () => clearTimeout(timeout), {
            once: true,
          });
        });
      }

      throw new Error("Polling aborted");
    },
    [],
  );

  // Execute a single transaction
  const executeSingleTx = useCallback(
    async (
      tx: FlattenedTx,
      account: Account,
      completedStatusResults: CompletedStatusResult[],
      abortSignal: AbortSignal,
    ) => {
      if (typeof preparedQuote?.type === "undefined") {
        throw new Error("No quote generated. This is unexpected.");
      }
      const { prepareTransaction } = await import(
        "../../../transaction/prepare-transaction.js"
      );
      const { sendTransaction } = await import(
        "../../../transaction/actions/send-transaction.js"
      );

      // Prepare the transaction
      const preparedTx = prepareTransaction({
        chain: tx.chain,
        client: tx.client,
        data: tx.data,
        to: tx.to,
        value: tx.value,
      });

      // Send the transaction
      const result = await sendTransaction({
        account,
        transaction: preparedTx,
      });
      const hash = result.transactionHash;

      if (tx.action === "approval" || tx.action === "fee") {
        // don't poll status for approval transactions, just wait for confirmation
        await waitForReceipt(result);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Add an extra 2 second delay for RPC to catch up to new state
        return;
      }

      // Poll for completion
      const { status } = await import("../../../bridge/Status.js");
      await poller(async () => {
        const statusResult = await status({
          chainId: tx.chainId,
          client: tx.client,
          transactionHash: hash,
        });

        if (statusResult.status === "COMPLETED") {
          // Add type field from preparedQuote for discriminated union
          const typedStatusResult = {
            type: preparedQuote.type,
            ...statusResult,
          };
          completedStatusResults.push(typedStatusResult);
          return { completed: true };
        }

        if (statusResult.status === "FAILED") {
          throw new Error("Payment failed");
        }

        return { completed: false };
      }, abortSignal);
    },
    [poller, preparedQuote?.type],
  );

  // Execute batch transactions
  const executeBatch = useCallback(
    async (
      txs: FlattenedTx[],
      account: Account,
      completedStatusResults: CompletedStatusResult[],
      abortSignal: AbortSignal,
    ) => {
      if (typeof preparedQuote?.type === "undefined") {
        throw new Error("No quote generated. This is unexpected.");
      }
      if (!account.sendBatchTransaction) {
        throw new Error("Account does not support batch transactions");
      }

      const { prepareTransaction } = await import(
        "../../../transaction/prepare-transaction.js"
      );
      const { sendBatchTransaction } = await import(
        "../../../transaction/actions/send-batch-transaction.js"
      );

      // Prepare and convert all transactions
      const serializableTxs = await Promise.all(
        txs.map(async (tx) => {
          const preparedTx = prepareTransaction({
            chain: tx.chain,
            client: tx.client,
            data: tx.data,
            to: tx.to,
            value: tx.value,
          });
          return preparedTx;
        }),
      );

      // Send batch
      const result = await sendBatchTransaction({
        account,
        transactions: serializableTxs,
      });
      // Batch transactions return a single receipt, we need to handle this differently
      // For now, we'll assume all transactions in the batch succeed together

      // Poll for the first transaction's completion (representative of the batch)
      if (txs.length === 0) {
        throw new Error("No transactions to batch");
      }
      const firstTx = txs[0];
      if (!firstTx) {
        throw new Error("Invalid batch transaction");
      }

      const { status } = await import("../../../bridge/Status.js");
      await poller(async () => {
        const statusResult = await status({
          chainId: firstTx.chainId,
          client: firstTx.client,
          transactionHash: result.transactionHash,
        });

        if (statusResult.status === "COMPLETED") {
          // Add type field from preparedQuote for discriminated union
          const typedStatusResult = {
            type: preparedQuote.type,
            ...statusResult,
          };
          completedStatusResults.push(typedStatusResult);
          return { completed: true };
        }

        if (statusResult.status === "FAILED") {
          throw new Error("Payment failed");
        }

        return { completed: false };
      }, abortSignal);
    },
    [poller, preparedQuote?.type],
  );

  // Execute onramp step
  const executeOnramp = useCallback(
    async (
      onrampQuote: Extract<BridgePrepareResult, { type: "onramp" }>,
      completedStatusResults: CompletedStatusResult[],
      abortSignal: AbortSignal,
    ) => {
      setOnrampStatus("executing");
      // Open the payment URL
      windowAdapter.open(onrampQuote.link);

      // Poll for completion using the session ID
      const { Onramp } = await import("../../../bridge/index.js");
      await poller(async () => {
        const statusResult = await Onramp.status({
          client: client,
          id: onrampQuote.id,
        });

        const status = statusResult.status;
        if (status === "COMPLETED") {
          setOnrampStatus("completed");
          // Add type field for discriminated union
          const typedStatusResult = {
            type: "onramp" as const,
            ...statusResult,
          };
          completedStatusResults.push(typedStatusResult);
          return { completed: true };
        } else if (status === "FAILED") {
          setOnrampStatus("failed");
        }

        return { completed: false };
      }, abortSignal);
    },
    [poller, client, windowAdapter],
  );

  // Main execution function
  const execute = useCallback(async () => {
    if (typeof preparedQuote?.type === "undefined") {
      throw new Error("No quote generated. This is unexpected.");
    }
    if (executionState !== "idle") {
      return;
    }

    setExecutionState("executing");
    setError(undefined);
    const completedStatusResults: CompletedStatusResult[] = [];

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Execute onramp first if configured and not already completed
      if (preparedQuote.type === "onramp" && onrampStatus === "pending") {
        await executeOnramp(
          preparedQuote,
          completedStatusResults,
          abortController.signal,
        );
      }

      // Then execute transactions
      const account = wallet.getAccount();
      if (!account) {
        throw new ApiError({
          code: "INVALID_INPUT",
          message: "Wallet not connected",
          statusCode: 400,
        });
      }

      // Start from where we left off, or from the beginning
      const startIndex = currentTxIndex ?? 0;

      for (let i = startIndex; i < flatTxs.length; i++) {
        if (abortController.signal.aborted) {
          break;
        }

        const currentTx = flatTxs[i];
        if (!currentTx) {
          continue; // Skip invalid index
        }

        setCurrentTxIndex(i);
        const currentStepData = preparedQuote.steps[currentTx._stepIndex];
        if (!currentStepData) {
          throw new Error(`Invalid step index: ${currentTx._stepIndex}`);
        }

        // switch chain if needed
        if (currentTx.chainId !== wallet.getChain()?.id) {
          await wallet.switchChain(getCachedChain(currentTx.chainId));
        }

        // Check if we can batch transactions
        const canBatch =
          account.sendBatchTransaction !== undefined && i < flatTxs.length - 1; // Not the last transaction

        if (canBatch) {
          // Find consecutive transactions on the same chain
          const batchTxs: FlattenedTx[] = [currentTx];
          let j = i + 1;
          while (j < flatTxs.length) {
            const nextTx = flatTxs[j];
            if (!nextTx || nextTx.chainId !== currentTx.chainId) {
              break;
            }
            batchTxs.push(nextTx);
            j++;
          }

          // Execute batch if we have multiple transactions
          if (batchTxs.length > 1) {
            await executeBatch(
              batchTxs,
              account,
              completedStatusResults,
              abortController.signal,
            );

            // Mark all batched transactions as completed
            for (const tx of batchTxs) {
              setCompletedTxs((prev) => new Set(prev).add(tx._index));
            }

            // Skip ahead
            i = j - 1;
            continue;
          }
        }

        // Execute single transaction
        await executeSingleTx(
          currentTx,
          account,
          completedStatusResults,
          abortController.signal,
        );

        // Mark transaction as completed
        setCompletedTxs((prev) => new Set(prev).add(currentTx._index));
      }

      // All done - check if we actually completed everything
      if (!abortController.signal.aborted) {
        setCurrentTxIndex(undefined);

        // Call completion callback with all completed status results
        if (onComplete) {
          onComplete(completedStatusResults);
        }
      }
    } catch (err) {
      console.error("Error executing payment", err);
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(
          new ApiError({
            code: "UNKNOWN_ERROR",
            message: (err as Error)?.message || "An unknown error occurred",
            statusCode: 500,
          }),
        );
      }
    } finally {
      setExecutionState("idle");
      abortControllerRef.current = null;
    }
  }, [
    executionState,
    wallet,
    currentTxIndex,
    flatTxs,
    executeSingleTx,
    executeBatch,
    onrampStatus,
    executeOnramp,
    onComplete,
    preparedQuote,
  ]);

  // Start execution
  const start = useCallback(() => {
    if (executionState === "idle") {
      execute();
    }
  }, [execute, executionState]);

  // Cancel execution
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setExecutionState("idle");
    if (onrampStatus === "executing") {
      setOnrampStatus("pending");
    }
  }, [onrampStatus]);

  // Retry from failed transaction
  const retry = useCallback(() => {
    if (error) {
      setError(undefined);
      execute();
    }
  }, [error, execute]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (
      autoStart &&
      executionState === "idle" &&
      currentTxIndex === undefined &&
      !hasInitialized.current
    ) {
      hasInitialized.current = true;
      setExecutionState("auto-starting");
      // add a delay to ensure the UI is ready
      setTimeout(() => {
        start();
      }, 500);
    }
  }, [autoStart, executionState, currentTxIndex, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    cancel,
    currentStep,
    currentTxIndex,
    error,
    executionState,
    onrampStatus,
    progress,
    retry,
    start,
    steps: preparedQuote?.steps,
  };
}

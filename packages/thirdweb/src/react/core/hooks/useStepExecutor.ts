import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "../../../bridge/types/Errors.js";
import type {
  RouteStep,
  RouteTransaction,
} from "../../../bridge/types/Route.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";

/**
 * Options for the step executor hook
 */
export interface StepExecutorOptions {
  /** Prepared route steps returned by Bridge.prepare */
  steps: RouteStep[];
  /** Wallet instance providing getAccount() & sendTransaction */
  wallet: Wallet;
  /** Window adapter for opening on-ramp URLs (web / RN) */
  windowAdapter: WindowAdapter;
  /** Thirdweb client for API calls */
  client: ThirdwebClient;
  /** Optional onramp configuration */
  onramp?: {
    /** Payment URL to open for onramp */
    paymentUrl: string;
    /** Onramp session ID for status polling */
    sessionId: string;
  };
  /** Auto start execution as soon as hook mounts */
  autoStart?: boolean;
  /** Callback when all steps complete successfully */
  onComplete?: () => void;
}

/**
 * Internal flattened transaction type
 */
export interface FlattenedTx extends RouteTransaction {
  /** Index in flat array */
  _index: number;
  /** Parent step index */
  _stepIndex: number;
}

/**
 * Public return type of useStepExecutor
 */
export interface StepExecutorResult {
  currentStep?: RouteStep;
  currentTxIndex?: number;
  progress: number; // 0–100
  isExecuting: boolean;
  error?: ApiError;
  start: () => void;
  cancel: () => void;
  retry: () => void;
}

/**
 * Flatten RouteStep[] into a linear list of transactions preserving ordering & indices.
 */
export function flattenRouteSteps(steps: RouteStep[]): FlattenedTx[] {
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
    steps,
    wallet,
    windowAdapter,
    client,
    onramp,
    autoStart = false,
    onComplete,
  } = options;

  // Flatten all transactions upfront
  const flatTxs = useMemo(() => flattenRouteSteps(steps), [steps]);

  // State management
  const [currentTxIndex, setCurrentTxIndex] = useState<number | undefined>(
    undefined,
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [completedTxs, setCompletedTxs] = useState<Set<number>>(new Set());
  const [onrampCompleted, setOnrampCompleted] = useState(false);

  // Cancellation tracking
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get current step based on current tx index
  const currentStep = useMemo(() => {
    if (currentTxIndex === undefined) {
      return undefined;
    }
    const tx = flatTxs[currentTxIndex];
    return tx ? steps[tx._stepIndex] : undefined;
  }, [currentTxIndex, flatTxs, steps]);

  // Calculate progress including onramp step
  const progress = useMemo(() => {
    const totalSteps = flatTxs.length + (onramp ? 1 : 0);
    if (totalSteps === 0) {
      return 0;
    }
    const completedSteps = completedTxs.size + (onrampCompleted ? 1 : 0);
    return Math.round((completedSteps / totalSteps) * 100);
  }, [completedTxs.size, flatTxs.length, onramp, onrampCompleted]);

  // Exponential backoff polling utility
  const pollWithBackoff = useCallback(
    async (
      pollFn: () => Promise<{ completed: boolean }>,
      abortSignal: AbortSignal,
    ) => {
      const delay = 2000; // 2 second poll interval

      while (!abortSignal.aborted) {
        const result = await pollFn();
        if (result.completed) {
          return;
        }

        // Wait with exponential backoff
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
      account: NonNullable<ReturnType<Wallet["getAccount"]>>,
      abortSignal: AbortSignal,
    ) => {
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
        to: tx.to,
        data: tx.data,
        value: tx.value,
      });

      // Send the transaction
      const result = await sendTransaction({
        account,
        transaction: preparedTx,
      });
      const hash = result.transactionHash;

      if (tx.action === "approval") {
        // don't poll status for approval transactions, just wait for confirmation
        await waitForReceipt(result);
        return;
      }

      // Poll for completion
      const { status } = await import("../../../bridge/Status.js");
      await pollWithBackoff(async () => {
        const statusResult = await status({
          transactionHash: hash,
          chainId: tx.chainId,
          client: tx.client,
        });

        return { completed: statusResult.status === "COMPLETED" };
      }, abortSignal);
    },
    [pollWithBackoff],
  );

  // Execute batch transactions
  const executeBatch = useCallback(
    async (
      txs: FlattenedTx[],
      account: NonNullable<ReturnType<Wallet["getAccount"]>>,
      abortSignal: AbortSignal,
    ) => {
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
            to: tx.to,
            data: tx.data,
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
      await pollWithBackoff(async () => {
        const statusResult = await status({
          transactionHash: result.transactionHash,
          chainId: firstTx.chainId,
          client: firstTx.client,
        });

        return { completed: statusResult.status === "COMPLETED" };
      }, abortSignal);
    },
    [pollWithBackoff],
  );

  // Execute onramp step
  const executeOnramp = useCallback(
    async (
      onrampConfig: NonNullable<StepExecutorOptions["onramp"]>,
      abortSignal: AbortSignal,
    ) => {
      // Open the payment URL
      await windowAdapter.open(onrampConfig.paymentUrl);

      // Poll for completion using the session ID
      const { Onramp } = await import("../../../bridge/index.js");
      await pollWithBackoff(async () => {
        const statusResult = await Onramp.status({
          id: onrampConfig.sessionId,
          client: client,
        });

        return { completed: statusResult.status === "COMPLETED" };
      }, abortSignal);
    },
    [windowAdapter, pollWithBackoff, client],
  );

  // Main execution function
  const execute = useCallback(async () => {
    if (isExecuting) {
      return;
    }

    setIsExecuting(true);
    setError(undefined);

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Execute onramp first if configured and not already completed
      if (onramp && !onrampCompleted) {
        await executeOnramp(onramp, abortController.signal);
        setOnrampCompleted(true);
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
        const currentStepData = steps[currentTx._stepIndex];
        if (!currentStepData) {
          throw new Error(`Invalid step index: ${currentTx._stepIndex}`);
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
            await executeBatch(batchTxs, account, abortController.signal);

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
        await executeSingleTx(currentTx, account, abortController.signal);

        // Mark transaction as completed
        setCompletedTxs((prev) => new Set(prev).add(currentTx._index));
      }

      // All done - check if we actually completed everything
      if (!abortController.signal.aborted) {
        setCurrentTxIndex(undefined);

        // Call completion callback
        if (onComplete) {
          onComplete();
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(
          new ApiError({
            code: "UNKNOWN_ERROR",
            message: err instanceof Error ? err.message : String(err),
            statusCode: 500,
          }),
        );
      }
    } finally {
      setIsExecuting(false);
      abortControllerRef.current = null;
    }
  }, [
    isExecuting,
    wallet,
    currentTxIndex,
    flatTxs,
    steps,
    executeSingleTx,
    executeBatch,
    onramp,
    onrampCompleted,
    executeOnramp,
    onComplete,
  ]);

  // Start execution
  const start = useCallback(() => {
    if (!isExecuting) {
      execute();
    }
  }, [execute, isExecuting]);

  // Cancel execution
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsExecuting(false);
  }, []);

  // Retry from failed transaction
  const retry = useCallback(() => {
    if (error) {
      const { isRetryable } = require("../errors/mapBridgeError");
      if (isRetryable(error.code)) {
        setError(undefined);
        execute();
      }
    }
  }, [error, execute]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !isExecuting && currentTxIndex === undefined) {
      start();
    }
  }, [autoStart, isExecuting, currentTxIndex, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    currentStep,
    currentTxIndex,
    progress,
    isExecuting,
    error,
    start,
    cancel,
    retry,
  };
}

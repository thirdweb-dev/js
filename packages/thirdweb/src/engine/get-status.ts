import { searchTransactions } from "@thirdweb-dev/engine";
import type { Chain } from "../chains/types.js";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import type { WaitForReceiptOptions } from "../transaction/actions/wait-for-tx-receipt.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import type { Hex } from "../utils/encoding/hex.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import type { Prettify } from "../utils/type-utils.js";

export type RevertData = {
  errorName: string;
  errorArgs: Record<string, unknown>;
};

type ExecutionResult4337Serialized =
  | {
      status: "QUEUED";
    }
  | {
      status: "FAILED";
      error: string;
    }
  | {
      status: "SUBMITTED";
      monitoringStatus: "WILL_MONITOR" | "CANNOT_MONITOR";
      userOpHash: string;
    }
  | ({
      status: "CONFIRMED";
      userOpHash: Hex;
      transactionHash: Hex;
      actualGasCost: string;
      actualGasUsed: string;
      nonce: string;
    } & (
      | {
          onchainStatus: "SUCCESS";
        }
      | {
          onchainStatus: "REVERTED";
          revertData?: RevertData;
        }
    ));

export type ExecutionResult = Prettify<
  ExecutionResult4337Serialized & {
    chain: Chain;
    from: string | undefined;
    id: string;
  }
>;

/**
 * Get the execution status of a transaction.
 * @param args - The arguments for the transaction.
 * @param args.client - The thirdweb client to use.
 * @param args.transactionId - The id of the transaction to get the status of.
 * @engine
 * @example
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const executionResult = await Engine.getTransactionStatus({
 *   client,
 *   transactionId,
 * });
 * console.log(executionResult.status);
 * ```
 */
export async function getTransactionStatus(args: {
  client: ThirdwebClient;
  transactionId: string;
}): Promise<ExecutionResult> {
  const { client, transactionId } = args;
  const searchResult = await searchTransactions({
    baseUrl: getThirdwebBaseUrl("engineCloud"),
    fetch: getClientFetch(client),
    body: {
      filters: [
        {
          field: "id",
          values: [transactionId],
          operation: "OR",
        },
      ],
    },
  });

  if (searchResult.error) {
    throw new Error(
      `Error searching for transaction ${transactionId}: ${stringify(
        searchResult.error,
      )}`,
    );
  }

  const data = searchResult.data?.result?.transactions?.[0];

  if (!data) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  const executionResult = data.executionResult as ExecutionResult4337Serialized;
  return {
    ...executionResult,
    chain: getCachedChain(Number(data.chainId)),
    from: data.from ?? undefined,
    id: data.id,
  };
}

/**
 * Wait for a transaction to be submitted onchain and return the transaction hash.
 * @param args - The arguments for the transaction.
 * @param args.client - The thirdweb client to use.
 * @param args.transactionId - The id of the transaction to wait for.
 * @param args.timeoutInSeconds - The timeout in seconds.
 * @engine
 * @example
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const { transactionHash } = await Engine.waitForTransactionHash({
 *   client,
 *   transactionId, // the transaction id returned from enqueueTransaction
 * });
 * ```
 */
export async function waitForTransactionHash(args: {
  client: ThirdwebClient;
  transactionId: string;
  timeoutInSeconds?: number;
}): Promise<WaitForReceiptOptions> {
  const startTime = Date.now();
  const TIMEOUT_IN_MS = args.timeoutInSeconds
    ? args.timeoutInSeconds * 1000
    : 5 * 60 * 1000; // 5 minutes in milliseconds

  while (Date.now() - startTime < TIMEOUT_IN_MS) {
    const executionResult = await getTransactionStatus(args);
    const status = executionResult.status;

    switch (status) {
      case "FAILED": {
        throw new Error(
          `Transaction failed: ${executionResult.error || "Unknown error"}`,
        );
      }
      case "CONFIRMED": {
        const onchainStatus =
          executionResult && "onchainStatus" in executionResult
            ? executionResult.onchainStatus
            : null;
        if (onchainStatus === "REVERTED") {
          const revertData =
            "revertData" in executionResult
              ? executionResult.revertData
              : undefined;
          throw new Error(
            `Transaction reverted: ${revertData?.errorName || ""} ${revertData?.errorArgs ? stringify(revertData.errorArgs) : ""}`,
          );
        }
        return {
          transactionHash: executionResult.transactionHash as Hex,
          client: args.client,
          chain: executionResult.chain,
        };
      }
      default: {
        // wait for the transaction to be confirmed
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  throw new Error(
    `Transaction timed out after ${TIMEOUT_IN_MS / 1000} seconds`,
  );
}

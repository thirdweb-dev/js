import { stringify } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { WaitForReceiptOptions } from "../transaction/actions/wait-for-tx-receipt.js";
import type { Hex } from "../utils/encoding/hex.js";
import { getTransactionStatus } from "./get-status.js";

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
          `Transaction failed: ${stringify(executionResult.error) || "Unknown error"}`,
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
            `Transaction reverted: ${revertData?.errorName || "unknown error"} ${revertData?.errorArgs ? stringify(revertData.errorArgs) : ""} - ${executionResult.transactionHash ? executionResult.transactionHash : ""}`,
          );
        }
        return {
          chain: executionResult.chain,
          client: args.client,
          transactionHash: executionResult.transactionHash as Hex,
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

import { searchTransactions } from "@thirdweb-dev/engine";
import type { Chain } from "../chains/types.js";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
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
    createdAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
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
    body: {
      filters: [
        {
          field: "id",
          operation: "OR",
          values: [transactionId],
        },
      ],
    },
    bodySerializer: stringify,
    fetch: getClientFetch(client),
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
    cancelledAt: data.cancelledAt,
    chain: getCachedChain(Number(data.chainId)),
    confirmedAt: data.confirmedAt,
    createdAt: data.createdAt,
    from: data.from ?? undefined,
    id: data.id,
  };
}

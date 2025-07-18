import { getTransactionById } from "@thirdweb-dev/api";
import type { ThirdwebClient } from "../../client/client.js";
import { getThirdwebBaseUrl } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Transaction } from "./types.js";
import type { Address } from "../../utils/address.js";
import type { Hex } from "../../utils/encoding/hex.js";

/**
 * Retrieves a transaction by ID.
 *
 * @param options - Options including the transaction ID
 * @param options.transactionId - The ID of the transaction to retrieve
 * @returns Promise that resolves to the transaction
 * @example
 *
 * ## Get a transaction by ID
 * ```typescript
 * import { Client, Transactions } from "thirdweb/v2";
 *
 * const client = Client.init({
 *   clientId: "YOUR_CLIENT_ID",
 * });
 *
 * const transaction = await Transactions.get({
 *   transactionId: "...",
 *   client,
 * });
 * ```
 */
export async function get(options: get.Options): Promise<get.Result> {
  const result = await getTransactionById({
    baseUrl: getThirdwebBaseUrl("api"),
    fetch: getClientFetch(options.client),
    path: {
      transactionId: options.transactionId,
    }
  });

  if (result.error) {
    throw new Error(
      `Failed to get transaction: ${result.response.status} - ${result.error}`,
    );
  }
  const transaction = result.data?.result;
  if (!transaction) {
    throw new Error("Failed to get transaction: no transaction");
  }

  return {
    id: transaction.id,
    transactionHash: transaction.transactionHash as Hex,
    from: transaction.from as Address,
    chainId: transaction.chainId,
    createdAt: transaction.createdAt,
    confirmedAt: transaction.confirmedAt,
    confirmedAtBlockNumber: transaction.confirmedAtBlockNumber,
    cancelledAt: transaction.cancelledAt,
    errorMessage: transaction.errorMessage,
  };
}

export declare namespace get {
  type Options = {
    transactionId: string;
    client: ThirdwebClient;
  };

  type Result = Transaction;
}

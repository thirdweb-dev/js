import { listTransactions } from "@thirdweb-dev/api";
import type { Transaction } from "./types.js";
import { getThirdwebBaseUrl } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Address } from "../../utils/address.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Hex } from "../../utils/encoding/hex.js";


/**
 * Retrieves a paginated list of transactions associated with the provided sender address.
 *
 * @param options - Options including the sender address, chain ID, and pagination
 * @param options.client - The Thirdweb client instance
 * @param options.sender - The sender address to retrieve transactions for
 * @param options.limit - The maximum number of transactions to retrieve (default: 20, max: 100)
 * @param options.page - The page number for pagination (default: 1, min: 1)
 * @returns Promise that resolves to the transactions
 * @example
 *
 * ## List transactions
 * ```typescript
 * import { Client, Transactions } from "thirdweb/v2";
 *
 * const client = Client.init({
 *   clientId: "YOUR_CLIENT_ID",
 * });
 *
 * const transactions = await Transactions.list({
 *   sender: "0x...",
 *   client,
 * });
 * ```
 */
export async function list(options: list.Options): Promise<list.Result> {
  const result = await listTransactions({
    baseUrl: getThirdwebBaseUrl("api"),
    fetch: getClientFetch(options.client),
    query: {
      from: options.sender,
      limit: options.limit,
      page: options.page,
    }
  });

  if (result.error) {
    throw new Error(
      `Failed to list transactions: ${result.response.status} - ${result.error}`,
    );
  }
  const transactions = result.data?.result?.transactions;
  if (!transactions) {
    throw new Error("Failed to list transactions: no transactions");
  }
  return transactions.map((transaction) => ({
    id: transaction.id,
    transactionHash: transaction.transactionHash as Hex,
    from: transaction.from as Address,
    chainId: transaction.chainId,
    createdAt: transaction.createdAt,
    confirmedAt: transaction.confirmedAt,
    confirmedAtBlockNumber: transaction.confirmedAtBlockNumber,
    cancelledAt: transaction.cancelledAt,
    errorMessage: transaction.errorMessage,
  }));
}

export declare namespace list {
  type Options = {
    client: ThirdwebClient;
    sender: Address;
    limit?: number;
    page?: number;
  };

  type Result = Array<Transaction>;
}

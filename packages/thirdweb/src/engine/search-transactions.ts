import {
  searchTransactions as engineSearchTransactions,
  type TransactionsFilterNested,
  type TransactionsFilterValue,
} from "@thirdweb-dev/engine";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";

export type SearchTransactionsArgs = {
  client: ThirdwebClient;
  filters?: (TransactionsFilterValue | TransactionsFilterNested)[];
  pageSize?: number;
  page?: number;
};

/**
 * Search for transactions by their ids.
 * @param args - The arguments for the search.
 * @param args.client - The thirdweb client to use.
 * @param args.transactionIds - The ids of the transactions to search for.
 * @engine
 * @example
 * ## Search for transactions by their ids
 *
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const transactions = await Engine.searchTransactions({
 *   client,
 *   filters: [
 *     {
 *       field: "id",
 *       values: ["1", "2", "3"],
 *     },
 *   ],
 * });
 * console.log(transactions);
 * ```
 *
 * ## Search for transactions by chain id
 *
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const transactions = await Engine.searchTransactions({
 *   client,
 *   filters: [
 *     {
 *       field: "chainId",
 *       values: ["1", "137"],
 *     },
 *   ],
 * });
 * console.log(transactions);
 * ```
 *
 * ## Search for transactions by sender wallet address
 *
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const transactions = await Engine.searchTransactions({
 *   client,
 *   filters: [
 *     {
 *       field: "from",
 *       values: ["0x1234567890123456789012345678901234567890"],
 *     },
 *   ],
 * });
 * console.log(transactions);
 * ```
 *
 * ## Combined search
 *
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const transactions = await Engine.searchTransactions({
 *   client,
 *   filters: [
 *     {
 *       filters: [
 *         {
 *          field: "from",
 *          values: ["0x1234567890123456789012345678901234567890"],
 *        },
 *        {
 *          field: "chainId",
 *          values: ["8453"],
 *        },
 *      ],
 *      operation: "AND",
 *    },
 *  ],
 *  pageSize: 100,
 *  page: 0,
 * });
 * console.log(transactions);
 * ```
 */
export async function searchTransactions(args: SearchTransactionsArgs) {
  const { client, filters, pageSize = 100, page = 1 } = args;
  const searchResult = await engineSearchTransactions({
    baseUrl: getThirdwebBaseUrl("engineCloud"),
    body: {
      filters,
      limit: pageSize,
      page,
    },
    bodySerializer: stringify,
    fetch: getClientFetch(client),
  });

  if (searchResult.error) {
    throw new Error(
      `Error searching for transaction with filters ${stringify(filters)}: ${stringify(
        searchResult.error,
      )}`,
    );
  }

  const data = searchResult.data?.result;

  if (!data) {
    throw new Error(`No transactions found with filters ${stringify(filters)}`);
  }

  return data;
}

import type { Transaction } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatChainsawTransactions } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  ChainsawInternalTransactions,
  ChainsawPagingParams,
  ChainsawResponse,
} from "../types.ts";
import { getTransactionsEndpoint } from "../urls.js";

export type GetTransactionsParams = Prettify<
  {
    /**
     * A client is the entry point to the thirdweb SDK. It is required for all other actions.
     *
     * You can create a client using the `createThirdwebClient` function.
     * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
     *
     */
    client: ThirdwebClient;
    /**
     * Contract address to fetch transactions for
     */
    to: Address;
    /**
     * Chain IDs to fetch transactions from. If omitted, will look on all supported chains
     */
    chainIds?: number[];
    /**
     * Start of the date range to search in. Default is 1 day ago
     */
    startDate?: Date;
    /**
     * End of the date range to search in. Default is current date
     */
    endDate?: Date;
  } & ChainsawPagingParams
>;

export type GetTransactionsResult = {
  transactions: Transaction[];
  page?: number;
};

/**
 * @beta
 *
 * Get transactions to a contract
 *
 * @param {GetTransactionsParams} params
 * @returns {Promise<GetTransactionsResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getTransactions } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const block = await getTransactions({
 *  client,
 *  to: "0x...",
 *  chainIds: [1],
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 *
 * @example with a date range
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getTransactions } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const startDate = new Date(Date.now() - 24 * 60 * 60_000);
 * const endDate = new Date();
 * const block = await getTransactions({
 *  client,
 *  to: "0x...",
 *  chainIds: [1],
 *  startDate,
 *  endDate,
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 * @chainsaw
 */
export async function getTransactions(
  params: GetTransactionsParams,
): Promise<GetTransactionsResult> {
  try {
    const queryParams = addRequestPagination(
      new URLSearchParams({
        to: params.to.toString(),
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
      }),
      params,
    );
    for (const chainId of params.chainIds || []) {
      queryParams.append("chainIds[]", chainId.toString());
    }
    const url = `${getTransactionsEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<ChainsawInternalTransactions> =
      await response.json();
    if (data.error) throw new Error(data.error);
    return {
      transactions: formatChainsawTransactions(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

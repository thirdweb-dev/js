import type { Transaction } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatChainsawTransactions } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  ChainsawInternalTransaction,
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
     * Contract fetch transactions for
     */
    contract: ThirdwebContract;
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
 * import { createThirdwebClient, defineChain, getTransactions } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const contract = getContract({
 *  client,
 *  chain: defineChain(1),
 *  address: "0x..."
 * });
 *
 * const block = await getTransactions({
 *  client,
 *  contract,
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 *
 * @example with a date range
 * ```ts
 * import { createThirdwebClient, defineChain, getContractTransactions } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const startDate = new Date(Date.now() - 24 * 60 * 60_000);
 * const endDate = new Date();
 * const contract = getContract({
 *  client,
 *  chain: defineChain(1),
 *  address: "0x..."
 * });
 *
 * const block = await getContractTransactions({
 *  client,
 *  contract,
 *  startDate,
 *  endDate,
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 * @chainsaw
 */
export async function getContractTransactions(
  params: GetTransactionsParams,
): Promise<GetTransactionsResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.client)(url.toString());
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<ChainsawInternalTransaction[]> =
      await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      transactions: formatChainsawTransactions(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}

function getEndpointUrl(params: GetTransactionsParams): URL {
  const url = getTransactionsEndpoint();
  url.searchParams.append("to", params.contract.address);
  url.searchParams.append("chainId", params.contract.chain.id.toString());
  if (params.startDate) {
    url.searchParams.append("startDate", params.startDate.toISOString());
  }
  if (params.endDate) {
    url.searchParams.append("endDate", params.endDate.toISOString());
  }
  return addRequestPagination(url, params);
}

import type { Transaction } from "viem";
import type { ThirdwebContract } from "../../contract/contract.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatIndexerTransactions } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  IndexerInternalTransaction,
  IndexerPagingParams,
  IndexerResponse,
} from "../types.ts";
import { getTransactionsEndpoint } from "../urls.js";

export type GetContractTransactionsParams = Prettify<
  {
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
  } & IndexerPagingParams
>;

export type GetTransactionsResult = {
  transactions: Transaction[];
};

/**
 * @beta
 *
 * Get transactions for a contract
 *
 * @param {GetContractTransactionsParams} params
 * @returns {Promise<GetTransactionsResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient, defineChain, getContractTransactions } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const contract = getContract({
 *  chain: defineChain(1),
 *  address: "0x..."
 * });
 *
 * const block = await getContractTransactions({
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
 * const startDate = new Date(Date.now() - 24 * 60 * 60_000);
 * const endDate = new Date();
 * const contract = getContract({
 *  client,
 *  chain: defineChain(1),
 *  address: "0x..."
 * });
 *
 * const block = await getContractTransactions({
 *  contract,
 *  startDate,
 *  endDate,
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 * @contract
 */
export async function getContractTransactions(
  params: GetContractTransactionsParams,
): Promise<GetTransactionsResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.contract.client)(
      url.toString(),
    );
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(
        `Failed to get transactions for contract ${params.contract.address}: ${response.status}`,
      );
    }

    const data: IndexerResponse<IndexerInternalTransaction[]> =
      await response.json();
    if (data.error || !data.data) {
      throw new Error(data.error || "Failed to get transactions for contract");
    }
    return {
      transactions: formatIndexerTransactions(data.data),
    };
  } catch (error) {
    throw new Error("Failed to get transactions", { cause: error });
  }
}

function getEndpointUrl(params: GetContractTransactionsParams): URL {
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

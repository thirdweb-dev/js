import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import { formatChainsawTransactions } from "../formatter.js";
import { addPagingToRequest } from "../paging.js";
import type {
  ChainsawPagingParams,
  ChainsawResponse,
  ChainsawTransactions,
  Transactions,
} from "../types.d.ts";
import { getTransactionsEndpoint } from "../urls.js";

export type GetTransactionsParams = {
  client: ThirdwebClient;
  to: Address;
  chainIds?: number[];
  startDate?: Date;
  endDate?: Date;
} & ChainsawPagingParams;

export type GetTransactionsResult = {
  transactions: Transactions;
  page?: number;
};

/**
 * Get transactions
 *
 * @beta
 */
export async function getTransactions(
  params: GetTransactionsParams,
): Promise<GetTransactionsResult> {
  try {
    const queryParams = addPagingToRequest(
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

    const data: ChainsawResponse<ChainsawTransactions> = await response.json();
    if (data.error) throw new Error(data.error);
    return {
      transactions: formatChainsawTransactions(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

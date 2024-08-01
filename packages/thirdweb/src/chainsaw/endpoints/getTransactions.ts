import type { Transaction } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import { formatChainsawTransactions } from "../formatter.js";
import { addPagingToRequest } from "../paging.js";
import type {
  ChainsawPagingParams,
  ChainsawResponse,
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

/**
 * Get transactions
 *
 * @beta
 */
export async function getTransactions(
  params: GetTransactionsParams,
): Promise<ChainsawResponse<Transaction[]>> {
  try {
    const queryParams = addPagingToRequest(
      new URLSearchParams({
        to: params.to.toString(),
        ...(params.chainIds && { chainIds: params.chainIds.toString() }),
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
      }),
      params,
    );
    const url = `${getTransactionsEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<Transactions> = await response.json();
    return {
      ...data,
      data: formatChainsawTransactions(data.data),
    };
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

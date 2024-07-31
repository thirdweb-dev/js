import type { ThirdwebClient } from "src/client/client.js";
import { getClientFetch } from "src/utils/fetch.js";
import type { ChainsawResponse } from "../types.d.ts";
import { getLatestBlockNumberEndpoint } from "../urls.js";

export type GetLatestBlockNumberParams = {
  client: ThirdwebClient;
  chainId: number;
};

/**
 * Get latest block number for a chain
 *
 * @beta
 */
export async function getLatestBlockNumber(
  params: GetLatestBlockNumberParams,
): Promise<ChainsawResponse<number>> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", params.chainId.toString());
    const url = `${getLatestBlockNumberEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<number> = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

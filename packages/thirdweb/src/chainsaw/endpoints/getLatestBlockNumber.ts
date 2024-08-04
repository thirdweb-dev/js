import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { ChainsawResponse } from "../types.d.ts";
import { getLatestBlockNumberEndpoint } from "../urls.js";

export type GetLatestBlockNumberParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;
  /**
   * Chain ID
   */
  chainId: number;
};

/**
 * Get latest block number for a chain
 *
 * @beta
 */
/**
 * @beta
 *
 * Get the block number of the latest indexed block
 *
 * @param {GetLatestBlockNumberParams} params
 * @returns {Promise<number>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getLatestBlockNumber } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const latestBlockNumber = await getLatestBlockNumber({
 *  client,
 *  chainId: 1
 * });
 * ```
 * @chainsaw
 */
export async function getLatestBlockNumber(
  params: GetLatestBlockNumberParams,
): Promise<number> {
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
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("unable to fetch latest block number");
    return data.data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

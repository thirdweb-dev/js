import type { GetBlockReturnType } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { formatChainsawBlock } from "../formatter.js";
import type { Block, ChainsawResponse } from "../types.d.ts";
import { getBlockEndpoint } from "../urls.js";

export type GetBlockParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;
  /**
   * Number of the block to fetch
   */
  blockNumber: number;
  /**
   * Chain ID of the block
   */
  chainId: number;
};

/**
 * @beta
 *
 * Get data for a single block
 *
 * @param {GetBlockParams} params
 * @returns {Promise<GetBlockReturnType<undefined, false>>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getBlock } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const block = await getBlock({
 *  client,
 *  blockNumber: 9662167,
 *  chainId: 1
 * });
 * ```
 * @chainsaw
 */
export async function getBlock(
  params: GetBlockParams,
): Promise<GetBlockReturnType<undefined, false>> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", params.chainId.toString());
    const url = `${getBlockEndpoint(params.blockNumber)}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<Block> = await response.json();
    if (data.error) throw new Error(data.error);
    const block = formatChainsawBlock(data.data);
    if (!block) throw new Error(`unable to fetch block ${params.blockNumber}`);
    return block;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

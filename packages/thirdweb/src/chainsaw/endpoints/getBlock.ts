import type { BlockTag, GetBlockReturnType } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { formatChainsawBlock } from "../formatter.js";
import type { ChainsawInternalBlock, ChainsawResponse } from "../types.ts";
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
  blockNumber: bigint;
  /**
   * Chain ID of the block
   */
  chainId: number;
};

export type GetBlockResult<TBlockTag extends BlockTag = "latest"> = {
  block: GetBlockReturnType<undefined, false, TBlockTag>;
};

/**
 * @beta
 *
 * Get data for a single block
 *
 * @param {GetBlockParams} params
 * @returns {Promise<GetBlockResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getBlock } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const { block } = await getBlock({
 *  client,
 *  blockNumber: 9662167n,
 *  chainId: 1
 * });
 * ```
 * @chainsaw
 */
export async function getBlock(
  params: GetBlockParams,
): Promise<GetBlockResult> {
  try {
    const url = getBlockEndpoint(params.blockNumber);
    url.searchParams.append("chainId", params.chainId.toString());

    const response = await getClientFetch(params.client)(url.toString());
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<ChainsawInternalBlock> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    const block = formatChainsawBlock(data.data);
    if (!block) {
      throw new Error(`unable to fetch block ${params.blockNumber}`);
    }
    return { block };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}

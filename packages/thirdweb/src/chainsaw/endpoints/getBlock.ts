import type { GetBlockReturnType } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { formatChainsawBlock } from "../formatter.js";
import type { Block, ChainsawResponse } from "../types.d.ts";
import { getBlockEndpoint } from "../urls.js";

export type GetBlockParams = {
  client: ThirdwebClient;
  blockNumber: number;
  chainId: number;
};

/**
 * Get data for a single block
 *
 * @beta
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

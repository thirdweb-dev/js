import type { ThirdwebClient } from "src/client/client.js";
import { getClientFetch } from "src/utils/fetch.js";
import type { Block, ChainsawResponse } from "../types.d.ts";
import { getBlockEndpoint } from "../urls.js";

export type GetBlockParams = {
  client: ThirdwebClient;
  blockNumber: number;
  chainId: number;
};

export async function getBlock(
  params: GetBlockParams,
): Promise<ChainsawResponse<Block>> {
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
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

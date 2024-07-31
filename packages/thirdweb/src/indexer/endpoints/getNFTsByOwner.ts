import type { ThirdwebClient } from "src/client/client.js";
import type { Address } from "src/utils/address.js";
import { getClientFetch } from "src/utils/fetch.js";
import { addPagingToRequest } from "../paging.js";
import type {
  ChainsawPagingParams,
  ChainsawResponse,
  NFTsData,
} from "../types.d.ts";
import { getNftsByOwnerEndpoint } from "../urls.js";

export type GetNFTsByOwnerParams = {
  client: ThirdwebClient;
  ownerAddresses: Address[];
  chainIds?: number[];
} & ChainsawPagingParams;

/**
 * Get NFTs by owner address(es)
 *
 * @beta
 */
export async function getNFTsByOwner(
  params: GetNFTsByOwnerParams,
): Promise<ChainsawResponse<NFTsData>> {
  try {
    const queryParams = addPagingToRequest(
      new URLSearchParams({
        ownerAddresses: params.ownerAddresses.toString(),
        ...(params.chainIds && { chainIds: params.chainIds.toString() }),
      }),
      params,
    );
    const url = `${getNftsByOwnerEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<NFTsData> = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

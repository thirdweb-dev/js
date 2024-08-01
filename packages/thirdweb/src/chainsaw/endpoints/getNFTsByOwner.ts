import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import { formatChainsawNFTs } from "../formatter.js";
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
): Promise<ChainsawResponse<NFT[]>> {
  try {
    const queryParams = addPagingToRequest(new URLSearchParams(), params);
    for (const ownerAddress of params.ownerAddresses) {
      queryParams.append("ownerAddresses[]", ownerAddress);
    }
    for (const chainId of params.chainIds || []) {
      queryParams.append("chainIds[]", chainId.toString());
    }
    const url = `${getNftsByOwnerEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<NFTsData> = await response.json();
    return {
      ...data,
      data: formatChainsawNFTs(data.data),
    };
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

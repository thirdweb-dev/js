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
import { getNftsByCollectionEndpoint } from "../urls.js";

export type GetNFTsGroupBy = "ownerAddress";

export type GetNFTsByCollectionParams = {
  client: ThirdwebClient;
  contractAddresses: Address[];
  chainIds?: number[];
  groupBy?: GetNFTsGroupBy;
} & ChainsawPagingParams;

/**
 * Get NFTs for a collection
 *
 * @beta
 */
export async function getNFTsByCollection(
  params: GetNFTsByCollectionParams,
): Promise<ChainsawResponse<NFT[]>> {
  try {
    const queryParams = addPagingToRequest(
      new URLSearchParams({
        contractAddresses: params.contractAddresses.toString(),
        ...(params.chainIds && { chainIds: params.chainIds.toString() }),
        ...(params.groupBy && { groupBy: params.groupBy.toString() }),
      }),
      params,
    );
    const url = `${getNftsByCollectionEndpoint()}?${queryParams.toString()}`;

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

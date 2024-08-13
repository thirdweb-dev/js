import type { ThirdwebContract } from "../../contract/contract.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatIndexerNFTs } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  IndexerInternalNFT,
  IndexerPagingParams,
  IndexerResponse,
} from "../types.js";
import { getNftsByCollectionEndpoint } from "../urls.js";

export type GetNFTsGroupBy = "ownerAddress";

export type GetNFTsByCollectionParams = Prettify<
  {
    /**
     * NFT collection contract
     */
    contract: ThirdwebContract;
    /**
     * Parameters to group results count by. Currently supports "ownerAddress"
     */
    groupBy?: GetNFTsGroupBy;
  } & IndexerPagingParams
>;

export type GetNFTsByCollectionResult = {
  nfts: NFT[];
  page?: number;
};

/**
 * @beta
 *
 * Get NFTs for a collection
 *
 * @param {GetNFTsByCollectionParams} params
 * @returns {Promise<GetNFTsByCollectionResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient, defineChain, getNFTsByCollection, getContract } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const contract = getContract({
 *  client,
 *  address: "0x...",
 *  chain: defineChain(1)
 * });
 * const nfts = await getNFTsByCollection({
 *  client,
 *  contract,
 *  groupBy: ["ownerAddress"],
 * });
 * ```
 */
export async function getNFTsByCollection(
  params: GetNFTsByCollectionParams,
): Promise<GetNFTsByCollectionResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.contract.client)(
      url.toString(),
    );
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IndexerResponse<IndexerInternalNFT[]> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      nfts: formatIndexerNFTs(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}

function getEndpointUrl(params: GetNFTsByCollectionParams): URL {
  const url = getNftsByCollectionEndpoint();
  url.searchParams.append("contractAddress", params.contract.address);
  url.searchParams.append("chainId", params.contract.chain.id.toString());
  if (params.groupBy) {
    url.searchParams.append("groupBy", params.groupBy);
  }
  return addRequestPagination(url, params);
}

import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatChainsawNFTs } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  ChainsawInternalNFT,
  ChainsawPagingParams,
  ChainsawResponse,
} from "../types.js";
import { getNftsByOwnerEndpoint } from "../urls.js";

export type GetNFTsByOwnerParams = Prettify<
  {
    /**
     * A client is the entry point to the thirdweb SDK. It is required for all other actions.
     *
     * You can create a client using the `createThirdwebClient` function.
     * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
     *
     */
    client: ThirdwebClient;
    /**
     * Address of the NFT owner
     */
    ownerAddress: string;
    /**
     * Chain to search from
     */
    chain?: Chain;
  } & ChainsawPagingParams
>;

export type GetNFTsByOwnerResult = {
  nfts: NFT[];
  page?: number;
};

/**
 * @beta
 *
 * Get NFTs by owner address
 *
 * @param {GetNFTsByOwnerParams} params
 * @returns {Promise<GetNFTsByOwnerResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient, getNFTsByOwnert } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const nfts = await getNFTsByOwner({
 *  client,
 *  ownerAddress: "0x...",
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 * @chainsaw
 */
export async function getNFTsByOwner(
  params: GetNFTsByOwnerParams,
): Promise<GetNFTsByOwnerResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.client)(url.toString());
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<ChainsawInternalNFT[]> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      nfts: formatChainsawNFTs(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}

function getEndpointUrl(params: GetNFTsByOwnerParams): URL {
  const url = getNftsByOwnerEndpoint();
  url.searchParams.append("ownerAddress", params.ownerAddress);
  if (params.chain) {
    url.searchParams.append("chainId", params.chain?.id.toString());
  }
  return addRequestPagination(url, params);
}

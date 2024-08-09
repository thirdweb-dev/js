import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatChainsawNFTs } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  ChainsawInternalNFTs,
  ChainsawPagingParams,
  ChainsawResponse,
} from "../types.js";
import { getNftsByCollectionEndpoint } from "../urls.js";

export type GetNFTsGroupBy = "ownerAddress";

export type GetNFTsByCollectionParams = Prettify<
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
     * Addresses of NFT collections
     */
    contractAddresses: Address[];
    /**
     * Chain IDs to search from
     */
    chainIds?: number[];
    /**
     * Parameters to group results count by. Currently supports "ownerAddress"
     */
    groupBy?: GetNFTsGroupBy;
  } & ChainsawPagingParams
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
 * import { createThirdwebClient } from "thirdweb";
 * import { getNFTsByCollection } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const nfts = await getNFTsByCollection({
 *  client,
 *  contractAddresses: ["0x..."],
 *  chainIds: [1],
 *  groupBy: ["ownerAddress"],
 * });
 * ```
 * @chainsaw
 */
export async function getNFTsByCollection(
  params: GetNFTsByCollectionParams,
): Promise<GetNFTsByCollectionResult> {
  try {
    const queryParams = addRequestPagination(
      new URLSearchParams({
        ...(params.groupBy && { groupBy: params.groupBy.toString() }),
      }),
      params,
    );
    for (const contractAddress of params.contractAddresses) {
      queryParams.append("contractAddresses[]", contractAddress);
    }
    for (const chainId of params.chainIds || []) {
      queryParams.append("chainIds[]", chainId.toString());
    }
    const url = `${getNftsByCollectionEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<ChainsawInternalNFTs> = await response.json();
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

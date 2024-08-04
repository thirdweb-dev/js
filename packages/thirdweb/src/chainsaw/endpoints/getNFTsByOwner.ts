import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatChainsawNFTs } from "../formatter.js";
import { addPagingToRequest } from "../paging.js";
import type {
  ChainsawPagingParams,
  ChainsawResponse,
  NFTs,
  NFTsData,
} from "../types.d.ts";
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
     * Addresses of the NFT owners
     */
    ownerAddresses: Address[];
    /**
     * Chain IDs to search from
     */
    chainIds?: number[];
  } & ChainsawPagingParams
>;

export type GetNFTsByOwnerResult = {
  nfts: NFTs;
  page?: number;
};

/**
 * @beta
 *
 * Get NFTs by owner address(es)
 *
 * @param {GetNFTsByOwnerParams} params
 * @returns {Promise<GetNFTsByOwnerResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getNFTsByOwner } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const startDate = new Date(Date.now() - 48 * 60 * 60_000);
 * const endDate = new Date(Date.now() - 24 * 60 * 60_000);
 * const nfts = await getNFTsByOwner({
 *  client,
 *  ownerAddresses: ["0x..."],
 *  chainIds: [1],
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
    if (data.error) throw new Error(data.error);
    return {
      nfts: formatChainsawNFTs(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}

import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { type NFT, parseNFT } from "../../../utils/nft/parseNft.js";
import type { Prettify } from "../../../utils/type-utils.js";
import {
  type TokenURIParams,
  tokenURI,
} from "../__generated__/IERC721A/read/tokenURI.js";
import { tokenByIndex } from "../__generated__/IERC721Enumerable/read/tokenByIndex.js";

export { isTokenURISupported as isGetNFTSupported } from "../__generated__/IERC721A/read/tokenURI.js";

import { getNFT as getNFTInsight } from "../../../insight/index.js";

/**
 * Parameters for getting an NFT.
 * @extension ERC721
 */
export type GetNFTParams = Prettify<
  TokenURIParams & {
    /**
     * Whether to include the owner of the NFT.
     */
    includeOwner?: boolean;
    /**
     * Whether to check and fetch tokenID by index, in case of non-sequential IDs.
     *
     * It should be set to true if it's an ERC721Enumerable contract, and has `tokenByIndex` function.
     * In this case, the provided tokenId will be considered as token-index and actual tokenId will be fetched from the contract.
     */
    tokenByIndex?: boolean;
    /**
     * Whether to use the insight API to fetch the NFT.
     * @default true
     */
    useIndexer?: boolean;
  }
>;

/**
 * Retrieves information about a specific ERC721 non-fungible token (NFT).
 * @param options - The options for retrieving the NFT.
 * @returns A promise that resolves to the NFT object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getNFT } from "thirdweb/extensions/erc721";
 * const nft = await getNFT({
 *  contract,
 *  tokenId: 1n,
 * });
 * ```
 *
 * * @example
 * ```ts
 * import { getNFT } from "thirdweb/extensions/erc721";
 *
 *
 * const nft = await getNFT({
 *  contract,
 *  tokenId: 1n,
 *  tokenByIndex: true // use this flag if the contract supports `tokenByIndex` and the above tokenId should be treated as an index.
 * });
 * ```
 */
export async function getNFT(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  const { useIndexer = true } = options;
  if (useIndexer) {
    try {
      return await getNFTFromInsight(options);
    } catch {
      return await getNFTFromRPC(options);
    }
  }
  return await getNFTFromRPC(options);
}

async function getNFTFromInsight(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  const nft = await getNFTInsight({
    chain: options.contract.chain,
    client: options.contract.client,
    contractAddress: options.contract.address,
    includeOwners: options.includeOwner,
    tokenId: options.tokenId,
  });
  if (!nft) {
    // fresh contracts might be delayed in indexing, so we fallback to RPC
    return getNFTFromRPC(options);
  }
  return nft;
}

async function getNFTFromRPC(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  let tokenId = options.tokenId;
  if (options.tokenByIndex) {
    try {
      tokenId = await tokenByIndex({
        contract: options.contract,
        index: options.tokenId,
      });
    } catch {}
  }

  const [uri, owner] = await Promise.all([
    tokenURI({ contract: options.contract, tokenId }).catch(() => null),
    options.includeOwner
      ? import("../__generated__/IERC721A/read/ownerOf.js")
          .then((m) => m.ownerOf({ contract: options.contract, tokenId }))
          .catch(() => null)
      : null,
  ]);

  if (!uri?.trim()) {
    return parseNFT(
      {
        id: tokenId,
        type: "ERC721",
        uri: "",
      },
      {
        chainId: options.contract.chain.id,
        owner,
        tokenAddress: options.contract.address,
        tokenId,
        tokenUri: "",
        type: "ERC721",
      },
    );
  }

  return parseNFT(
    await fetchTokenMetadata({
      client: options.contract.client,
      tokenId,
      tokenUri: uri,
    }).catch(() => ({
      id: tokenId,
      type: "ERC721",
      uri,
    })),
    {
      chainId: options.contract.chain.id,
      owner,
      tokenAddress: options.contract.address,
      tokenId: tokenId,
      tokenUri: uri,
      type: "ERC721",
    },
  );
}

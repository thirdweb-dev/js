import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { parseNFT, type NFT } from "../../../utils/nft/parseNft.js";
import type { Prettify } from "../../../utils/type-utils.js";
import {
  tokenURI,
  type TokenURIParams,
} from "../__generated__/IERC721A/read/tokenURI.js";

/**
 * Parameters for getting an NFT.
 */
export type GetNFTParams = Prettify<
  TokenURIParams & {
    /**
     * Whether to include the owner of the NFT.
     */
    includeOwner?: boolean;

    /**
     * Whether to load the metadata of the NFT.
     * If you don't need the metadata,
     * setting this to `true` might improve the performance
     */
    includeMetadata?: boolean;
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
 */
export async function getNFT(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  const { tokenId, includeMetadata, includeOwner } = options;
  const [uri, owner] = await Promise.all([
    tokenURI(options).catch(() => null),
    includeOwner
      ? import("../__generated__/IERC721A/read/ownerOf.js")
          .then((m) => m.ownerOf(options))
          .catch(() => null)
      : null,
  ]);

  if (!uri) {
    return parseNFT(
      {
        id: tokenId,
        type: "ERC721",
        uri: "",
      },
      {
        tokenId: tokenId,
        tokenUri: "",
        type: "ERC721",
        owner,
      },
    );
  }

  const baseMetadata = {
    id: tokenId,
    type: "ERC721",
    uri,
  };

  const metadata = includeMetadata
    ? await import("../../../utils/nft/fetchTokenMetadata.js").then((m) =>
        m
          .fetchTokenMetadata({
            client: options.contract.client,
            tokenId: tokenId,
            tokenUri: uri,
          })
          .catch(() => baseMetadata),
      )
    : baseMetadata;

  return parseNFT(metadata, {
    tokenId: tokenId,
    tokenUri: uri,
    type: "ERC721",
    owner,
  });
}

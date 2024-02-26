import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { parseNFT, type NFT } from "../../../utils/nft/parseNft.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { tokenURI, type TokenUriParams } from "./tokenURI.js";

/**
 * Parameters for getting an NFT.
 */
export type GetNFTParams = Prettify<
  TokenUriParams & {
    /**
     * Whether to include the owner of the NFT.
     */
    includeOwner?: boolean;
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
): Promise<NFT<"ERC721">> {
  const [uri, owner] = await Promise.all([
    tokenURI(options).catch(() => null),
    options.includeOwner
      ? import("./ownerOf.js").then((m) => m.ownerOf(options)).catch(() => null)
      : null,
  ]);

  if (!uri) {
    return parseNFT(
      {
        id: options.tokenId,
        type: "ERC721",
        uri: "",
      },
      {
        tokenId: options.tokenId,
        tokenUri: "",
        type: "ERC721",
        owner,
      },
    );
  }

  return parseNFT(
    await fetchTokenMetadata({
      client: options.contract.client,
      tokenId: options.tokenId,
      tokenUri: uri,
    }).catch(() => ({
      id: options.tokenId,
      type: "ERC721",
      uri,
    })),
    {
      tokenId: options.tokenId,
      tokenUri: uri,
      type: "ERC721",
      owner,
    },
  );
}

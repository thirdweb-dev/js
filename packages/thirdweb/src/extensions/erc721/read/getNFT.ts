import { tokenURI, type TokenUriParams } from "./tokenURI.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { parseNFT, type NFT } from "../../../utils/nft/parseNft.js";
import type { TxOpts } from "../../../transaction/transaction.js";

/**
 * Parameters for getting an NFT.
 */
export type GetNFTParams = TokenUriParams & {
  /**
   * Whether to include the owner of the NFT.
   */
  includeOwner?: boolean;
};

/**
 * Retrieves information about a specific ERC721 non-fungible token (NFT).
 * @param options - The options for retrieving the NFT.
 * @returns A promise that resolves to the NFT object.
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
  options: TxOpts<GetNFTParams>,
): Promise<NFT<"ERC721">> {
  const [uri, owner] = await Promise.all([
    tokenURI(options),
    options.includeOwner
      ? import("./ownerOf.js").then((m) => m.ownerOf(options))
      : null,
  ]);
  return parseNFT(
    await fetchTokenMetadata({
      client: options.contract.client,
      tokenId: options.tokenId,
      tokenUri: uri,
    }),
    {
      tokenId: options.tokenId,
      tokenUri: uri,
      type: "ERC721",
      owner,
    },
  );
}

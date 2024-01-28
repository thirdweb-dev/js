import { tokenURI, type TokenUriParams } from "./tokenURI.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { parseNFT, type NFT } from "../../../utils/nft/parseNft.js";
import type { TxOpts } from "../../../transaction/transaction.js";
import { createReadExtension } from "../../../utils/extension.js";

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
 * Retrieves information about a specific ERC721 token.
 *
 * @param options - The options for retrieving the token information.
 * @returns A promise that resolves to the parsed ERC721 token information.
 */
export const getNFT = /*@__PURE__*/ createReadExtension("erc721.getNFT")(
  async function (options: TxOpts<GetNFTParams>): Promise<NFT<"ERC721">> {
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
  },
);

import { tokenURI, type TokenUriParams } from "./tokenURI.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { parseNFT } from "../../../utils/nft/parseNft.js";
import type {
  ThirdwebClientLike,
  TxOpts,
} from "../../../transaction/transaction.js";

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
 * Retrieves the metadata of a non-fungible token (NFT) from a contract.
 * @param contract - The {@link ThirdwebContract} instance representing the ERC721 contract.
 * @param params - The {@link GetNFTParams} object containing the token ID and additional options.
 * @returns A promise that resolves to a {@link NFT}.
 */
export async function getNFT<client extends ThirdwebClientLike>(
  options: TxOpts<client, GetNFTParams>,
) {
  const [uri, owner] = await Promise.all([
    tokenURI(options),
    options.includeOwner
      ? import("./ownerOf.js").then((m) => m.ownerOf(options))
      : null,
  ]);
  return parseNFT(
    await fetchTokenMetadata({
      client: options.client,
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

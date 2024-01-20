import type { ThirdwebContract } from "../../../contract/index.js";
import { tokenURI, type TokenUriParams } from "./tokenURI.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { parseNFT } from "../../../utils/nft/parseNft.js";

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
export async function getNFT(contract: ThirdwebContract, params: GetNFTParams) {
  const [uri, owner] = await Promise.all([
    tokenURI(contract, params),
    params.includeOwner
      ? import("./ownerOf.js").then((m) => m.ownerOf(contract, params))
      : null,
  ]);
  return parseNFT(
    await fetchTokenMetadata({
      client: contract,
      tokenId: params.tokenId,
      tokenUri: uri,
    }),
    {
      tokenId: params.tokenId,
      tokenUri: uri,
      type: "ERC721",
      owner,
    },
  );
}

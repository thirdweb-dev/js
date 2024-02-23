import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { parseNFT, type NFT } from "../../../utils/nft/parseNft.js";
import { uri, type TokenUriParams } from "./uri.js";
import { totalSupply } from "./totalSupply.js";

/**
 * Parameters for getting an NFT.
 */
export type GetNFTParams = TokenUriParams;

/**
 * Retrieves information about a specific ERC1155 non-fungible token (NFT).
 * @param options - The options for retrieving the NFT.
 * @returns A promise that resolves to the NFT object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getNFT } from "thirdweb/extensions/erc1155";
 * const nft = await getNFT({
 *  contract,
 *  tokenId: 1n,
 * });
 * ```
 */
export async function getNFT(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT<"ERC1155">> {
  const [tokenUri, supply] = await Promise.all([
    uri(options),
    totalSupply(options),
  ]);
  return parseNFT(
    await fetchTokenMetadata({
      client: options.contract.client,
      tokenId: options.tokenId,
      tokenUri,
    }),
    {
      tokenId: options.tokenId,
      tokenUri,
      type: "ERC1155",
      owner: null,
      supply,
    },
  );
}

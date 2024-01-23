import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";

export type TokenUriParams = { tokenId: bigint };

/**
 * Retrieves the token URI for a given token ID from the ERC721 contract.
 * @param contract - The {@link ThirdwebContract} instance representing the ERC721 contract.
 * @param options - The token URI parameters.
 * @returns A promise that resolves to the token URI string.
 */
export async function tokenURI(
  contract: ThirdwebContract,
  options: TokenUriParams,
) {
  return read(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method:
      "function tokenURI(uint256 tokenId) external view returns (string memory)",
    params: [BigInt(options.tokenId)],
  });
}

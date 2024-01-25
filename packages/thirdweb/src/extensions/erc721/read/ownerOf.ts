import { type TxOpts } from "../../../transaction/transaction.js";
import { read } from "../../../transaction/actions/read.js";

export type OwnerOfParams = { tokenId: bigint };

/**
 * Retrieves the owner of a specific ERC721 token.
 * @param contract - The {@link ThirdwebContract} representing the ERC721 contract.
 * @param options - The parameters for the ownerOf function.
 * @returns A Promise that resolves to the address of the token owner.
 */
export async function ownerOf(options: TxOpts<OwnerOfParams>) {
  return read({
    ...options,
    method:
      "function ownerOf(uint256 tokenId) external view returns (address owner)",
    params: [BigInt(options.tokenId)],
  });
}

import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the start token ID of the ERC721 contract.
 * @param contract - The ERC721 contract.
 * @returns A promise that resolves to the start token ID.
 */
export async function startTokenId(contract: ThirdwebContract) {
  return read(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function startTokenId() view returns (uint256)",
  });
}

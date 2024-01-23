import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the next token ID to be minted from the ERC721 contract.
 * @param contract - The ERC721 contract instance.
 * @returns A promise that resolves to the next token ID to be minted.
 */
export async function nextTokenIdToMint(contract: ThirdwebContract) {
  return read(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function nextTokenIdToMint() view returns (uint256)",
  });
}

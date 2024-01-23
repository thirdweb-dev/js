import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the symbol of the ERC20 contract.
 * @param contract - The ERC20 contract instance.
 * @returns A promise that resolves to the symbol of the ERC20 contract.
 */
export async function symbol(contract: ThirdwebContract) {
  // TODO consider caching this
  return read(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function symbol() view returns (string)",
  });
}

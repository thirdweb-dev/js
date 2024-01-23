import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";

/**
 * Retrieves the number of decimal places used by the ERC20 token.
 * @param contract - The ERC20 contract instance.
 * @returns A promise that resolves to the number of decimal places.
 */
export async function decimals(contract: ThirdwebContract) {
  // TODO consider caching this
  return read(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function decimals() view returns (uint8)",
  });
}

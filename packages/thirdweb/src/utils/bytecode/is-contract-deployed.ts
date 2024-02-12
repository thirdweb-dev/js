import type { ThirdwebContract } from "../../contract/contract.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";

/**
 * Checks if a contract is deployed by verifying its bytecode.
 * @param contract - The contract to check.
 * @returns A promise that resolves to a boolean indicating whether the contract is deployed or not.
 * @example
 * ```ts
 * import { getContract } from "thirdweb/contract";
 * import { isContractDeployed } from "thirdweb/contract/utils";
 *
 * const contract = getContract({ ... });
 * const isDeployed = await isContractDeployed(contract);
 * console.log(isDeployed);
 * ```
 */
export async function isContractDeployed(
  contract: ThirdwebContract,
): Promise<boolean> {
  return (await getBytecode(contract)) !== "0x";
}

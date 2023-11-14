import type { ContractWrapper } from "../../core/classes/contract-wrapper";
import type { BaseContract } from "ethers";

/**
 * @internal
 * @param contractWrapper - The contract wrapper to check
 * @param functionName - The function name to check
 */
export function hasFunction<TContract extends BaseContract>(
  functionName: string,
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<TContract> {
  return functionName in contractWrapper.readContract.functions;
}

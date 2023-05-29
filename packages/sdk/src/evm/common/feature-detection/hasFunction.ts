import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { BaseContract } from "ethers";

/**
 * @internal
 * @param contractWrapper
 * @param functionName
 */
export function hasFunction<TContract extends BaseContract>(
  functionName: string,
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<TContract> {
  return functionName in contractWrapper.readContract.functions;
}

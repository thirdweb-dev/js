import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { BaseContract } from "ethers";
import { hasMatchingAbi } from "./hasMatchingAbi";

/**
 * @internal
 * @param contractWrapper
 * @param abi
 * @returns
 */
export function matchesPrebuiltAbi<T extends BaseContract>(
  contractWrapper: ContractWrapper<BaseContract>,
  abi: AbiInput,
): contractWrapper is ContractWrapper<T> {
  return hasMatchingAbi(AbiSchema.parse(contractWrapper.abi || []), [abi]);
}

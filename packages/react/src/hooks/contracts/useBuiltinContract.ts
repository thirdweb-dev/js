import { useSDK } from "../../Provider";
import { ContractForContractType, ContractType } from "@thirdweb-dev/sdk";

/**
 * @internal
 * @param contractType - the contract type
 * @param contractAddress - the contract address
 * @returns the instance of the contract for the given type and address
 */
export function useBuiltinContract<TContractType extends ContractType>(
  contractType?: TContractType,
  contractAddress?: string,
): ContractForContractType<TContractType> | undefined {
  const sdk = useSDK();
  if (!sdk || !contractAddress || !contractType) {
    return undefined;
  }
  return sdk.getBuiltInContract(contractAddress, contractType);
}

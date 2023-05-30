import { FeatureName } from "../../constants/contract-features";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { AbiSchema } from "../../schema/contracts/custom";
import { BaseContract } from "ethers";
import { isFeatureEnabled } from "./isFeatureEnabled";

/**
 * Type guard for contractWrappers depending on passed feature name
 * @internal
 * @param contractWrapper
 * @param featureName
 */
export function detectContractFeature<T extends BaseContract>(
  contractWrapper: ContractWrapper<BaseContract>,
  featureName: FeatureName,
): contractWrapper is ContractWrapper<T> {
  return isFeatureEnabled(AbiSchema.parse(contractWrapper.abi), featureName);
}

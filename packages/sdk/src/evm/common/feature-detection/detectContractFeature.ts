import { FeatureName } from "../../constants/contract-features";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { AbiSchema } from "../../schema/contracts/custom";
import { BaseContract } from "ethers";
import { isExtensionEnabled } from "./isFeatureEnabled";

/**
 * Type guard for contractWrappers depending on passed feature name
 * @internal
 * @param contractWrapper - The contract wrapper to check
 * @param featureName - The feature name to check
 */
export function detectContractFeature<T extends BaseContract>(
  contractWrapper: ContractWrapper<BaseContract>,
  featureName: FeatureName,
): contractWrapper is ContractWrapper<T> {
  return isExtensionEnabled(AbiSchema.parse(contractWrapper.abi), featureName);
}

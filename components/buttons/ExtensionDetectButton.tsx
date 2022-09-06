import { useContract } from "@thirdweb-dev/react";
import { detectContractFeature } from "@thirdweb-dev/sdk";
import { FeatureName } from "@thirdweb-dev/sdk/dist/declarations/src/constants/contract-features";
import { ContractWrapper } from "@thirdweb-dev/sdk/dist/declarations/src/core/classes/contract-wrapper";
import { DetectableFeature } from "@thirdweb-dev/sdk/dist/declarations/src/core/interfaces/DetectableFeature";
import { ButtonProps } from "tw-components";

export interface FeatureDetectButtonProps
  extends ButtonProps,
    ExtensionDetectedStateParams {}
export interface ExtensionDetectedStateParams {
  /**
   * The feature or features to check
   */
  feature: FeatureName | FeatureName[];

  /**
   * The contract instance to check
   */
  contract: ReturnType<typeof useContract> | DetectableFeature;

  /**
   * the feature match strategy (default: any)
   * - any: any of the features must be available
   * - all: all of the features must be available
   */
  matchStrategy?: "any" | "all";
}

export type ExtensionDetectedState = "enabled" | "disabled" | "loading";

export function extensionDetectedState({
  contract,
  feature,
  matchStrategy = "any",
}: ExtensionDetectedStateParams): ExtensionDetectedState {
  // if contract is loading return "loading"
  if ("contract" in contract && contract.isLoading) {
    return "loading";
  }

  const actualContract = "contract" in contract ? contract.contract : contract;

  // we're not loading but don't have a contract, so we'll assumed feature is disabled (really this is an error state?)
  if (!actualContract) {
    return "disabled";
  }

  const contractWrapper = (actualContract as any)
    .contractWrapper as ContractWrapper<any>;

  if (!Array.isArray(feature)) {
    return detectContractFeature(contractWrapper, feature)
      ? "enabled"
      : "disabled";
  }

  if (matchStrategy === "all") {
    return feature.every((f) => detectContractFeature(contractWrapper, f))
      ? "enabled"
      : "disabled";
  }
  return feature.some((f) => detectContractFeature(contractWrapper, f))
    ? "enabled"
    : "disabled";
}

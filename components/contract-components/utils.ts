import { Abi, ContractId } from "./types";
import {
  PREBUILT_CONTRACTS_MAP,
  ValidContractInstance,
  isFeatureEnabled,
} from "@thirdweb-dev/sdk";
import { FeatureName } from "@thirdweb-dev/sdk/dist/declarations/src/constants/contract-features";

export function isContractIdBuiltInContract(
  contractId: ContractId,
): contractId is keyof typeof PREBUILT_CONTRACTS_MAP {
  return contractId in PREBUILT_CONTRACTS_MAP;
}

export function detectFeatures<TContract extends ValidContractInstance | null>(
  contract: ValidContractInstance | null | undefined,
  features: FeatureName[],
  strategy: "any" | "all" = "any",
): contract is TContract {
  if (!contract) {
    return false;
  }
  if (!("abi" in contract)) {
    return false;
  }

  if (strategy === "any") {
    return features.some((feature) =>
      isFeatureEnabled(contract?.abi as Abi, feature),
    );
  }

  return features.every((feature) =>
    isFeatureEnabled(contract?.abi as Abi, feature),
  );
}

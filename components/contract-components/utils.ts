import { Abi, ContractId } from "./types";
import {
  KNOWN_CONTRACTS_MAP,
  SmartContract,
  ValidContractInstance,
  isFeatureEnabled,
} from "@thirdweb-dev/sdk";
import { FeatureName } from "@thirdweb-dev/sdk/dist/declarations/src/constants/contract-features";

export function isContractIdBuiltInContract(
  contractId: ContractId,
): contractId is keyof typeof KNOWN_CONTRACTS_MAP {
  return contractId in KNOWN_CONTRACTS_MAP;
}

export function detectFeatures<
  TContract extends SmartContract | ValidContractInstance | null,
>(
  contract: SmartContract | ValidContractInstance | null,
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

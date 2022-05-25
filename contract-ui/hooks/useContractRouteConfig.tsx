import { Route } from "@tanstack/react-location";
import { useContract } from "@thirdweb-dev/react";
import {
  SmartContract,
  ValidContractInstance,
  detectContractFeature,
} from "@thirdweb-dev/sdk";
import { FeatureName } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import { ContractWrapper } from "@thirdweb-dev/sdk/dist/src/core/classes/contract-wrapper";
import React from "react";

export type EnhancedRoute = Route & {
  title: string;
  path: string;
  isEnabled?: boolean;
};

export function useContractRouteConfig(
  contractAddress?: string,
): EnhancedRoute[] {
  const contract = useContract(contractAddress);

  return [
    {
      title: "Overview",
      path: "/",
      element: () =>
        import("../tabs/overview/page").then(
          ({ CustomContractOverviewPage }) => (
            <CustomContractOverviewPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Code",
      path: "code",
      element: () =>
        import("../tabs/code/page").then(({ CustomContractCodeTab }) => (
          <CustomContractCodeTab contractAddress={contractAddress} />
        )),
    },
    {
      title: "NFTs",
      path: "nfts",
      isEnabled: isFeatureEnabledFromContract(contract.contract, [
        "ERC721",
        "ERC1155",
      ]),
      element: () =>
        import("../tabs/nfts/page").then(({ ContractNFTPage }) => (
          <ContractNFTPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: isFeatureEnabledFromContract(contract.contract, ["ERC20"]),
      element: () =>
        import("../tabs/tokens/page").then(({ ContractTokensPage }) => (
          <ContractTokensPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Settings",
      path: "settings",
      element: () =>
        import("../tabs/settings/page").then(
          ({ CustomContractSettingsTab }) => (
            <CustomContractSettingsTab contractAddress={contractAddress} />
          ),
        ),
    },
  ];
}

function isFeatureEnabledFromContract(
  contract: ValidContractInstance | SmartContract | null = null,
  featureName: FeatureName | FeatureName[],
): boolean {
  if (!contract) {
    return false;
  }

  const contractWrapper = (contract as any)
    .contractWrapper as ContractWrapper<any>;

  return Array.isArray(featureName)
    ? featureName.some((f) => detectContractFeature(contractWrapper, f))
    : detectContractFeature(contractWrapper, featureName);
}

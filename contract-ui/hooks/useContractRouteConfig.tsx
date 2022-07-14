import { Route } from "@tanstack/react-location";
import { useContract } from "@thirdweb-dev/react";
import {
  ExtensionDetectedState,
  extensionDetectedState,
} from "components/buttons/ExtensionDetectButton";
import React from "react";

export type EnhancedRoute = Route & {
  title: string;
  path: string;
  isEnabled?: ExtensionDetectedState;
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
      title: "NFTs",
      path: "nfts",
      isEnabled: extensionDetectedState({
        contract,
        feature: ["ERC1155", "ERC721"],
      }),
      element: () =>
        import("../tabs/nfts/page").then(({ ContractNFTPage }) => (
          <ContractNFTPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: extensionDetectedState({ contract, feature: "ERC20" }),
      element: () =>
        import("../tabs/tokens/page").then(({ ContractTokensPage }) => (
          <ContractTokensPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Permissions",
      path: "permissions",
      isEnabled: extensionDetectedState({ contract, feature: "Permissions" }),
      element: () =>
        import("../tabs/permissions/page").then(
          ({ ContractPermissionsPage }) => (
            <ContractPermissionsPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Code",
      path: "code",
      element: () =>
        import("../tabs/code/page").then(({ ContractCodePage }) => (
          <ContractCodePage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Activity",
      path: "activity",
      element: () =>
        import("../tabs/activity/page").then(({ ContractActivityPage }) => (
          <ContractActivityPage contractAddress={contractAddress} />
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
    {
      title: "Source",
      path: "source",
      element: () =>
        import("../tabs/source/page").then(({ CustomContractSourcePage }) => (
          <CustomContractSourcePage contractAddress={contractAddress} />
        )),
    },
  ];
}

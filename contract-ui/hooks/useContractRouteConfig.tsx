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
  const contractType = contract.data?.contractType;
  const embedEnabled =
    contractType === "nft-drop" ||
    contractType === "marketplace" ||
    contractType === "edition-drop" ||
    contractType === "token-drop" ||
    contractType === "signature-drop";

  return [
    {
      title: "Explorer",
      path: "/",
      element: () =>
        import("../tabs/overview/page").then(
          ({ CustomContractOverviewPage }) => (
            <CustomContractOverviewPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Events",
      path: "events",
      element: () =>
        import("../tabs/events/page").then(({ ContractEventsPage }) => (
          <ContractEventsPage contractAddress={contractAddress} />
        )),
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
      title: "Claim Conditions",
      path: "claim-conditions",
      isEnabled: extensionDetectedState({
        contract,
        feature: "ERC721Claimable",
      }),
      element: () =>
        import("../tabs/claim-conditions/page").then(
          ({ ContractClaimConditionsPage }) => (
            <ContractClaimConditionsPage contractAddress={contractAddress} />
          ),
        ),
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
      title: "Embed",
      path: "embed",
      element: () =>
        import("../tabs/embed/page").then(({ CustomContractEmbedPage }) => (
          <CustomContractEmbedPage contractAddress={contractAddress} />
        )),
      isEnabled: embedEnabled ? "enabled" : "disabled",
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
      title: "Sources",
      path: "sources",
      element: () =>
        import("../tabs/sources/page").then(({ CustomContractSourcesPage }) => (
          <CustomContractSourcesPage contractAddress={contractAddress} />
        )),
    },
  ];
}

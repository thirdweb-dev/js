import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { contractType, useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { useEns } from "components/contract-components/hooks";
import { CustomContractOverviewPage } from "contract-ui/tabs/overview/page";
import { EnhancedRoute } from "contract-ui/types/types";
import dynamic from "next/dynamic";

// evm
const LazyContractExplorerPage = dynamic(() =>
  import("../tabs/explorer/page").then(
    ({ ContractExplorerPage }) => ContractExplorerPage,
  ),
);
const LazyContractEventsPage = dynamic(() =>
  import("../tabs/events/page").then(
    ({ ContractEventsPage }) => ContractEventsPage,
  ),
);
const LazyContractAnalyticsPage = dynamic(() =>
  import("../tabs/analytics/page").then(
    ({ ContractAnalyticsPage }) => ContractAnalyticsPage,
  ),
);
const LazyContractPaymentsPage = dynamic(() =>
  import("../tabs/payments/page").then(
    ({ ContractPaymentsPage }) => ContractPaymentsPage,
  ),
);
const LazyContractNFTPage = dynamic(() =>
  import("../tabs/nfts/page").then(({ ContractNFTPage }) => ContractNFTPage),
);
const LazyContractTokensPage = dynamic(() =>
  import("../tabs/tokens/page").then(
    ({ ContractTokensPage }) => ContractTokensPage,
  ),
);
const LazyContractDirectListingsPage = dynamic(() =>
  import("../tabs/direct-listings/page").then(
    ({ ContractDirectListingsPage }) => ContractDirectListingsPage,
  ),
);
const LazyContractEnglishAuctionsPage = dynamic(() =>
  import("../tabs/english-auctions/page").then(
    ({ ContractEnglishAuctionsPage }) => ContractEnglishAuctionsPage,
  ),
);
const LazyContractListingsPage = dynamic(() =>
  import("../tabs/listings/page").then(
    ({ ContractListingsPage }) => ContractListingsPage,
  ),
);
const LazyContractSplitPage = dynamic(() =>
  import("../tabs/split/page").then(
    ({ ContractSplitPage }) => ContractSplitPage,
  ),
);
const LazyContractProposalsPage = dynamic(() =>
  import("../tabs/proposals/page").then(
    ({ ContractProposalsPage }) => ContractProposalsPage,
  ),
);
const LazyContractClaimConditionsPage = dynamic(() =>
  import("../tabs/claim-conditions/page").then(
    ({ ContractClaimConditionsPage }) => ContractClaimConditionsPage,
  ),
);
const LazyContractAccountsPage = dynamic(() =>
  import("../tabs/accounts/page").then(({ AccountsPage }) => AccountsPage),
);
const LazyContractAccountPage = dynamic(() =>
  import("../tabs/account/page").then(({ AccountPage }) => AccountPage),
);
const LazyContractAccountPermissionsPage = dynamic(() =>
  import("../tabs/account-permissions/page").then(
    ({ AccountPermissionsPage }) => AccountPermissionsPage,
  ),
);
const LazyContractPermissionsPage = dynamic(() =>
  import("../tabs/permissions/page").then(
    ({ ContractPermissionsPage }) => ContractPermissionsPage,
  ),
);
const LazyCustomContractEmbedPage = dynamic(() =>
  import("../tabs/embed/page").then(
    ({ CustomContractEmbedPage }) => CustomContractEmbedPage,
  ),
);
const LazyContractCodePage = dynamic(() =>
  import("../tabs/code/page").then(({ ContractCodePage }) => ContractCodePage),
);
const LazyCustomContractSettingsPage = dynamic(() =>
  import("../tabs/settings/page").then(
    ({ CustomContractSettingsPage }) => CustomContractSettingsPage,
  ),
);
const LazyCustomContractSourcesPage = dynamic(() =>
  import("../tabs/sources/page").then(
    ({ CustomContractSourcesPage }) => CustomContractSourcesPage,
  ),
);
// end evm
export function useContractRouteConfig(
  contractAddress: string,
): EnhancedRoute[] {
  const ensQuery = useEns(contractAddress);
  const contractQuery = useContract(ensQuery.data?.address);
  const contractTypeQuery = contractType.useQuery(contractAddress);
  const { data: account } = useAccount();

  const claimconditionExtensionDetection = extensionDetectedState({
    contractQuery,
    feature: [
      // erc 721
      "ERC721ClaimPhasesV1",
      "ERC721ClaimPhasesV2",
      "ERC721ClaimConditionsV1",
      "ERC721ClaimConditionsV2",

      // erc 20
      "ERC20ClaimConditionsV1",
      "ERC20ClaimConditionsV2",
      "ERC20ClaimPhasesV1",
      "ERC20ClaimPhasesV2",
    ],
  });
  return [
    {
      title: "Overview",
      path: "overview",
      // not lazy because this is typically the landing spot so we want it to always be there immediately
      component: CustomContractOverviewPage,
      isDefault: true,
    },
    {
      title: "Code Snippets",
      path: "code",
      component: LazyContractCodePage,
      isDefault: true,
    },
    {
      title: "Explorer",
      path: "explorer",
      component: LazyContractExplorerPage,
      isDefault: true,
    },
    {
      title: "Events",
      path: "events",
      component: LazyContractEventsPage,
      isDefault: true,
    },
    {
      title: "Analytics",
      path: "analytics",
      component: LazyContractAnalyticsPage,
      isDefault: true,
      isBeta: true,
    },
    /*     {
      title: "Payments",
      path: "payments",
      component: LazyContractPaymentsPage,
      isDefault: true,
    }, */
    {
      title: "Payments",
      path: "payments",
      component: LazyContractPaymentsPage,
      isEnabled: account?.email?.includes("@thirdweb.com")
        ? "enabled"
        : "disabled",
    },
    {
      title: "NFTs",
      path: "nfts",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: ["ERC1155", "ERC721"],
      }),
      component: LazyContractNFTPage,
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: extensionDetectedState({ contractQuery, feature: "ERC20" }),
      component: LazyContractTokensPage,
    },
    {
      title: "Direct Listings",
      path: "direct-listings",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: "DirectListings",
      }),
      component: LazyContractDirectListingsPage,
    },
    {
      title: "English Auctions",
      path: "english-auctions",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: "EnglishAuctions",
      }),
      component: LazyContractEnglishAuctionsPage,
    },
    {
      title: "Listings",
      path: "listings",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "marketplace"
        ? "enabled"
        : "disabled",
      component: LazyContractListingsPage,
    },
    {
      title: "Balances",
      path: "split",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "split"
        ? "enabled"
        : "disabled",
      component: LazyContractSplitPage,
    },
    {
      title: "Proposals",
      path: "proposals",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "vote"
        ? "enabled"
        : "disabled",
      component: LazyContractProposalsPage,
    },
    {
      title: "Claim Conditions",
      path: "claim-conditions",
      isEnabled: claimconditionExtensionDetection,
      component: LazyContractClaimConditionsPage,
    },
    {
      title: "Accounts",
      path: "accounts",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: ["AccountFactory"],
      }),
      component: LazyContractAccountsPage,
    },
    {
      title: "Balance",
      path: "account",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: ["Account"],
      }),
      component: LazyContractAccountPage,
    },
    {
      title: "Account Permissions",
      path: "account-permissions",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: ["AccountPermissions", "AccountPermissionsV1"],
      }),
      component: LazyContractAccountPermissionsPage,
    },
    {
      title: "Permissions",
      path: "permissions",
      isEnabled: extensionDetectedState({
        contractQuery,
        matchStrategy: "any",
        feature: ["Permissions", "PermissionsEnumerable"],
      }),
      component: LazyContractPermissionsPage,
    },
    {
      title: "Embed",
      path: "embed",
      component: LazyCustomContractEmbedPage,
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "marketplace"
        ? "enabled"
        : extensionDetectedState({
            contractQuery,
            matchStrategy: "any",
            feature: [
              // erc 721
              "ERC721ClaimPhasesV1",
              "ERC721ClaimPhasesV2",
              "ERC721ClaimConditionsV1",
              "ERC721ClaimConditionsV2",

              // erc 1155
              "ERC1155ClaimPhasesV1",
              "ERC1155ClaimPhasesV2",
              "ERC1155ClaimConditionsV1",
              "ERC1155ClaimConditionsV2",

              // erc 20
              "ERC20ClaimConditionsV1",
              "ERC20ClaimConditionsV2",
              "ERC20ClaimPhasesV1",
              "ERC20ClaimPhasesV2",

              // marketplace v3
              "DirectListings",
              "EnglishAuctions",
            ],
          }),
    },
    {
      title: "Settings",
      path: "settings",
      component: LazyCustomContractSettingsPage,
      isDefault: true,
    },
    {
      title: "Sources",
      path: "sources",
      component: LazyCustomContractSourcesPage,
      isDefault: true,
    },
  ];
}

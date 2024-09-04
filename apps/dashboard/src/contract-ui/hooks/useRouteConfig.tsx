import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { useEns } from "components/contract-components/hooks";
import { detectFeatures } from "components/contract-components/utils";
import { ContractOverviewPage } from "contract-ui/tabs/overview/page";
import type { EnhancedRoute } from "contract-ui/types/types";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  isGetContractMetadataSupported,
  isGetDefaultRoyaltyInfoSupported,
  isGetPlatformFeeInfoSupported,
  isPrimarySaleRecipientSupported,
  isSetContractMetadataSupported,
  isSetDefaultRoyaltyInfoSupported,
  isSetPlatformFeeInfoSupported,
  isSetPrimarySaleRecipientSupported,
} from "thirdweb/extensions/common";
import {
  isClaimToSupported,
  isERC20,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import { isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import * as PermissionExt from "thirdweb/extensions/permissions";
import { contractType } from "thirdweb/extensions/thirdweb";
import { useReadContract } from "thirdweb/react";
import { useAnalyticsSupportedForChain } from "../../data/analytics/hooks";
import { useContractFunctionSelectors } from "./useContractFunctionSelectors";

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
const LazyContractCodePage = dynamic(() =>
  import("../tabs/code/page").then(({ ContractCodePage }) => ContractCodePage),
);
const LazyContractSettingsPage = dynamic(() =>
  import("../tabs/settings/page").then(
    ({ ContractSettingsPage }) => ContractSettingsPage,
  ),
);
const LazyContractSourcesPage = dynamic(() =>
  import("../tabs/sources/page").then(
    ({ ContractSourcesPage }) => ContractSourcesPage,
  ),
);
const LazyContractEditModulesPage = dynamic(() =>
  import("../tabs/manage/page").then(
    ({ ContractEditModulesPage }) => ContractEditModulesPage,
  ),
);
const LazyContractEmbedPage = dynamic(() =>
  import("../tabs/embed/page").then(
    ({ ContractEmbedPage }) => ContractEmbedPage,
  ),
);

export function useContractRouteConfig(
  contract: ThirdwebContract,
): EnhancedRoute[] {
  // new
  const functionSelectorQuery = useContractFunctionSelectors(contract);
  const contractTypeQuery = useReadContract(contractType, { contract });
  const analyticsSupported = useAnalyticsSupportedForChain(contract.chain.id);
  const isERC721Query = useReadContract(isERC721, { contract });
  const isERC1155Query = useReadContract(isERC1155, { contract });
  const isPermissions = useMemo(() => {
    // all of these need to be supported for permissions to be enabled
    return [
      PermissionExt.isGetRoleAdminSupported(functionSelectorQuery.data),
      PermissionExt.isGrantRoleSupported(functionSelectorQuery.data),
      PermissionExt.isHasRoleSupported(functionSelectorQuery.data),
      PermissionExt.isRenounceRoleSupported(functionSelectorQuery.data),
      PermissionExt.isRevokeRoleSupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const isPermissionsEnumerable = useMemo(() => {
    // if direct permissions isn't supported, then enumerable also isn't
    if (!isPermissions) {
      return false;
    }
    // all of these need to be supported for permissions to be enumerable
    return [
      PermissionExt.isGetRoleMemberSupported(functionSelectorQuery.data),
      PermissionExt.isGetRoleMemberCountSupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [isPermissions, functionSelectorQuery.data]);

  // old
  const ensQuery = useEns(contract.address);

  // TODO: remove
  const contractQuery = useContract(ensQuery.data?.address);
  // TODO: remove all below
  const contractData = useMemo(() => {
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

    // AccountPage
    const detectedAccountFeature = extensionDetectedState({
      contractQuery,
      feature: ["Account"],
    });

    // AccountPermissionsPage
    const detectedAccountPermissionFeature = extensionDetectedState({
      contractQuery,
      feature: ["AccountPermissions", "AccountPermissionsV1"],
    });

    const detectedAccountFactory = extensionDetectedState({
      contractQuery,
      feature: ["AccountFactory"],
    });

    const detectedEnglishAuctions = extensionDetectedState({
      contractQuery,
      feature: "EnglishAuctions",
    });

    const detectedDirectListings = extensionDetectedState({
      contractQuery,
      feature: "DirectListings",
    });

    const detectedModularExtension = extensionDetectedState({
      contractQuery,
      feature: ["ModularCore"],
    });

    const hasNewClaimConditions = detectFeatures(contractQuery.contract, [
      // erc721
      "ERC721ClaimConditionsV2",
      "ERC721ClaimPhasesV2",
      // erc1155
      "ERC1155ClaimConditionsV2",
      "ERC1155ClaimPhasesV2",
      // erc20
      "ERC20ClaimConditionsV2",
      "ERC20ClaimPhasesV2",
    ]);

    return {
      claimconditionExtensionDetection,
      detectedAccountFeature,
      detectedAccountPermissionFeature,
      detectedAccountFactory,
      detectedEnglishAuctions,
      detectedDirectListings,
      detectedModularExtension,
      hasNewClaimConditions,
    };
  }, [contractQuery]);

  const embedType: "marketplace-v3" | "erc20" | "erc1155" | "erc721" | null =
    useMemo(() => {
      if (
        contractData.detectedEnglishAuctions === "enabled" &&
        contractData.detectedDirectListings === "enabled"
      ) {
        // this means its marketplace v3
        return "marketplace-v3";
      }
      // others only matter if claim conditions are detected
      if (contractData.hasNewClaimConditions) {
        // if erc721 its that
        if (isERC721Query.data) {
          return "erc721";
        }
        // if erc1155 its that
        if (isERC1155Query.data) {
          return "erc1155";
        }
        // otherwise it has to be erc20
        return "erc20";
      }
      // otherwise null
      return null;
    }, [contractData, isERC721Query.data, isERC1155Query.data]);

  return [
    {
      title: "Overview",
      path: "overview",
      // not lazy because this is typically the landing spot so we want it to always be there immediately
      component: () => (
        <ContractOverviewPage
          contract={contract}
          hasDirectListings={contractData.detectedDirectListings === "enabled"}
          hasEnglishAuctions={
            contractData.detectedEnglishAuctions === "enabled"
          }
          isErc1155={isERC1155Query.data || false}
          isErc20={isERC20(functionSelectorQuery.data)}
          isErc721={isERC721Query.data || false}
          isPermissionsEnumerable={isPermissionsEnumerable}
        />
      ),
      isEnabled: contractQuery.isLoading ? "loading" : "enabled",
      isDefault: true,
    },
    {
      title: "Modules",
      path: "modules",
      isEnabled: contractData.detectedModularExtension,
      isDefault: true,
      component: LazyContractEditModulesPage,
    },
    {
      title: "Code Snippets",
      path: "code",
      component: () => <LazyContractCodePage contract={contract} />,
      isDefault: true,
    },
    {
      title: "Explorer",
      path: "explorer",
      component: () => <LazyContractExplorerPage contract={contract} />,
      isDefault: true,
    },
    {
      title: "Events",
      path: "events",
      component: () => <LazyContractEventsPage contract={contract} />,
      isDefault: true,
    },
    {
      title: "Embed",
      path: "embed",
      isDefault: true,
      isEnabled:
        embedType !== null
          ? "enabled"
          : isERC721Query.isLoading || isERC1155Query.isLoading
            ? "loading"
            : "disabled",
      component: () => (
        <LazyContractEmbedPage
          contract={contract}
          ercOrMarketplace={embedType}
        />
      ),
    },
    {
      title: "Analytics",
      path: "analytics",
      component: () => <LazyContractAnalyticsPage contract={contract} />,
      isDefault: true,
      isBeta: true,
      isEnabled: analyticsSupported.isLoading
        ? "loading"
        : analyticsSupported.data
          ? "enabled"
          : "disabled",
    },
    {
      title: "NFTs",
      path: "nfts",
      isEnabled:
        isERC721Query.data || isERC1155Query.data
          ? "enabled"
          : isERC721Query.isLoading || isERC1155Query.isLoading
            ? "loading"
            : "disabled",
      component: () => <LazyContractNFTPage contract={contract} />,
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: functionSelectorQuery.isLoading
        ? "loading"
        : isERC20(functionSelectorQuery.data)
          ? "enabled"
          : "disabled",
      component: () => (
        <LazyContractTokensPage
          contract={contract}
          isERC20={isERC20(functionSelectorQuery.data)}
          isMintToSupported={isMintToSupported(functionSelectorQuery.data)}
          isClaimToSupported={isClaimToSupported(functionSelectorQuery.data)}
        />
      ),
    },
    {
      title: "Direct Listings",
      path: "direct-listings",
      isEnabled: contractData.detectedDirectListings,
      component: () => <LazyContractDirectListingsPage contract={contract} />,
    },
    {
      title: "English Auctions",
      path: "english-auctions",
      isEnabled: contractData.detectedEnglishAuctions,
      component: () => <LazyContractEnglishAuctionsPage contract={contract} />,
    },
    {
      title: "Balances",
      path: "split",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "Split"
          ? "enabled"
          : "disabled",
      component: () => <LazyContractSplitPage contract={contract} />,
    },
    {
      title: "Proposals",
      path: "proposals",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "Vote"
          ? "enabled"
          : "disabled",
      component: () => <LazyContractProposalsPage contract={contract} />,
    },
    {
      title: "Claim Conditions",
      path: "claim-conditions",
      isEnabled: contractData.claimconditionExtensionDetection,
      component: () => (
        <LazyContractClaimConditionsPage
          contract={contract}
          claimconditionExtensionDetection={
            contractData.claimconditionExtensionDetection
          }
          isERC20={isERC20(functionSelectorQuery.data)}
          hasNewClaimConditions={contractData.hasNewClaimConditions}
        />
      ),
    },
    {
      title: "Accounts",
      path: "accounts",
      isEnabled: contractData.detectedAccountFactory,
      component: () => (
        <LazyContractAccountsPage
          contract={contract}
          detectedAccountFactory={contractData.detectedAccountFactory}
        />
      ),
    },
    {
      title: "Balance",
      path: "account",
      isEnabled: contractData.detectedAccountFeature,
      component: () => (
        <LazyContractAccountPage
          contract={contract}
          detectedAccountFeature={contractData.detectedAccountFeature}
        />
      ),
    },
    {
      title: "Account Permissions",
      path: "account-permissions",
      isEnabled: contractData.detectedAccountPermissionFeature,
      component: () => (
        <LazyContractAccountPermissionsPage
          contract={contract}
          detectedPermissionFeature={
            contractData.detectedAccountPermissionFeature
          }
        />
      ),
    },
    {
      title: "Permissions",
      path: "permissions",
      isEnabled: isPermissions
        ? "enabled"
        : functionSelectorQuery.isLoading
          ? "loading"
          : "disabled",
      component: () => (
        <LazyContractPermissionsPage
          contract={contract}
          detectedPermissionEnumerable={isPermissionsEnumerable}
        />
      ),
    },
    {
      title: "Settings",
      path: "settings",
      component: () => (
        <LazyContractSettingsPage
          contract={contract}
          isLoading={functionSelectorQuery.isLoading}
          isContractMetadataSupported={[
            isGetContractMetadataSupported(functionSelectorQuery.data),
            isSetContractMetadataSupported(functionSelectorQuery.data),
          ].every(Boolean)}
          isPrimarySaleSupported={[
            isPrimarySaleRecipientSupported(functionSelectorQuery.data),
            isSetPrimarySaleRecipientSupported(functionSelectorQuery.data),
          ].every(Boolean)}
          isRoyaltiesSupported={[
            isGetDefaultRoyaltyInfoSupported(functionSelectorQuery.data),
            isSetDefaultRoyaltyInfoSupported(functionSelectorQuery.data),
          ].every(Boolean)}
          isPlatformFeesSupported={[
            isGetPlatformFeeInfoSupported(functionSelectorQuery.data),
            isSetPlatformFeeInfoSupported(functionSelectorQuery.data),
          ].every(Boolean)}
        />
      ),
      isDefault: true,
    },
    {
      title: "Sources",
      path: "sources",
      component: () => <LazyContractSourcesPage contract={contract} />,
      isDefault: true,
    },
  ];
}

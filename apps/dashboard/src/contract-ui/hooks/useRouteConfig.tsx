import {
  contractType,
  getAllDetectedFeatureNames,
  useContract,
} from "@thirdweb-dev/react";
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
  contractAddress: string,
  contract: ThirdwebContract,
): EnhancedRoute[] {
  const ensQuery = useEns(contractAddress);
  const functinSelectorQuery = useContractFunctionSelectors(contract);
  const contractQuery = useContract(ensQuery.data?.address);
  const contractTypeQuery = contractType.useQuery(contractAddress);

  const analyticsSupported = useAnalyticsSupportedForChain(
    contractQuery.contract?.chainId,
  );

  // ContractTokensPage
  const isERC721Query = useReadContract(isERC721, { contract });
  const isERC1155Query = useReadContract(isERC1155, { contract });

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
    const detectedPermissionFeature = extensionDetectedState({
      contractQuery,
      feature: ["AccountPermissions", "AccountPermissionsV1"],
    });

    const detectedAccountFactory = extensionDetectedState({
      contractQuery,
      feature: ["AccountFactory"],
    });

    // Permission page
    const detectedPermissionFeatures = extensionDetectedState({
      contractQuery,
      matchStrategy: "any",
      feature: ["Permissions", "PermissionsEnumerable"],
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

    const detectedPermissionEnumerable = detectFeatures(
      contractQuery.contract,
      ["PermissionsEnumerable"],
    );

    const detectedFeatureNames = contractQuery.contract?.abi
      ? getAllDetectedFeatureNames(contractQuery.contract.abi)
      : [];

    return {
      claimconditionExtensionDetection,
      detectedAccountFeature,
      detectedPermissionFeature,
      detectedAccountFactory,
      detectedPermissionFeatures,
      detectedEnglishAuctions,
      detectedDirectListings,
      detectedModularExtension,
      hasNewClaimConditions,
      detectedPermissionEnumerable,
      detectedFeatureNames,
    };
  }, [contractQuery]);

  const embedType: "marketplace-v3" | "erc20" | "erc1155" | "erc721" | null =
    useMemo(() => {
      if (
        contractData.detectedEnglishAuctions ||
        contractData.detectedDirectListings
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
        <>
          {contract && (
            <ContractOverviewPage
              contract={contract}
              contractType={contractTypeQuery.data || "custom"}
              detectedFeatureNames={contractData.detectedFeatureNames}
            />
          )}
        </>
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
      component: () => (
        <>{contract && <LazyContractCodePage contract={contract} />}</>
      ),
      isDefault: true,
    },
    {
      title: "Explorer",
      path: "explorer",
      component: () => (
        <>
          {contract && contractQuery.contract?.abi && (
            <LazyContractExplorerPage
              contract={contract}
              abi={contractQuery.contract.abi}
            />
          )}
        </>
      ),
      isDefault: true,
    },
    {
      title: "Events",
      path: "events",
      component: () => (
        <>{contract && <LazyContractEventsPage contract={contract} />}</>
      ),
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
      component: () => {
        return (
          <>
            {contract && (
              <LazyContractEmbedPage
                contract={contract}
                ercOrMarketplace={embedType}
              />
            )}
          </>
        );
      },
    },
    {
      title: "Analytics",
      path: "analytics",
      component: LazyContractAnalyticsPage,
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
      component: () => (
        <>{contract && <LazyContractNFTPage contract={contract} />}</>
      ),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: functinSelectorQuery.isLoading
        ? "loading"
        : isERC20(functinSelectorQuery.data)
          ? "enabled"
          : "disabled",
      component: () => (
        <>
          {contract && (
            <LazyContractTokensPage
              contract={contract}
              isERC20={isERC20(functinSelectorQuery.data)}
              isMintToSupported={isMintToSupported(functinSelectorQuery.data)}
              isClaimToSupported={isClaimToSupported(functinSelectorQuery.data)}
            />
          )}
        </>
      ),
    },
    {
      title: "Direct Listings",
      path: "direct-listings",
      isEnabled: contractData.detectedDirectListings,
      component: () => (
        <>
          {contract && <LazyContractDirectListingsPage contract={contract} />}
        </>
      ),
    },
    {
      title: "English Auctions",
      path: "english-auctions",
      isEnabled: contractData.detectedEnglishAuctions,
      component: () => (
        <>
          {contract && <LazyContractEnglishAuctionsPage contract={contract} />}
        </>
      ),
    },
    {
      title: "Balances",
      path: "split",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "split"
          ? "enabled"
          : "disabled",
      component: () => (
        <>{contract && <LazyContractSplitPage contract={contract} />}</>
      ),
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
      isEnabled: contractData.claimconditionExtensionDetection,
      component: () => (
        <>
          {contract && (
            <LazyContractClaimConditionsPage
              contract={contract}
              claimconditionExtensionDetection={
                contractData.claimconditionExtensionDetection
              }
              isERC20={isERC20(functinSelectorQuery.data)}
              hasNewClaimConditions={contractData.hasNewClaimConditions}
            />
          )}
        </>
      ),
    },
    {
      title: "Accounts",
      path: "accounts",
      isEnabled: contractData.detectedAccountFactory,
      component: () => (
        <>
          {contract && (
            <LazyContractAccountsPage
              contract={contract}
              detectedAccountFactory={contractData.detectedAccountFactory}
            />
          )}
        </>
      ),
    },
    {
      title: "Balance",
      path: "account",
      isEnabled: contractData.detectedAccountFeature,
      component: () => (
        <>
          {contract && (
            <LazyContractAccountPage
              contract={contract}
              detectedAccountFeature={contractData.detectedAccountFeature}
            />
          )}
        </>
      ),
    },
    {
      title: "Account Permissions",
      path: "account-permissions",
      isEnabled: contractData.detectedPermissionFeature,
      component: () => (
        <>
          {contract && (
            <LazyContractAccountPermissionsPage
              contract={contract}
              detectedPermissionFeature={contractData.detectedPermissionFeature}
            />
          )}
        </>
      ),
    },
    {
      title: "Permissions",
      path: "permissions",
      isEnabled: contractData.detectedPermissionFeatures,
      component: () => (
        <>
          {contract && (
            <LazyContractPermissionsPage
              contract={contract}
              detectedPermissionEnumerable={
                contractData.detectedPermissionEnumerable
              }
            />
          )}
        </>
      ),
    },
    {
      title: "Settings",
      path: "settings",
      component: () => (
        <>
          {contract && (
            <LazyContractSettingsPage
              contract={contract}
              isLoading={functinSelectorQuery.isLoading}
              isContractMetadataSupported={[
                isGetContractMetadataSupported(functinSelectorQuery.data),
                isSetContractMetadataSupported(functinSelectorQuery.data),
              ].every(Boolean)}
              isPrimarySaleSupported={[
                isPrimarySaleRecipientSupported(functinSelectorQuery.data),
                isSetPrimarySaleRecipientSupported(functinSelectorQuery.data),
              ].every(Boolean)}
              isRoyaltiesSupported={[
                isGetDefaultRoyaltyInfoSupported(functinSelectorQuery.data),
                isSetDefaultRoyaltyInfoSupported(functinSelectorQuery.data),
              ].every(Boolean)}
              isPlatformFeesSupported={[
                isGetPlatformFeeInfoSupported(functinSelectorQuery.data),
                isSetPlatformFeeInfoSupported(functinSelectorQuery.data),
              ].every(Boolean)}
            />
          )}
        </>
      ),
      isDefault: true,
    },
    {
      title: "Sources",
      path: "sources",
      component: () => (
        <>{contract && <LazyContractSourcesPage contract={contract} />}</>
      ),
      isDefault: true,
    },
  ];
}

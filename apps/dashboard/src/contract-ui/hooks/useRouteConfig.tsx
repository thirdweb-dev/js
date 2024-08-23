import {
  contractType,
  getAllDetectedFeatureNames,
  getErcs,
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
import { useAnalyticsSupportedForChain } from "../../data/analytics/hooks";

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
const LazyContractEmbedPage = dynamic(() =>
  import("../tabs/embed/page").then(
    ({ ContractEmbedPage }) => ContractEmbedPage,
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

export function useContractRouteConfig(
  contractAddress: string,
  contract?: ThirdwebContract,
): EnhancedRoute[] {
  const ensQuery = useEns(contractAddress);
  const contractQuery = useContract(ensQuery.data?.address);
  const contractTypeQuery = contractType.useQuery(contractAddress);

  const analyticsSupported = useAnalyticsSupportedForChain(
    contractQuery.contract?.chainId,
  );

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

    // ContractSettingsPage
    const detectedMetadata = extensionDetectedState({
      contractQuery,
      feature: "ContractMetadata",
    });
    const detectedPrimarySale = extensionDetectedState({
      contractQuery,
      feature: "PrimarySale",
    });
    const detectedRoyalties = extensionDetectedState({
      contractQuery,
      feature: "Royalty",
    });
    const detectedPlatformFees = extensionDetectedState({
      contractQuery,
      feature: "PlatformFee",
    });

    // ContractTokensPage
    const isERC20 = detectFeatures(contractQuery.contract, ["ERC20"]);

    const isERC20Mintable = detectFeatures(contractQuery.contract, [
      "ERC20Mintable",
    ]);

    const isERC20Claimable = detectFeatures(contractQuery.contract, [
      "ERC20ClaimConditionsV1",
      "ERC20ClaimConditionsV2",
      "ERC20ClaimPhasesV1",
      "ERC20ClaimPhasesV2",
    ]);

    // AccountPage
    const detectedAccountFeature = extensionDetectedState({
      contractQuery,
      feature: ["Account"],
    });

    // ContractEmbedPage
    const { erc20, erc1155, erc721 } = getErcs(contractQuery?.contract);
    const isMarketplaceV3 = detectFeatures(contractQuery?.contract, [
      "DirectListings",
      "EnglishAuctions",
    ]);

    const embedDetectedState = extensionDetectedState({
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

    const detectedNftExtensions = extensionDetectedState({
      contractQuery,
      feature: ["ERC1155", "ERC721"],
    });

    const detectedErc20Extension = extensionDetectedState({
      contractQuery,
      feature: "ERC20",
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
      detectedMetadata,
      detectedPrimarySale,
      detectedRoyalties,
      detectedPlatformFees,
      isERC20,
      isERC20Mintable,
      isERC20Claimable,
      detectedAccountFeature,
      erc20,
      erc1155,
      erc721,
      isMarketplaceV3,
      detectedPermissionFeature,
      embedDetectedState,
      detectedAccountFactory,
      detectedPermissionFeatures,
      detectedEnglishAuctions,
      detectedDirectListings,
      detectedNftExtensions,
      detectedErc20Extension,
      detectedModularExtension,
      hasNewClaimConditions,
      detectedPermissionEnumerable,
      detectedFeatureNames,
    };
  }, [contractQuery]);

  const ercOrMarketplace =
    contractTypeQuery.data === "marketplace"
      ? "marketplace"
      : contractData.isMarketplaceV3
        ? "marketplace-v3"
        : contractData.erc20
          ? "erc20"
          : contractData.erc1155
            ? "erc1155"
            : contractData.erc721
              ? "erc721"
              : null;

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
      isEnabled: contractData.detectedNftExtensions,
      component: () => (
        <>{contract && <LazyContractNFTPage contract={contract} />}</>
      ),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: contractData.detectedErc20Extension,
      component: () => (
        <>
          {contract && (
            <LazyContractTokensPage
              contract={contract}
              isERC20={contractData.isERC20}
              isERC20Claimable={contractData.isERC20Claimable}
              isERC20Mintable={contractData.isERC20Mintable}
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
              isERC20={contractData.isERC20}
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
      title: "Embed",
      path: "embed",
      component: () => (
        <>
          {contract && (
            <LazyContractEmbedPage
              contract={contract}
              ercOrMarketplace={ercOrMarketplace}
            />
          )}
        </>
      ),
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "marketplace"
          ? "enabled"
          : contractData.embedDetectedState,
    },
    {
      title: "Settings",
      path: "settings",
      component: () => (
        <>
          {contract && (
            <LazyContractSettingsPage
              contract={contract}
              detectedMetadata={contractData.detectedMetadata}
              detectedPlatformFees={contractData.detectedPlatformFees}
              detectedPrimarySale={contractData.detectedPrimarySale}
              detectedRoyalties={contractData.detectedRoyalties}
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

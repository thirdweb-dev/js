import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { useEns } from "components/contract-components/hooks";
import { ContractOverviewPage } from "contract-ui/tabs/overview/page";
import type { EnhancedRoute } from "contract-ui/types/types";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as CommonExt from "thirdweb/extensions/common";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import * as ModularExt from "thirdweb/extensions/modular";
import * as PermissionExt from "thirdweb/extensions/permissions";
import * as ThirdwebExt from "thirdweb/extensions/thirdweb";
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
  const contractTypeQuery = useReadContract(ThirdwebExt.contractType, {
    contract,
  });
  const analyticsSupported = useAnalyticsSupportedForChain(contract.chain.id);
  const isERC721Query = useReadContract(ERC721Ext.isERC721, { contract });
  const isERC1155Query = useReadContract(ERC1155Ext.isERC1155, { contract });
  const isERC20 = useMemo(
    () => ERC20Ext.isERC20(functionSelectorQuery.data),
    [functionSelectorQuery.data],
  );
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

  const isAccount = useMemo(
    () => ERC4337Ext.isValidateUserOpSupported(functionSelectorQuery.data),
    [functionSelectorQuery.data],
  );

  const accountPermissions = useMemo(() => {
    return [
      ERC4337Ext.isGetAllActiveSignersSupported(functionSelectorQuery.data),
      ERC4337Ext.isGetAllAdminsSupported(functionSelectorQuery.data),
      ERC4337Ext.isGetAllSignersSupported(functionSelectorQuery.data),
      ERC4337Ext.isIsActiveSignerSupported(functionSelectorQuery.data),
      ERC4337Ext.isIsAdminSupported(functionSelectorQuery.data),
      ERC4337Ext.isAddAdminSupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const accountFactory = useMemo(() => {
    return [
      ERC4337Ext.isGetAllAccountsSupported(functionSelectorQuery.data),
      ERC4337Ext.isGetAccountsSupported(functionSelectorQuery.data),
      ERC4337Ext.isTotalAccountsSupported(functionSelectorQuery.data),
      ERC4337Ext.isGetAccountsOfSignerSupported(functionSelectorQuery.data),
      ERC4337Ext.isPredictAccountAddressSupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const hasERC721ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC721Ext.isGetClaimConditionByIdSupported(functionSelectorQuery.data),
      ERC721Ext.isGetActiveClaimConditionIdSupported(
        functionSelectorQuery.data,
      ),
      ERC721Ext.isGetClaimConditionsSupported(functionSelectorQuery.data),
      ERC721Ext.isGetActiveClaimConditionSupported(functionSelectorQuery.data),
      // writes
      ERC721Ext.isSetClaimConditionsSupported(functionSelectorQuery.data),
      ERC721Ext.isResetClaimEligibilitySupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const hasERC20ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC20Ext.isGetClaimConditionByIdSupported(functionSelectorQuery.data),
      ERC20Ext.isGetActiveClaimConditionIdSupported(functionSelectorQuery.data),
      ERC20Ext.isGetClaimConditionsSupported(functionSelectorQuery.data),
      ERC20Ext.isGetActiveClaimConditionSupported(functionSelectorQuery.data),
      // writes
      ERC20Ext.isSetClaimConditionsSupported(functionSelectorQuery.data),
      ERC20Ext.isResetClaimEligibilitySupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const hasERC1155ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC1155Ext.isGetClaimConditionByIdSupported(functionSelectorQuery.data),
      ERC1155Ext.isGetClaimConditionsSupported(functionSelectorQuery.data),
      ERC1155Ext.isGetActiveClaimConditionSupported(functionSelectorQuery.data),
      // writes
      ERC1155Ext.isSetClaimConditionsSupported(functionSelectorQuery.data),
      ERC1155Ext.isResetClaimEligibilitySupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const hasClaimConditions = useMemo(() => {
    return [
      hasERC721ClaimConditions,
      hasERC20ClaimConditions,
      hasERC1155ClaimConditions,
    ].some(Boolean);
  }, [
    hasERC721ClaimConditions,
    hasERC20ClaimConditions,
    hasERC1155ClaimConditions,
  ]);

  const isModularCore = useMemo(() => {
    return [
      ModularExt.isGetInstalledModulesSupported(functionSelectorQuery.data),
      ModularExt.isInstallModuleSupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  // old
  const ensQuery = useEns(contract.address);

  // TODO: remove
  const contractQuery = useContract(ensQuery.data?.address);
  // TODO: remove all below
  const contractData = useMemo(() => {
    const detectedEnglishAuctions = extensionDetectedState({
      contractQuery,
      feature: "EnglishAuctions",
    });

    const detectedDirectListings = extensionDetectedState({
      contractQuery,
      feature: "DirectListings",
    });

    return {
      detectedEnglishAuctions,
      detectedDirectListings,
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
      if (hasClaimConditions) {
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
    }, [
      contractData,
      hasClaimConditions,
      isERC721Query.data,
      isERC1155Query.data,
    ]);

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
          isErc20={isERC20}
          isErc721={isERC721Query.data || false}
          isPermissionsEnumerable={isPermissionsEnumerable}
        />
      ),
      isEnabled: "enabled",
      isDefault: true,
    },
    {
      title: "Modules",
      path: "modules",
      isEnabled: isModularCore
        ? "enabled"
        : functionSelectorQuery.isLoading
          ? "loading"
          : "disabled",
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
      component: () => (
        <LazyContractNFTPage
          contract={contract}
          isErc721={isERC721Query.data || false}
        />
      ),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: functionSelectorQuery.isLoading
        ? "loading"
        : isERC20
          ? "enabled"
          : "disabled",
      component: () => (
        <LazyContractTokensPage
          contract={contract}
          isERC20={isERC20}
          isMintToSupported={ERC20Ext.isMintToSupported(
            functionSelectorQuery.data,
          )}
          isClaimToSupported={ERC20Ext.isClaimToSupported(
            functionSelectorQuery.data,
          )}
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
      isEnabled:
        hasERC721ClaimConditions || hasERC20ClaimConditions
          ? "enabled"
          : functionSelectorQuery.isLoading
            ? "loading"
            : "disabled",
      component: () => (
        <LazyContractClaimConditionsPage
          contract={contract}
          isERC20={isERC20}
        />
      ),
    },
    {
      title: "Accounts",
      path: "accounts",
      isEnabled: accountFactory
        ? "enabled"
        : functionSelectorQuery.isLoading
          ? "loading"
          : "disabled",
      component: () => <LazyContractAccountsPage contract={contract} />,
    },
    {
      title: "Balance",
      path: "account",
      isEnabled: isAccount
        ? "enabled"
        : functionSelectorQuery.isLoading
          ? "loading"
          : "disabled",
      component: () => <LazyContractAccountPage contract={contract} />,
    },
    {
      title: "Account Permissions",
      path: "account-permissions",
      isEnabled: accountPermissions
        ? "enabled"
        : functionSelectorQuery.isLoading
          ? "loading"
          : "disabled",
      component: () => (
        <LazyContractAccountPermissionsPage contract={contract} />
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
            CommonExt.isGetContractMetadataSupported(
              functionSelectorQuery.data,
            ),
            CommonExt.isSetContractMetadataSupported(
              functionSelectorQuery.data,
            ),
          ].every(Boolean)}
          isPrimarySaleSupported={[
            CommonExt.isPrimarySaleRecipientSupported(
              functionSelectorQuery.data,
            ),
            CommonExt.isSetPrimarySaleRecipientSupported(
              functionSelectorQuery.data,
            ),
          ].every(Boolean)}
          isRoyaltiesSupported={[
            CommonExt.isGetDefaultRoyaltyInfoSupported(
              functionSelectorQuery.data,
            ),
            CommonExt.isSetDefaultRoyaltyInfoSupported(
              functionSelectorQuery.data,
            ),
          ].every(Boolean)}
          isPlatformFeesSupported={[
            CommonExt.isGetPlatformFeeInfoSupported(functionSelectorQuery.data),
            CommonExt.isSetPlatformFeeInfoSupported(functionSelectorQuery.data),
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

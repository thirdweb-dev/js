import type { SidebarBaseLink, SidebarLink } from "@/components/blocks/Sidebar";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "./contract-page-path";
import type { ContractPageMetadata } from "./getContractPageMetadata";

type SidebarBaseLinkWithHide = SidebarBaseLink & {
  hide?: boolean;
};

export function getContractPageSidebarLinks(data: {
  metadata: ContractPageMetadata;
  contractAddress: string;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const layoutPrefix = buildContractPagePath({
    chainIdOrSlug: data.chainSlug,
    contractAddress: data.contractAddress,
    projectMeta: data.projectMeta,
  });

  const generalLinks: SidebarBaseLinkWithHide[] = [
    {
      exactMatch: true,
      href: layoutPrefix,
      label: "Overview",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isModularCore,
      href: `${layoutPrefix}/modules`,
      label: "Modules",
    },
    {
      exactMatch: true,
      href: `${layoutPrefix}/cross-chain`,
      label: "Cross Chain (Beta)",
    },
    {
      exactMatch: true,
      href: `${layoutPrefix}/code`,
      label: "Code Snippets",
    },
    {
      exactMatch: true,
      href: `${layoutPrefix}/explorer`,
      label: "Explorer",
    },
    {
      exactMatch: true,
      href: `${layoutPrefix}/events`,
      label: "Events",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isInsightSupported,
      href: `${layoutPrefix}/analytics`,
      label: "Analytics",
    },
    {
      exactMatch: true,
      href: `${layoutPrefix}/settings`,
      label: "Settings",
    },
    {
      exactMatch: true,
      href: `${layoutPrefix}/sources`,
      label: "Sources",
    },
  ];

  const extensionsLinks: SidebarBaseLinkWithHide[] = [
    {
      hide:
        !data.metadata.supportedERCs.isERC721 &&
        !data.metadata.supportedERCs.isERC1155,
      href: `${layoutPrefix}/nfts`,
      label: "NFTs",
    },
    {
      exactMatch: true,
      hide: !data.metadata.supportedERCs.isERC20,
      href: `${layoutPrefix}/tokens`,
      label: "Tokens",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isDirectListingSupported,
      href: `${layoutPrefix}/direct-listings`,
      label: "Direct Listings",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isEnglishAuctionSupported,
      href: `${layoutPrefix}/english-auctions`,
      label: "English Auctions",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isSplitSupported,
      href: `${layoutPrefix}/split`,
      label: "Balances",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isVoteContract,
      href: `${layoutPrefix}/proposals`,
      label: "Proposals",
    },
    {
      exactMatch: true,
      hide: !(
        data.metadata.isERC721ClaimConditionsSupported ||
        data.metadata.isERC20ClaimConditionsSupported
      ),
      href: `${layoutPrefix}/claim-conditions`,
      label: "Claim Conditions",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isAccountFactory,
      href: `${layoutPrefix}/accounts`,
      label: "Accounts",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isAccount,
      href: `${layoutPrefix}/account`,
      label: "Balance",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isAccountPermissionsSupported,
      href: `${layoutPrefix}/account-permissions`,
      label: "Account Permissions",
    },
    {
      exactMatch: true,
      hide: !data.metadata.isPermissionsSupported,
      href: `${layoutPrefix}/permissions`,
      label: "Permissions",
    },
  ];

  const extensionsToShow = extensionsLinks.filter((l) => !l.hide);
  const generalLinksToShow = generalLinks.filter((l) => !l.hide);

  const sidebarLinks: SidebarLink[] = [
    {
      group: "General",
      links: generalLinksToShow,
    },
  ];

  if (extensionsToShow.length > 0) {
    sidebarLinks.push({
      group: "Extensions",
      links: extensionsToShow,
    });
  }

  return sidebarLinks;
}

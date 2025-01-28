import type { SidebarBaseLink, SidebarLink } from "@/components/blocks/Sidebar";
import type { ContractPageMetadata } from "./getContractPageMetadata";

type SidebarBaseLinkWithHide = SidebarBaseLink & {
  hide?: boolean;
};

export function getContractPageSidebarLinks(data: {
  metadata: ContractPageMetadata;
  contractAddress: string;
  chainSlug: string;
}) {
  const layoutPrefix = `/${data.chainSlug}/${data.contractAddress}`;

  const generalLinks: SidebarBaseLinkWithHide[] = [
    {
      label: "Overview",
      href: layoutPrefix,
      exactMatch: true,
    },
    {
      label: "Modules",
      href: `${layoutPrefix}/modules`,
      hide: !data.metadata.isModularCore,
      exactMatch: true,
    },
    {
      label: "Cross Chain",
      href: `${layoutPrefix}/cross-chain`,
      exactMatch: true,
    },
    {
      label: "Code Snippets",
      href: `${layoutPrefix}/code`,
      exactMatch: true,
    },
    {
      label: "Explorer",
      href: `${layoutPrefix}/explorer`,
      exactMatch: true,
    },
    {
      label: "Events",
      href: `${layoutPrefix}/events`,
      exactMatch: true,
    },
    {
      label: "Embed",
      href: `${layoutPrefix}/embed`,
      hide: data.metadata.embedType === null,
      exactMatch: true,
    },
    {
      label: "Analytics",
      href: `${layoutPrefix}/analytics`,
      hide: !data.metadata.isAnalyticsSupported,
      exactMatch: true,
    },
    {
      label: "Settings",
      href: `${layoutPrefix}/settings`,
      exactMatch: true,
    },
    {
      label: "Sources",
      href: `${layoutPrefix}/sources`,
      exactMatch: true,
    },
  ];

  const extensionsLinks: SidebarBaseLinkWithHide[] = [
    {
      label: "NFTs",
      href: `${layoutPrefix}/nfts`,
      hide:
        !data.metadata.supportedERCs.isERC721 &&
        !data.metadata.supportedERCs.isERC1155,
    },
    {
      label: "Tokens",
      href: `${layoutPrefix}/tokens`,
      hide: !data.metadata.supportedERCs.isERC20,
      exactMatch: true,
    },
    {
      label: "Direct Listings",
      href: `${layoutPrefix}/direct-listings`,
      hide: !data.metadata.isDirectListingSupported,
      exactMatch: true,
    },
    {
      label: "English Auctions",
      href: `${layoutPrefix}/english-auctions`,
      hide: !data.metadata.isEnglishAuctionSupported,
      exactMatch: true,
    },
    {
      label: "Balances",
      href: `${layoutPrefix}/split`,
      hide: !data.metadata.isSplitSupported,
      exactMatch: true,
    },
    {
      label: "Proposals",
      href: `${layoutPrefix}/proposals`,
      hide: !data.metadata.isVoteContract,
      exactMatch: true,
    },
    {
      label: "Claim Conditions",
      href: `${layoutPrefix}/claim-conditions`,
      hide: !(
        data.metadata.isERC721ClaimConditionsSupported ||
        data.metadata.isERC20ClaimConditionsSupported
      ),
      exactMatch: true,
    },
    {
      label: "Accounts",
      href: `${layoutPrefix}/accounts`,
      hide: !data.metadata.isAccountFactory,
      exactMatch: true,
    },
    {
      label: "Balance",
      href: `${layoutPrefix}/account`,
      hide: !data.metadata.isAccount,
      exactMatch: true,
    },
    {
      label: "Account Permissions",
      href: `${layoutPrefix}/account-permissions`,
      hide: !data.metadata.isAccountPermissionsSupported,
      exactMatch: true,
    },
    {
      label: "Permissions",
      href: `${layoutPrefix}/permissions`,
      exactMatch: true,
      hide: !data.metadata.isPermissionsSupported,
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

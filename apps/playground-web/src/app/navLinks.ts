import type { SidebarLink } from "../components/ui/sidebar";
import { insightBlueprints } from "./insight/insightBlueprints";

const staticSidebarLinks: SidebarLink[] = [
  {
    isCollapsible: false,
    links: [
      {
        href: "/connect/sign-in/button",
        name: "ConnectButton",
      },
      {
        href: "/connect/sign-in/embed",
        name: "ConnectEmbed",
      },
      {
        href: "/connect/sign-in/headless",
        name: "Headless Connect",
      },
      {
        href: "/connect/in-app-wallet",
        name: "In-App Wallets",
      },
      {
        href: "/connect/in-app-wallet/ecosystem",
        name: "Ecosystem Wallets",
      },
      {
        href: "/connect/account-abstraction/sponsor",
        name: "EIP-4337",
      },
      {
        href: "/connect/account-abstraction/7702",
        name: "EIP-7702",
      },
      {
        href: "/connect/account-abstraction/5792",
        name: "EIP-5792",
      },
      {
        href: "/connect/account-abstraction/native-aa",
        name: "Native AA (zkSync)",
      },
      {
        href: "/connect/auth",
        name: "Auth",
      },
      {
        href: "/connect/social",
        name: "Social",
      },
      {
        href: "/connect/blockchain-api",
        name: "Blockchain API",
      },
      {
        expanded: false,
        links: [
          {
            href: "/connect/ui",
            name: "Account",
          },
          {
            href: "/connect/ui/nft",
            name: "NFT",
          },
          {
            href: "/connect/ui/token",
            name: "Token",
          },
          {
            href: "/connect/ui/chain",
            name: "Chain",
          },
          {
            href: "/connect/ui/wallet",
            name: "Wallet",
          },
        ],
        name: "Headless Components",
      },
    ],
    name: "Wallets",
  },
];

const universalBridgeSidebarLinks: SidebarLink = {
  expanded: false,
  isCollapsible: false,
  links: [
    {
      href: "/connect/pay",
      name: "UI Component",
    },
    {
      href: "/connect/pay/fund-wallet",
      name: "Buy Crypto",
    },
    {
      href: "/connect/pay/commerce",
      name: "Checkout",
    },
    {
      href: "/connect/pay/transactions",
      name: "Transactions",
    },
    {
      href: "/connect/pay/backend",
      name: "Backend API",
    },
  ],
  name: "Payments",
};

const engineSidebarLinks: SidebarLink = {
  expanded: false,
  isCollapsible: false,
  links: [
    {
      href: "/engine/airdrop",
      name: "Airdrop",
    },
    {
      href: "/engine/minting",
      name: "Mint NFTs",
    },
    {
      href: "/engine/webhooks",
      name: "Webhooks",
    },
  ],
  name: "Transactions",
};

export function getSidebarLinks() {
  const insightLinks: SidebarLink[] = insightBlueprints.map((blueprint) => {
    return {
      expanded: false,
      links: blueprint.paths.map((pathInfo) => {
        return {
          crossedOut: pathInfo.deprecated,
          href: `/insight/${blueprint.id}?path=${pathInfo.path}`,
          name: pathInfo.name,
        };
      }),
      name: blueprint.name,
    };
  });

  const sidebarLinks: SidebarLink[] = [
    ...staticSidebarLinks,
    universalBridgeSidebarLinks,
    engineSidebarLinks,
    {
      expanded: false,
      isCollapsible: false,
      links: insightLinks,
      name: "Insight",
    },
  ];

  return sidebarLinks;
}

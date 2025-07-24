import type { SidebarLink } from "../components/ui/sidebar";
import { insightBlueprints } from "./insight/insightBlueprints";

const staticSidebarLinks: SidebarLink[] = [
  {
    isCollapsible: false,
    links: [
      {
        href: "/wallets/sign-in/button",
        name: "ConnectButton",
      },
      {
        href: "/wallets/sign-in/embed",
        name: "ConnectEmbed",
      },
      {
        href: "/wallets/sign-in/headless",
        name: "Headless Connect",
      },
      {
        href: "/wallets/in-app-wallet",
        name: "In-App Wallets",
      },
      {
        href: "/wallets/in-app-wallet/ecosystem",
        name: "Ecosystem Wallets",
      },
      {
        href: "/wallets/account-abstraction/sponsor",
        name: "EIP-4337",
      },
      {
        href: "/wallets/account-abstraction/7702",
        name: "EIP-7702",
      },
      {
        href: "/wallets/account-abstraction/5792",
        name: "EIP-5792",
      },
      {
        href: "/wallets/account-abstraction/native-aa",
        name: "Native AA (zkSync)",
      },
      {
        href: "/wallets/auth",
        name: "Auth",
      },
      {
        href: "/wallets/social",
        name: "Social",
      },
      {
        href: "/wallets/blockchain-api",
        name: "Blockchain API",
      },
      {
        expanded: false,
        links: [
          {
            href: "/wallets/ui",
            name: "Account",
          },
          {
            href: "/wallets/ui/nft",
            name: "NFT",
          },
          {
            href: "/wallets/ui/token",
            name: "Token",
          },
          {
            href: "/wallets/ui/chain",
            name: "Chain",
          },
          {
            href: "/wallets/ui/wallet",
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
      href: "/payments",
      name: "UI Component",
    },
    {
      href: "/payments/fund-wallet",
      name: "Buy Crypto",
    },
    {
      href: "/payments/commerce",
      name: "Checkout",
    },
    {
      href: "/payments/transactions",
      name: "Transactions",
    },
    {
      href: "/payments/backend",
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
      href: "/transactions/airdrop",
      name: "Airdrop",
    },
    {
      href: "/transactions/minting",
      name: "Mint NFTs",
    },
    {
      href: "/transactions/webhooks",
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

import type { SidebarLink } from "../components/ui/sidebar";
import { insightBlueprints } from "./insight/insightBlueprints";

const staticSidebarLinks: SidebarLink[] = [
  {
    name: "Connect",
    isCollapsible: false,
    links: [
      {
        name: "ConnectButton",
        href: "/connect/sign-in/button",
      },
      {
        name: "ConnectEmbed",
        href: "/connect/sign-in/embed",
      },
      {
        name: "Headless Connect",
        href: "/connect/sign-in/headless",
      },
      {
        name: "In-App Wallets",
        href: "/connect/in-app-wallet",
      },
      {
        name: "Ecosystem Wallets",
        href: "/connect/in-app-wallet/ecosystem",
      },
      {
        name: "EIP-4337",
        href: "/connect/account-abstraction/sponsor",
      },
      {
        name: "EIP-7702",
        href: "/connect/account-abstraction/7702",
      },
      {
        name: "EIP-5792",
        href: "/connect/account-abstraction/5792",
      },
      {
        name: "Native AA (zkSync)",
        href: "/connect/account-abstraction/native-aa",
      },
      {
        name: "Auth",
        href: "/connect/auth",
      },
      {
        name: "Social",
        href: "/connect/social",
      },
      {
        name: "Blockchain API",
        href: "/connect/blockchain-api",
      },
      {
        name: "Headless Components",
        expanded: false,
        links: [
          {
            name: "Account",
            href: "/connect/ui",
          },
          {
            name: "NFT",
            href: "/connect/ui/nft",
          },
          {
            name: "Token",
            href: "/connect/ui/token",
          },
          {
            name: "Chain",
            href: "/connect/ui/chain",
          },
          {
            name: "Wallet",
            href: "/connect/ui/wallet",
          },
        ],
      },
    ],
  },
];

const universalBridgeSidebarLinks: SidebarLink = {
  name: "Universal Bridge",
  isCollapsible: false,
  expanded: false,
  links: [
    {
      name: "UI Component",
      href: "/connect/pay",
    },
    {
      name: "Buy Crypto",
      href: "/connect/pay/fund-wallet",
    },
    {
      name: "Commerce",
      href: "/connect/pay/commerce",
    },
    {
      name: "Transactions",
      href: "/connect/pay/transactions",
    },
    {
      name: "Backend API",
      href: "/connect/pay/backend",
    },
  ],
};

const engineSidebarLinks: SidebarLink = {
  name: "Engine",
  isCollapsible: false,
  expanded: false,
  links: [
    {
      name: "Airdrop",
      href: "/engine/airdrop",
    },
    {
      name: "Mint NFTs",
      href: "/engine/minting",
    },
    {
      name: "Webhooks",
      href: "/engine/webhooks",
    },
  ],
};

export function getSidebarLinks() {
  const insightLinks: SidebarLink[] = insightBlueprints.map((blueprint) => {
    return {
      name: blueprint.name,
      expanded: false,
      links: blueprint.paths.map((pathInfo) => {
        return {
          name: pathInfo.name,
          href: `/insight/${blueprint.id}?path=${pathInfo.path}`,
        };
      }),
    };
  });

  const sidebarLinks: SidebarLink[] = [
    ...staticSidebarLinks,
    universalBridgeSidebarLinks,
    engineSidebarLinks,
    {
      name: "Insight",
      isCollapsible: false,
      expanded: false,
      links: insightLinks,
    },
  ];

  return sidebarLinks;
}

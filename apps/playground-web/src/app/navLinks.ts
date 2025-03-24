import type { SidebarLink } from "../components/ui/sidebar";
import { fetchAllBlueprints } from "./insight/utils";

export const staticSidebarLinks: SidebarLink[] = [
  {
    name: "Connect",
    isCollapsible: false,
    links: [
      {
        name: "Connect Wallet",
        expanded: false,
        links: [
          {
            name: "Button",
            href: "/connect/sign-in/button",
          },
          {
            name: "Embed",
            href: "/connect/sign-in/embed",
          },
          {
            name: "Headless",
            href: "/connect/sign-in/headless",
          },
        ],
      },
      {
        name: "In-App Wallet",
        expanded: false,
        links: [
          {
            name: "Any Auth",
            href: "/connect/in-app-wallet",
          },
          {
            name: "Ecosystems",
            href: "/connect/in-app-wallet/ecosystem",
          },
          {
            name: "Sponsor Gas",
            href: "/connect/in-app-wallet/sponsor",
          },
        ],
      },
      {
        name: "Account Abstraction",
        expanded: false,
        links: [
          {
            name: "Connect",
            href: "/connect/account-abstraction/connect",
          },
          {
            name: "Sponsor Gas",
            href: "/connect/account-abstraction/sponsor",
          },
          {
            name: "Native AA (zkSync)",
            href: "/connect/account-abstraction/native-aa",
          },
        ],
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
        name: "Headless UI",
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
      name: "Fund Wallet",
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
      href: "https://bridge.thirdweb.com/reference",
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
      name: "Minting",
      href: "/engine/minting",
    },
    {
      name: "Webhooks",
      href: "/engine/webhooks",
    },
  ],
};

export async function getSidebarLinks() {
  const insightBlueprints = await fetchAllBlueprints();

  const insightLinks: SidebarLink[] = insightBlueprints.map((blueprint) => {
    const paths = Object.keys(blueprint.openapiJson.paths);
    return {
      name: blueprint.name,
      expanded: false,
      links: paths.map((pathName) => {
        const pathObj = blueprint.openapiJson.paths[pathName];
        if (!pathObj) {
          throw new Error(`Path not found: ${pathName}`);
        }
        return {
          name: pathObj.get?.summary || pathName,
          href: `/insight/${blueprint.id}?path=${pathName}`,
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

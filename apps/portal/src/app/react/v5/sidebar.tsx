import { Book, CodeIcon, ExternalLink, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";

const slug = "/react/v5";

export const sidebar: SideBar = {
  name: "Connect React SDK",
  links: [
    {
      separator: true,
    },
    {
      name: "Overview",
      href: slug,
    },
    {
      name: "Getting Started",
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
    },
    {
      name: "Live Playground",
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLink />,
    },
    {
      name: "API Reference",
      href: "/references/typescript/v5",
      isCollapsible: false,
      icon: <CodeIcon />,
    },
    {
      separator: true,
    },
    {
      name: "Onboarding Users",
      isCollapsible: false,
      links: [
        {
          name: "UI Components",
          href: `${slug}/connecting-wallets/ui-components`,
        },
        {
          name: "Connection Hooks",
          href: `${slug}/connecting-wallets/hooks`,
        },
        {
          name: "In-App Wallets",
          href: `${slug}/in-app-wallet/get-started`,
        },
        {
          name: "Ecosystems Wallets",
          href: `${slug}/ecosystem-wallet/get-started`,
        },
        {
          name: "External Wallets",
          href: "/typescript/v5/supported-wallets",
        },
        {
          name: "Account Abstraction",
          href: `${slug}/account-abstraction/get-started`,
        },
        {
          name: "Funding wallets",
          href: `${slug}/pay/fund-wallets`,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "User Identity",
      isCollapsible: false,
      links: [
        {
          name: "UI Components",
          href: `${slug}/components/account`,
        },
        {
          name: "Sign in with Ethereum",
          href: `${slug}/auth`,
        },
        {
          name: "Link Profiles",
          href: `${slug}/linking`,
        },
        {
          name: "Web3 Social Identities",
          href: `${slug}/social`,
        },
        {
          name: "Permissions",
          href: `${slug}/account-abstraction/permissions`,
        },
        {
          name: "Export private key",
          href: `${slug}/in-app-wallet/export-private-key`,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Onchain Interactions",
      isCollapsible: false,
      links: [
        // TODO - SPONSOR TRANSACTIONS
        {
          name: "UI Components",
          href: `${slug}/components/onchain`,
        },
        {
          name: "Reading State",
          href: `${slug}/reading-state`,
        },
        {
          name: "Transactions",
          href: `${slug}/transactions`,
        },
        {
          name: "Sponsored Transactions",
          href: `${slug}/in-app-wallet/enable-gasless`,
        },
        {
          name: "Chain Abstraction",
          href: `${slug}/pay/transaction`,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Advanced",
      isCollapsible: false,
      links: [
        {
          name: "Adapters",
          links: [
            {
              // TODO one guide per library
              name: "Usage with other libraries",
              icon: <Book />,
              href: `${slug}/adapters`,
            },
          ],
        },
        {
          name: "Shared Logins",
          links: ["SiteEmbed", "SiteLink"].map((name) => ({
            name,
            href: `${slug}/${name}`,
            icon: <CodeIcon />,
          })),
        },
      ],
    },
    { separator: true },
    {
      name: "Migrate from v4",
      href: `${slug}/migrate`,
      links: [
        {
          name: "Installation",
          href: `${slug}/migrate/installation`,
        },
        {
          name: "Interacting with contracts",
          href: `${slug}/migrate/contracts`,
        },
        {
          name: "ethers.js Adapter",
          href: `${slug}/migrate/ethers-adapter`,
        },
        {
          name: "Cheatsheet",
          href: `${slug}/migrate/cheatsheet`,
        },
      ],
    },
    {
      name: "Migrate from RainbowKit",
      href: `${slug}/rainbow-kit-migrate`,
    },
  ],
};

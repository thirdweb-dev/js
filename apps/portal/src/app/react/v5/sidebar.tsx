import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";

const slug = "/react/v5";

export const sidebar: SideBar = {
  links: [
    {
      separator: true,
    },
    {
      href: slug,
      name: "Overview",
    },
    {
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
      name: "Getting Started",
    },
    {
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLinkIcon />,
      name: "Live Playground",
    },
    {
      href: "/references/typescript/v5",
      icon: <CodeIcon />,
      isCollapsible: false,
      name: "API Reference",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/connecting-wallets/ui-components`,
          name: "UI Components",
        },
        {
          href: `${slug}/connecting-wallets/hooks`,
          name: "Connection Hooks",
        },
        {
          href: `${slug}/in-app-wallet/get-started`,
          name: "In-App Wallets",
        },
        {
          href: `${slug}/ecosystem-wallet/get-started`,
          name: "Ecosystems Wallets",
        },
        {
          href: "/wallets/external-wallets",
          name: "External Wallets",
        },
        {
          href: `${slug}/account-abstraction/get-started`,
          name: "Account Abstraction",
        },
        {
          href: `${slug}/pay/fund-wallets`,
          name: "Funding wallets",
        },
      ],
      name: "Onboarding Users",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/components/account`,
          name: "UI Components",
        },
        {
          href: `${slug}/auth`,
          name: "Sign in with Ethereum",
        },
        {
          href: `${slug}/linking`,
          name: "Link Profiles",
        },
        {
          href: `${slug}/social`,
          name: "Web3 Social Identities",
        },
        {
          href: `${slug}/account-abstraction/permissions`,
          name: "Permissions",
        },
        {
          href: `${slug}/in-app-wallet/export-private-key`,
          name: "Export private key",
        },
      ],
      name: "User Identity",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        // TODO - SPONSOR TRANSACTIONS
        {
          href: `${slug}/components/onchain`,
          name: "UI Components",
        },
        {
          href: `${slug}/reading-state`,
          name: "Reading State",
        },
        {
          href: `${slug}/transactions`,
          name: "Transactions",
        },
        {
          href: `${slug}/in-app-wallet/enable-gasless`,
          name: "Sponsored Transactions",
        },
        {
          href: `${slug}/pay/transaction`,
          name: "Chain Abstraction",
        },
      ],
      name: "Onchain Interactions",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/adapters`,
          // TODO one guide per library
          name: "Usage with other libraries",
        },
        {
          links: ["SiteEmbed", "SiteLink"].map((name) => ({
            href: `${slug}/${name}`,
            name,
          })),
          name: "Shared Logins",
        },
      ],
      name: "Advanced",
    },
    { separator: true },
    {
      href: `${slug}/migrate`,
      links: [
        {
          href: `${slug}/migrate/installation`,
          name: "Installation",
        },
        {
          href: `${slug}/migrate/contracts`,
          name: "Interacting with contracts",
        },
        {
          href: `${slug}/migrate/ethers-adapter`,
          name: "ethers.js Adapter",
        },
        {
          href: `${slug}/migrate/cheatsheet`,
          name: "Cheatsheet",
        },
      ],
      name: "Migrate from v4",
    },
    {
      href: `${slug}/rainbow-kit-migrate`,
      name: "Migrate from RainbowKit",
    },
  ],
  name: "Connect React SDK",
};

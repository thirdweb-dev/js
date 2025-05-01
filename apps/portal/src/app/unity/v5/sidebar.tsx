import type { SideBar } from "@/components/Layouts/DocLayout";
import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";

const sdkSlug = "/unity/v5";
const walletProvidersSlug = `${sdkSlug}/wallets`;

export const sidebar: SideBar = {
  name: "Unity SDK",
  links: [
    { separator: true },
    {
      name: "Overview",
      href: sdkSlug,
    },
    {
      name: "Getting Started",
      href: `${sdkSlug}/getting-started`,
      icon: <ZapIcon />,
    },
    {
      name: "API Reference",
      href: "/dotnet",
      isCollapsible: false,
      icon: <CodeIcon />,
    },
    {
      separator: true,
    },
    {
      name: "Core",
      isCollapsible: false,
      links: [
        {
          name: "Thirdweb Manager",
          href: `${sdkSlug}/thirdwebmanager`,
        },
        {
          name: "Build Instructions",
          href: `${sdkSlug}/build-instructions`,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Onboarding Users",
      isCollapsible: false,
      links: [
        {
          name: "In-App Wallet",
          href: `${walletProvidersSlug}/in-app-wallet`,
        },
        {
          name: "Ecosystem Wallet",
          href: `${walletProvidersSlug}/ecosystem-wallet`,
        },
        {
          name: "Account Abstraction",
          href: `${walletProvidersSlug}/account-abstraction`,
        },
        {
          name: "Private Key Wallet",
          href: `${walletProvidersSlug}/private-key`,
        },
        {
          name: "WalletConnect Wallet",
          href: `${walletProvidersSlug}/walletconnect`,
        },
        {
          name: "MetaMask Wallet (WebGL)",
          href: `${walletProvidersSlug}/metamask`,
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
        {
          name: "Interacting with Contracts",
          href: `${sdkSlug}/contracts`,
        },
        {
          name: "Contract Extensions",
          href: "/dotnet/contracts/extensions",
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Advanced Functionality",
      isCollapsible: false,
      links: [
        {
          name: "Insight Indexer",
          href: "/dotnet/insight/quickstart",
          icon: <ExternalLinkIcon />,
        },
        {
          name: "Nebula AI",
          href: "/dotnet/nebula/quickstart",
          icon: <ExternalLinkIcon />,
        },
        {
          name: "Universal Bridge",
          href: "/dotnet/universal-bridge/quickstart",
          icon: <ExternalLinkIcon />,
        },
      ],
    },

    { separator: true },
    {
      name: "Migrate from v4",
      href: `${sdkSlug}/migration-guide`,
    },
  ],
};

import type { SideBar } from "@/components/Layouts/DocLayout";
import { CodeIcon, ZapIcon } from "lucide-react";

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
      name: "Wallets",
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
      name: "Blockchain API",
      isCollapsible: false,
      links: [
        {
          name: "Interacting with Contracts",
          href: `${sdkSlug}/contracts`,
        },
        {
          name: "Full Reference",
          href: "https://thirdweb-dev.github.io/dotnet/index.html",
        },
      ],
    },
    {
      name: "Pay",
      isCollapsible: false,
      links: [
        {
          name: ".NET SDK QuickStart",
          href: "/dotnet/pay/quickstart",
        },
      ],
    },
    {
      name: "Nebula AI",
      isCollapsible: false,
      links: [
        {
          name: ".NET SDK QuickStart",
          href: "/dotnet/nebula/quickstart",
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

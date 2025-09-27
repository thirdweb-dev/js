import { CodeIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

const sdkSlug = "/unity/v6";
const walletProvidersSlug = `${sdkSlug}/wallets`;

export const sidebar: SideBar = {
  links: [
    { separator: true },
    {
      href: sdkSlug,
      name: "Overview",
    },
    {
      href: `${sdkSlug}/getting-started`,
      icon: <ZapIcon />,
      name: "Getting Started",
    },
    {
      href: "/dotnet",
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
          href: `${sdkSlug}/thirdwebmanager`,
          name: "Thirdweb Manager",
        },
        {
          href: `${sdkSlug}/build-instructions`,
          name: "Build Instructions",
        },
      ],
      name: "Core",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: `${walletProvidersSlug}/in-app-wallet`,
          name: "In-App Wallet",
        },
        {
          href: `${walletProvidersSlug}/ecosystem-wallet`,
          name: "Ecosystem Wallet",
        },
        {
          href: `${walletProvidersSlug}/account-abstraction`,
          name: "Account Abstraction",
        },
        {
          href: `${walletProvidersSlug}/reown`,
          name: "External Wallet (Reown)",
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
          href: `${sdkSlug}/contracts`,
          name: "Interacting with Contracts",
        },
        {
          href: "/dotnet/contracts/extensions",
          name: "Contract Extensions",
        },
      ],
      name: "Onchain Interactions",
    },
    {
      separator: true,
    },
    {
      href: `${sdkSlug}/migration-guide`,
      name: "Migrate from v5",
    },
  ],
  name: "Unity SDK",
};

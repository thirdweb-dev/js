import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { DotNetIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

const walletSlug = "/wallets";

export const sidebar: SideBar = {
  links: [
    {
      href: walletSlug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${walletSlug}/users`,
          name: "User Wallets",
        },
        {
          href: `${walletSlug}/server`,
          name: "Server Wallets",
        },
        {
          href: `${walletSlug}/external-wallets`,
          name: "External Wallets",
        },
        {
          href: `${walletSlug}/ecosystem/set-up`,
          name: "Ecosystem Wallets",
        },
        {
          href: `${walletSlug}/sponsor-gas`,
          name: "Gas Sponsorship",
        },
        {
          href: `${walletSlug}/sponsorship-policies`,
          name: "Sponsorship Policies",
        },
        {
          href: `${walletSlug}/monitor`,
          name: "Monitor Transactions",
        },
        {
          href: `${walletSlug}/get-users`,
          name: "Fetch Users",
        },
        {
          href: `${walletSlug}/pregenerate-wallets`,
          name: "Pregenerate Wallets",
        },
        {
          href: `${walletSlug}/custom-auth`,
          name: "Bring your own Auth",
        },
        {
          href: `${walletSlug}/auth`,
          name: "Sign in with Ethereum",
        },
        {
          href: `${walletSlug}/link-profiles`,
          name: "Link Profiles",
        },
        {
          href: `${walletSlug}/session-keys`,
          name: "Session Keys",
        },
        {
          href: `${walletSlug}/adapters`,
          name: "Usage with other libraries",
        },
      ],
      name: "Guides",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: "/reference#tag/wallets",
          icon: <CodeIcon />,
          name: "HTTP API",
        },
        {
          href: "/references/typescript/v5",
          icon: <TypeScriptIcon />,
          name: "TypeScript",
        },
        {
          href: "/references/typescript/v5",
          icon: <ReactIcon />,
          name: "React",
        },
        {
          href: "/references/typescript/v5",
          icon: <ReactIcon />,
          name: "React Native",
        },
        {
          href: "/dotnet",
          icon: <DotNetIcon />,
          name: "Dotnet",
        },
        {
          href: "/unity",
          icon: <UnityIcon />,
          name: "Unity",
        },
        {
          href: "/unreal-engine",
          icon: <UnrealEngineIcon />,
          name: "Unreal Engine",
        },
      ],
      name: "API References",
    },
    { separator: true },
    {
      isCollapsible: false,
      name: "Resources",
      links: [
        {
          href: "https://playground.com/wallets",
          icon: <ExternalLinkIcon />,
          name: "Playground",
        },
        {
          href: `${walletSlug}/wallet-types`,
          name: "Wallet Types",
        },
        {
          href: `${walletSlug}/security`,
          name: "Security",
        },
        {
          href: `${walletSlug}/faq`,
          name: "FAQ",
        },
      ],
    },
  ],
  name: "Wallets",
};

import { ExternalLinkIcon, ZapIcon } from "lucide-react";
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
          href: `${walletSlug}/sponsor-gas`,
          name: "Sponsor Gas",
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
          href: `${walletSlug}/export-private-key`,
          name: "Export Private Keys",
        },
      ],
      name: "Guides",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
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
          href: "https://playground.thirdweb.com/",
          icon: <ExternalLinkIcon />,
          name: "Playground",
        },
        {
          href: "https://thirdweb.com/templates",
          icon: <ExternalLinkIcon />,
          name: "Templates",
        },
        {
          href: `${walletSlug}/ecosystem/set-up`,
          name: "Ecosystem Wallets",
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

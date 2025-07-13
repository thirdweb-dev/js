import { ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { DotNetIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

// TODO: remove all unused pages
const inAppSlug = "/connect/in-app-wallet";
const connectSlug = "/connect";
const walletSlug = "/connect/wallet";
const aAslug = "/connect/account-abstraction";
const authSlug = "/connect/auth";

export const sidebar: SideBar = {
  links: [
    {
      href: connectSlug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    {
      href: `${walletSlug}/sign-in-methods/configure`,
      name: "Create Wallets",
    },
    {
      href: `${aAslug}/get-started`,
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
      href: `${inAppSlug}/custom-auth/configuration`,
      name: "Bring your own Auth",
    },
    {
      href: `${authSlug}`,
      name: "Sign in with Ethereum",
    },
    {
      href: `${walletSlug}/user-management/link-multiple-identity`,
      name: "Link Multiple Identities",
    },
    {
      href: `${walletSlug}/user-management/export-private-key`,
      name: "Export Private Keys",
    },
    {
      href: `${connectSlug}/external-wallets`,
      name: "External Wallets",
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
  name: "Connect",
};

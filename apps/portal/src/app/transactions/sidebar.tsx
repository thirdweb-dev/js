import { ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { DotNetIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

const transactionsSlug = "/transactions";

export const sidebar: SideBar = {
  links: [
    {
      href: transactionsSlug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    {
      href: `${transactionsSlug}/sponsor`,
      name: "Sponsor Gas",
    },
    {
      href: `${transactionsSlug}/monitor`,
      name: "Monitor Transactions",
    },
    { separator: true },
    {
      name: "Guides",
      isCollapsible: false,
      links: [
        {
          href: `${transactionsSlug}/distribute-tokens`,
          name: "Distribute Tokens",
        },
        {
          href: `${transactionsSlug}/stripe-payments`,
          name: "Sell NFTs with Stripe",
        },
        {
          href: `${transactionsSlug}/session-keys`,
          name: "Session Keys",
        },
      ],
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: "/references/typescript/v5/functions#transactions",
          icon: <TypeScriptIcon />,
          name: "TypeScript",
        },
        {
          href: "/references/typescript/v5/hooks#transactions",
          icon: <ReactIcon />,
          name: "React",
        },
        {
          href: "/references/typescript/v5/hooks#transactions",
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
      name: "Resources",
      isCollapsible: false,
      links: [
        {
          href: `/engine/v3`,
          name: "Engine v3",
        },
        {
          href: `/engine/v2`,
          name: "Engine v2",
        },
        {
          href: `/vault`,
          name: "Vault",
        },
      ],
    },
  ],
  name: "Transactions",
};

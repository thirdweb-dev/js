import { CodeIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  DotNetIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "@/icons";

const slug = "/contracts";

export const sidebar: SideBar = {
  name: "Contracts",
  links: [
    {
      href: slug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/extensions`,
          name: "Use Extensions",
        },
        {
          href: `${slug}/generate`,
          name: "Generate Extensions",
        },
        {
          href: `${slug}/events`,
          name: "Get Contract Events",
        },
        {
          href: `${slug}/transactions`,
          name: "Get Contract Transactions",
        },
        {
          href: `${slug}/deploy`,
          name: "Deploy Contracts",
        },
      ],
      name: "Guides",
    },
    {
      isCollapsible: true,
      links: [
        {
          href: `${slug}/arbitrum-stylus/stylus-contract`,
          name: "Deploy Stylus Contract",
        },
        {
          href: `${slug}/arbitrum-stylus/airdrop-contract`,
          name: "Stylus Airdrop Contract",
        },
        {
          href: `${slug}/arbitrum-stylus/zk-mint`,
          name: "Stylus Zk Mint",
        },
        {
          href: `${slug}/arbitrum-stylus/minting-modules`,
          name: "Stylus Minting Modules",
        },
      ],
      name: "Arbitrum Stylus",
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/reference#tag/gateway",
          icon: <CodeIcon />,
          name: "HTTP API",
        },
        {
          href: "/references/typescript/v5/functions#contract",
          icon: <TypeScriptIcon />,
          name: "TypeScript",
        },
        {
          href: "/references/typescript/v5/functions#contract",
          icon: <ReactIcon />,
          name: "React",
        },
        {
          href: "/references/typescript/v5/functions#contract",
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
      links: [
        {
          href: `${slug}/security`,
          name: "Security",
        },
        {
          href: `${slug}/troubleshoot`,
          name: "Troubleshoot",
        },
        {
          href: `${slug}/faqs`,
          name: "FAQ",
        },
      ],
      name: "Resources",
    },
    { separator: true },
    {
      isCollapsible: true,
      links: [
        {
          href: `${slug}/modular-contracts`,
          name: "Modular Contracts",
        },
      ],
      name: "Archive",
    },
  ],
};

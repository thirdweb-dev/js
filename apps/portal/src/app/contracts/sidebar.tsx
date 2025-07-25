import { ExternalLinkIcon, ZapIcon } from "lucide-react";
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
    {
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLinkIcon />,
      name: "Playground",
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
        /**
         * TODO
         {
          href: `${slug}/encode`,
          name: "Encode Data",
        },
        {
          href: `${slug}/decode`,
          name: "Decode Data",
        },
        {
          href: `${slug}/fetch-abis`,
          name: "Fetch ABIs",
        },
         */
      ],
      name: "Guides",
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
  ],
};

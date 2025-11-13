import { ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { EngineIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

const x402Slug = "/x402";

export const sidebar: SideBar = {
  links: [
    {
      href: x402Slug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    {
      href: "https://playground.thirdweb.com/x402",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${x402Slug}/client`,
          name: "Client Side",
        },
        {
          href: `${x402Slug}/server`,
          name: "Server Side",
        },
        {
          href: `${x402Slug}/agents`,
          name: "Agents",
        },
        {
          href: `${x402Slug}/facilitator`,
          name: "Facilitator",
        },
      ],
      name: "Guides",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `https://payments.thirdweb.com/reference`,
          icon: <EngineIcon />,
          name: "REST API",
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
          href: "https://playground.com/x402",
          icon: <ExternalLinkIcon />,
          name: "Playground",
        },
        {
          href: `${x402Slug}/faq`,
          name: "FAQ",
        },
      ],
      name: "Resources",
    },
  ],
  name: "x402",
};

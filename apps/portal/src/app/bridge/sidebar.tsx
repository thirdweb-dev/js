import { ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { EngineIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

const bridgeSlug = "/bridge";

export const sidebar: SideBar = {
  links: [
    {
      href: bridgeSlug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${bridgeSlug}/sell`,
          name: "Sell Tokens",
        },
        {
          href: `${bridgeSlug}/swap`,
          name: "Swap Tokens",
        },
        {
          href: `${bridgeSlug}/tokens`,
          name: "Get Token Prices",
        },
        {
          href: `${bridgeSlug}/bridge-widget-script`,
          name: "BridgeWidget Script",
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
      name: "Resources",
      links: [
        {
          href: `${bridgeSlug}/fees`,
          name: "Understanding Fees",
        },
        {
          href: `${bridgeSlug}/onramp-providers`,
          name: "Onramp Providers",
        },
        {
          href: `${bridgeSlug}/faq`,
          name: "FAQ",
        },
      ],
    },
  ],
  name: "Bridge",
};

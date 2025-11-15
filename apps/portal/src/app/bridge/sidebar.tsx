import { ExternalLinkIcon, ZapIcon } from "lucide-react";
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
    {
      href: "https://playground.thirdweb.com",
      name: "Playground",
      icon: <ExternalLinkIcon />,
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${bridgeSlug}/swap`,
          name: "Swap Tokens",
        },
        {
          href: `${bridgeSlug}/bridge-widget-script`,
          name: "BridgeWidget Script",
        },
        {
          href: `${bridgeSlug}/fund`,
          name: "Fund Wallets",
        },
        {
          href: `${bridgeSlug}/products`,
          name: "Sell a Product",
        },
        {
          href: `${bridgeSlug}/transactions`,
          name: "Pay for Transactions",
        },
        {
          href: `${bridgeSlug}/send`,
          name: "Send a Payment",
        },
        {
          href: `${bridgeSlug}/sell`,
          name: "Sell Tokens",
        },
        {
          href: `${bridgeSlug}/tokens`,
          name: "Get Token Prices",
        },
        {
          href: `${bridgeSlug}/webhooks`,
          name: "Webhooks",
        },
        {
          href: `${bridgeSlug}/custom-data`,
          name: "Custom Data",
        },
      ],
      name: "Guides",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `/reference`,
          icon: <EngineIcon />,
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

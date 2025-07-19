import { ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { EngineIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

const paymentsSlug = "/payments";

export const sidebar: SideBar = {
  links: [
    {
      href: paymentsSlug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${paymentsSlug}/send`,
          name: "Send a Payment",
        },
        {
          href: `${paymentsSlug}/sell`,
          name: "Sell Tokens",
        },
        {
          href: `${paymentsSlug}/products`,
          name: "Sell a Product",
        },
        {
          href: `${paymentsSlug}/tokens`,
          name: "Get Token Prices",
        },
        {
          href: `${paymentsSlug}/routes`,
          name: "Get Routes",
        },
        {
          href: `${paymentsSlug}/webhooks`,
          name: "Webhooks",
        },
        {
          href: `${paymentsSlug}/custom-data`,
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
          href: `${paymentsSlug}/faq`,
          name: "FAQ",
        },
      ],
    },
  ],
  name: "Payments",
};

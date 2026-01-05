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
      href: "https://playground.thirdweb.com/bridge",
      name: "Playground",
      icon: <ExternalLinkIcon />,
    },
    { separator: true },
    {
      name: "Widgets",
      isCollapsible: false,
      links: [
        {
          name: "Bridge Widget",
          href: `${bridgeSlug}/bridge-widget`,
          links: [
            {
              href: `${bridgeSlug}/bridge-widget/react`,
              name: "React Component",
            },
            {
              href: `${bridgeSlug}/bridge-widget/iframe`,
              name: "Iframe",
            },
            {
              href: `${bridgeSlug}/bridge-widget/script`,
              name: "Script",
            },
          ],
        },
        {
          name: "Checkout Widget",
          href: `${bridgeSlug}/checkout-widget`,
          links: [
            {
              href: `${bridgeSlug}/checkout-widget/react`,
              name: "React Component",
            },
            {
              href: `${bridgeSlug}/checkout-widget/iframe`,
              name: "Iframe",
            },
          ],
        },
        {
          name: "Swap Widget",
          href: `${bridgeSlug}/swap-widget`,
          links: [
            {
              href: `${bridgeSlug}/swap-widget/react`,
              name: "React Component",
            },
            {
              href: `${bridgeSlug}/swap-widget/iframe`,
              name: "Iframe",
            },
          ],
        },
      ],
    },
    { separator: true },
    {
      name: "Guides",
      isCollapsible: false,
      links: [
        {
          href: `${bridgeSlug}/swap`,
          name: "Swap Tokens",
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

import type { SideBar } from "@/components/Layouts/DocLayout";
import { ZapIcon } from "lucide-react";

export const sidebar: SideBar = {
  name: "Unreal Engine SDK",
  links: [
    { separator: true },
    {
      name: "Overview",
      href: "/unreal-engine",
    },
    {
      name: "Getting Started",
      href: "/unreal-engine/getting-started",
      icon: <ZapIcon />,
    },
    {
      name: "Blueprints",
      isCollapsible: true,
      links: [
        {
          name: "Overview",
          href: "/unreal-engine/blueprints",
        },
        {
          name: "In App Wallets",
          href: "/unreal-engine/blueprints/in-app-wallet",
        },
        {
          name: "Smart Wallets",
          href: "/unreal-engine/blueprints/smart-wallet",
        },
        {
          name: "Utilities",
          href: "/unreal-engine/blueprints/utilities",
        },
      ],
    },
    {
      name: "C++",
      isCollapsible: true,
      links: [
        {
          name: "Namespaces",
          isCollapsible: false,
          links: [
            {
              name: "Thirdweb",
              href: "/unreal-engine/cpp/thirdweb",
            },
            {
              name: "ThirdwebUtils",
              href: "/unreal-engine/cpp/thirdweb-utils",
            },
          ],
        },
        {
          name: "Classes",
          isCollapsible: false,
          links: [
            {
              name: "Common",
              href: "/unreal-engine/cpp/common",
            },
            {
              name: "Runtime Settings",
              href: "/unreal-engine/cpp/runtime-settings",
            },
            {
              name: "Wallet Handles",
              href: "/unreal-engine/cpp/wallet-handles",
            },
          ],
        },
      ],
    },
  ],
};

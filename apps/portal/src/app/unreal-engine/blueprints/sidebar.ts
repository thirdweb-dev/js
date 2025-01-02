import { hrefBuilder } from "@/app/unreal-engine/util";
import type { LinkGroup } from "@/components/others/Sidebar";

export const blueprints: LinkGroup = hrefBuilder("/blueprints", {
  name: "Blueprints",
  isCollapsible: true,
  links: [
    {
      name: "Overview",
      href: "",
    },
    {
      name: "In App Wallets",
      href: "/in-app-wallet",
    },
    {
      name: "Smart Wallets",
      href: "/smart-wallet",
    },
    {
      name: "Engine",
      href: "/engine",
    },
    {
      name: "Utilities",
      href: "/utilities",
    },
  ],
});

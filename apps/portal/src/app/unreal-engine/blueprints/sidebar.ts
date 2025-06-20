import { hrefBuilder } from "@/app/unreal-engine/util";
import type { LinkGroup } from "@/components/others/Sidebar";

export const blueprints: LinkGroup = hrefBuilder("/blueprints", {
  isCollapsible: true,
  links: [
    {
      href: "",
      name: "Overview",
    },
    {
      href: "/in-app-wallet",
      name: "In App Wallets",
    },
    {
      href: "/smart-wallet",
      name: "Smart Wallets",
    },
    {
      href: "/engine",
      name: "Engine",
    },
    {
      href: "/utilities",
      name: "Utilities",
    },
  ],
  name: "Blueprints",
});

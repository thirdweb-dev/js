import { hrefBuilder } from "@/app/unreal-engine/util";
import type { LinkGroup } from "@/components/others/Sidebar";

export const cpp: LinkGroup = hrefBuilder("/cpp", {
  isCollapsible: true,
  links: [
    {
      isCollapsible: false,
      links: [
        {
          href: "/thirdweb",
          name: "Thirdweb",
        },
        {
          href: "/thirdweb-utils",
          name: "ThirdwebUtils",
        },
      ],
      name: "Namespaces",
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/common",
          name: "Common",
        },
        {
          href: "/runtime-settings",
          name: "Runtime Settings",
        },
        {
          href: "/wallet-handles",
          name: "Wallet Handles",
        },
      ],
      name: "Classes",
    },
  ],
  name: "C++",
});

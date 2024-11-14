import { hrefBuilder } from "@/app/unreal-engine/util";
import type { LinkGroup } from "@/components/others/Sidebar";

export const cpp: LinkGroup = hrefBuilder("/cpp", {
  name: "C++",
  isCollapsible: true,
  links: [
    {
      name: "Namespaces",
      isCollapsible: false,
      links: [
        {
          name: "Thirdweb",
          href: "/thirdweb",
        },
        {
          name: "ThirdwebUtils",
          href: "/thirdweb-utils",
        },
      ],
    },
    {
      name: "Classes",
      isCollapsible: false,
      links: [
        {
          name: "Common",
          href: "/common",
        },
        {
          name: "Runtime Settings",
          href: "/runtime-settings",
        },
        {
          name: "Wallet Handles",
          href: "/wallet-handles",
        },
      ],
    },
  ],
});

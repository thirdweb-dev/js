import { ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

const slug = "/tokens";

export const sidebar: SideBar = {
  links: [
    {
      href: slug,
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
          isCollapsible: true,
          links: [
            {
              href: `${slug}/deploy-erc20`,
              name: "Deploy ERC-20 Token",
            },
            {
              href: `${slug}/deploy-erc721`,
              name: "Deploy ERC-721 Token",
            },
            {
              href: `${slug}/deploy-erc1155`,
              name: "Deploy ERC-1155 Token",
            },
          ],
          name: "Deploy Tokens",
        },
      ],
      name: "Guides",
    },
    { separator: true },
    // resources
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/security`,
          name: "Security",
        },
        {
          href: `${slug}/faq`,
          name: "FAQ",
        },
      ],
      name: "Resources",
    },
  ],
  name: "Tokens",
};

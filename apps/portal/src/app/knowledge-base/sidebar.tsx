import type { SideBar } from "@/components/Layouts/DocLayout";

import { BracesIcon, CodeIcon, RocketIcon } from "lucide-react";

export const sidebar: SideBar = {
  name: "Support Knowledge Base",
  links: [
    {
      name: "Get Started",
      href: "/knowledge-base/get-started",
      icon: <RocketIcon />,
    },
    {
      separator: true,
    },
    {
      name: "thirdweb Resources",
      isCollapsible: false,
      links: [
        {
          name: "How to",
          icon: <BracesIcon />,
          links: [
            {
              name: "Creating Soulbound NFTs",
              expanded: true,
              href: "/knowledge-base/how-to/creating-soulbound-nfts",
            },
            {
              name: "Console Error Sharing",
              expanded: true,
              href: "/knowledge-base/how-to/console-error-sharing",
            },
            {
              name: "Deploy mint template",
              expanded: true,
              href: "/knowledge-base/how-to/deploy-mint-template",
            },
          ],
        },
      ],
    },
    {
      name: "Troubleshoot",
      isCollapsible: false,
      links: [
        {
          name: "Onchain common errors",
          icon: <RocketIcon />,
          links: [
            {
              name: "Thirdweb CLI: Device Link Error",
              href: "/knowledge-base/onchain-common-errors/thirdweb-cli/device-link-error",
            },
          ],
        },
        {
          name: "Contracts",
          icon: <CodeIcon />,
          links: [
            {
              name: "Airdrop Contract",
              href: "/knowledge-base/troubleshoot/contracts/airdrop-contract",
            },
            {
              name: "Embed Feature Not Found",
              href: "/knowledge-base/troubleshoot/contracts/embed-feature-not-found",
            },
            {
              name: "Batch Upload",
              href: "/knowledge-base/troubleshoot/contracts/batch-upload",
            },
            {
              name: "Transfer Amount Exceeds Allowance",
              href: "/knowledge-base/troubleshoot/contracts/erc20-transfer-allowance",
            },
          ],
        },
      ],
    },
  ],
};

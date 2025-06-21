import { BracesIcon, CodeIcon, RocketIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      href: "/knowledge-base/get-started",
      icon: <RocketIcon />,
      name: "Get Started",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          icon: <BracesIcon />,
          links: [
            {
              expanded: true,
              href: "/knowledge-base/how-to/verify-your-team-email-domain",
              name: "Verify your team email domain",
            },
            {
              expanded: true,
              href: "/knowledge-base/how-to/creating-soulbound-nfts",
              name: "Creating soulbound NFTs",
            },
            {
              expanded: true,
              href: "/knowledge-base/how-to/console-error-sharing",
              name: "Console error sharing",
            },
            {
              expanded: true,
              href: "/knowledge-base/how-to/deploy-mint-template",
              name: "Deploy mint template",
            },
          ],
          name: "How to",
        },
      ],
      name: "thirdweb Resources",
    },
    {
      isCollapsible: false,
      links: [
        {
          icon: <RocketIcon />,
          links: [
            {
              href: "/knowledge-base/onchain-common-errors/thirdweb-cli/device-link-error",
              name: "Thirdweb CLI: Device Link Error",
            },
          ],
          name: "Onchain common errors",
        },
        {
          icon: <CodeIcon />,
          links: [
            {
              href: "/knowledge-base/troubleshoot/contracts/airdrop-contract",
              name: "Airdrop Contract",
            },
            {
              href: "/knowledge-base/troubleshoot/contracts/embed-feature-not-found",
              name: "Embed Feature Not Found",
            },
            {
              href: "/knowledge-base/troubleshoot/contracts/batch-upload",
              name: "Batch Upload",
            },
            {
              href: "/knowledge-base/troubleshoot/contracts/erc20-transfer-allowance",
              name: "Transfer Amount Exceeds Allowance",
            },
          ],
          name: "Contracts",
        },
      ],
      name: "Troubleshoot",
    },
  ],
  name: "Support Knowledge Base",
};

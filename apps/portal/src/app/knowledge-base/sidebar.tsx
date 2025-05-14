import type { SideBar } from "@/components/Layouts/DocLayout";

import {
  BracesIcon,
  CodeIcon,
  ExternalLinkIcon,
  RocketIcon,
  WrenchIcon,
} from "lucide-react";

export const sidebar: SideBar = {
  name: "Support Knowledge Base",
  links: [
    {
      name: "Get Started",
      href: "/knowledge-base/get-started",
      icon: <RocketIcon />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLinkIcon />,
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
        {
          name: "API Reference",
          icon: <BracesIcon />,
          links: [
            {
              name: "Universal Bridge",
              expanded: true,
              links: [
                {
                  name: "Bridge",
                  href: "https://bridge.thirdweb.com/reference",
                },
              ],
            },
            {
              name: "Insight",
              expanded: true,
              links: [
                {
                  name: "Insight service",
                  href: "https://insight-api.thirdweb.com/reference",
                },
              ],
            },
            {
              name: "Engine",
              expanded: true,
              links: [
                {
                  name: "Engine Cloud API",
                  href: "https://engine.thirdweb.com/reference#tag/write",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Help",
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
      ],
    },
    {
      name: "Troubleshoot",
      icon: <WrenchIcon />,
      isCollapsible: false,
      links: [
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
          ],
        },
      ],
    },
  ],
};

import type { SideBar } from "@/components/Layouts/DocLayout";

import {
  BracesIcon,
  CodeIcon,
  ExternalLinkIcon,
  MessageCircleQuestionIcon,
  RocketIcon,
  WorkflowIcon,
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
          href: "/knowledge-base/api-reference",
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
        {
          name: "API Reference",
          href: "/knowledge-base/api-reference",
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
          name: "FAQs",
          href: "/knowledge-base/faqs",
          icon: <MessageCircleQuestionIcon />,
          links: [
            {
              name: "Claude Desktop",
              href: "/knowledge-base/mcp-server/integrations/claude-desktop",
            },
            {
              name: "MCP Clients",
              href: "/knowledge-base/mcp-server/integrations/mcp-clients",
            },
          ],
        },
        {
          name: "Onchain common errors",
          icon: <RocketIcon />,
          links: [
            {
              name: "Claude Desktop",
              href: "/knowledge-base/mcp-server/integrations/claude-desktop",
            },
            {
              name: "MCP Clients",
              href: "/knowledge-base/mcp-server/integrations/mcp-clients",
            },
          ],
        },
        {
          name: "RPC errors",
          icon: <WorkflowIcon />,
          links: [
            {
              name: "Claude Desktop",
              href: "/knowledge-base/mcp-server/integrations/claude-desktop",
            },
            {
              name: "MCP Clients",
              href: "/knowledge-base/mcp-server/integrations/mcp-clients",
            },
          ],
        },
      ],
    },
    {
      name: "Troubleshoot",
      href: "/knowledge-base/troubleshoot",
      icon: <WrenchIcon />,
      isCollapsible: false,
      links: [
        {
          name: "Typescript SDK",
          icon: <CodeIcon />,
          links: [
            {
              name: "Installation",
              href: "/knowledge-base/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
            },
          ],
        },
        {
          name: "React SDK",
          icon: <CodeIcon />,
          links: [
            {
              name: "Installation",
              href: "/knowledge-base/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
            },
          ],
        },
        {
          name: "Engine",
          icon: <CodeIcon />,
          links: [
            {
              name: "Installation",
              href: "/knowledge-base/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
            },
          ],
        },
        {
          name: "Contracts",
          icon: <CodeIcon />,
          links: [
            {
              name: "Installation",
              href: "/knowledge-base/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
            },
          ],
        },
        {
          name: "Insight",
          icon: <CodeIcon />,
          links: [
            {
              name: "Installation",
              href: "/knowledge-base/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
            },
          ],
        },
        {
          name: "AI",
          icon: <CodeIcon />,
          links: [
            {
              name: "Installation",
              href: "/knowledge-base/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
            },
          ],
        },
      ],
    },
  ],
};

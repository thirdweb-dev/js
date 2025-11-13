import { BookIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      name: "Get Started",
      href: "/ai/chat",
      icon: <ZapIcon />,
    },
    {
      href: "https://playground.thirdweb.com",
      name: "Playground",
      icon: <ExternalLinkIcon />,
    },
    { separator: true },
    {
      name: "Guides",
      isCollapsible: false,
      links: [
        {
          name: "Transaction Execution",
          href: "/ai/chat/execution",
        },
        {
          name: "Streaming Responses",
          href: "/ai/chat/streaming",
        },
        {
          name: "Integrations",
          links: [
            {
              name: "Vercel AI SDK",
              href: "/ai/chat/ai-sdk",
            },
            {
              name: "OpenAI SDK",
              href: "/ai/chat/openai-sdk",
            },
          ],
        },
        {
          name: "API Reference",
          href: "/reference#tag/ai/post/ai/chat",
        },
      ],
    },
    { separator: true },
    {
      name: "Agent Tools",
      isCollapsible: false,
      links: [
        {
          name: "MCP Server",
          icon: <ZapIcon />,
          href: "/ai/mcp",
        },
        {
          name: "llms.txt",
          icon: <BookIcon />,
          href: "/ai/llm-txt",
        },
      ],
    },
    { separator: true },
    {
      name: "Resources",
      isCollapsible: false,
      links: [
        {
          href: "/ai/faq",
          name: "FAQ",
        },
      ],
    },
  ],
  name: "AI",
};

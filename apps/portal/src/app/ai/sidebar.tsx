import { BookIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      name: "AI",
      isCollapsible: false,
      links: [
        {
          name: "Get Started",
          href: "/ai/chat",
          icon: <ZapIcon />,
        },
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
          href: "https://playground.thirdweb.com/ai/chat",
          icon: <ExternalLinkIcon />,
          name: "Playground",
        },
        {
          href: "/ai/faq",
          name: "FAQ",
        },
      ],
    },
  ],
  name: "AI",
};

import { BookIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      name: "Blockchain LLM",
      isCollapsible: false,
      links: [
        {
          name: "Get Started",
          href: "/ai/chat",
          icon: <ZapIcon />,
        },
        {
          name: "Playground",
          href: "https://playground.thirdweb.com/ai/chat",
          icon: <ExternalLinkIcon />,
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
          name: "Vercel AI SDK",
          href: "/ai/chat/ai-sdk",
        },
        {
          name: "API Reference",
          href: "/reference#tag/ai/post/ai/chat",
        },
      ],
    },
    { separator: true },
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
  name: "AI",
};

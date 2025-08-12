import { BookIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      name: "Chat API",
      isCollapsible: false,
      links: [
        {
          name: "Get Started",
          href: "/ai/chat",
          icon: <ZapIcon />,
        },
        {
          name: "Response Handling",
          href: "/ai/chat/handling-responses",
        },
        {
          name: "API Reference",
          href: "https://api.thirdweb-dev.com/reference#tag/ai/post/ai/chat",
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

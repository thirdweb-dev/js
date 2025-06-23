import {
  BlocksIcon,
  BracesIcon,
  CodeIcon,
  ExternalLinkIcon,
  KeyIcon,
  MessageCircleQuestionIcon,
  PencilRulerIcon,
  RocketIcon,
  WorkflowIcon,
  WrenchIcon,
} from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { NebulaSideIcon, TypeScriptIcon, UnityIcon } from "@/icons";

export const sidebar: SideBar = {
  links: [
    {
      href: "/nebula",
      icon: <NebulaSideIcon />,
      name: "Overview",
    },
    {
      href: "/nebula/prompt-guide",
      icon: <PencilRulerIcon />,
      name: "Prompt Guide",
    },
    {
      href: "https://nebula.thirdweb.com",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/nebula/get-started",
          icon: <RocketIcon />,
          name: "Get Started",
        },
        {
          icon: <KeyIcon />,
          links: [
            {
              href: "/nebula/key-concepts/chat-execute",
              name: "Chat & Execute",
            },
            {
              href: "/nebula/key-concepts/context-filters",
              name: "Context Filters",
            },
            {
              href: "/nebula/key-concepts/execute-configuration",
              name: "Execute Config",
            },
            {
              href: "/nebula/key-concepts/response-handling",
              name: "Response Handling",
            },
            {
              href: "/nebula/key-concepts/sessions",
              name: "Sessions",
            },
          ],
          name: "Key Concepts",
        },
        {
          href: "/nebula/api-reference",
          icon: <BracesIcon />,
          links: [
            {
              expanded: true,
              links: [
                {
                  href: "/nebula/api-reference/chat",
                  name: "Send Message",
                },
                {
                  href: "/nebula/api-reference/execute",
                  name: "Execute Action",
                },
              ],
              name: "Chat",
            },
            {
              expanded: true,
              links: [
                {
                  href: "/nebula/api-reference/list-session",
                  name: "List Sessions",
                },
                {
                  href: "/nebula/api-reference/get-session",
                  name: "Get Session",
                },
                {
                  href: "/nebula/api-reference/create-session",
                  name: "Create Session",
                },
                {
                  href: "/nebula/api-reference/update-session",
                  name: "Update Session",
                },
                {
                  href: "/nebula/api-reference/clear-session",
                  name: "Clear Session",
                },
                {
                  href: "/nebula/api-reference/delete-session",
                  name: "Delete Session",
                },
              ],
              name: "Session",
            },
          ],
          name: "API Reference",
        },
        {
          icon: <CodeIcon />,
          links: [
            {
              href: "/references/typescript/v5/chat",
              icon: <TypeScriptIcon />,
              name: "Typescript",
            },
            {
              href: "/dotnet/nebula/quickstart",
              icon: <UnityIcon />,
              name: "Unity",
            },
          ],
          name: "SDK Reference",
        },
        {
          href: "/nebula/plugins",
          icon: <BlocksIcon />,
          links: [
            {
              href: "/nebula/plugins/openai",
              name: "OpenAI",
            },
            {
              href: "/nebula/plugins/eliza",
              name: "Eliza",
            },
          ],
          name: "Plugins & Integrations",
        },
      ],
      name: "Nebula (API)",
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/nebula/mcp-server/get-started",
          icon: <RocketIcon />,
          name: "Get Started",
        },
        {
          icon: <WorkflowIcon />,
          links: [
            {
              href: "/nebula/mcp-server/integrations/claude-desktop",
              name: "Claude Desktop",
            },
            {
              href: "/nebula/mcp-server/integrations/mcp-clients",
              name: "MCP Clients",
            },
          ],
          name: "Integrations",
        },
      ],
      name: "MCP Server",
    },
    {
      isCollapsible: false,
      links: [
        {
          icon: <CodeIcon />,
          links: [
            {
              href: "/nebula/tools/python-sdk/installation",
              name: "Installation",
            },
            {
              href: "https://github.com/thirdweb-dev/ai/tree/main/python/examples",
              name: "Examples",
            },
          ],
          name: "Python SDK",
        },
      ],
      name: "Tools",
    },
    {
      separator: true,
    },
    {
      href: "/nebula/troubleshoot",
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: "/nebula/faqs",
      icon: <MessageCircleQuestionIcon />,
      name: "FAQs",
    },
  ],
  name: "AI",
};

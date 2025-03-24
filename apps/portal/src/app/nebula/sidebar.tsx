import type { SideBar } from "@/components/Layouts/DocLayout";
import { NebulaSideIcon, TypeScriptIcon, UnityIcon } from "@/icons";

import {
  Blocks,
  Braces,
  Code,
  ExternalLink,
  Key,
  MessageCircleQuestion,
  PencilRuler,
  Rocket,
  Workflow,
  Wrench,
} from "lucide-react";

export const sidebar: SideBar = {
  name: "AI",
  links: [
    {
      name: "Overview",
      href: "/nebula",
      icon: <NebulaSideIcon />,
    },
    {
      name: "Prompt Guide",
      href: "/nebula/prompt-guide",
      icon: <PencilRuler />,
    },
    {
      name: "Playground",
      href: "https://nebula.thirdweb.com",
      icon: <ExternalLink />,
    },
    {
      separator: true,
    },
    {
      name: "Nebula (API)",
      isCollapsible: false,
      links: [
        {
          name: "Get Started",
          href: "/nebula/get-started",
          icon: <Rocket />,
        },
        {
          name: "Key Concepts",
          icon: <Key />,
          links: [
            {
              name: "Chat & Execute",
              href: "/nebula/key-concepts/chat-execute",
            },
            {
              name: "Context Filters",
              href: "/nebula/key-concepts/context-filters",
            },
            {
              name: "Execute Config",
              href: "/nebula/key-concepts/execute-configuration",
            },
            {
              name: "Response Handling",
              href: "/nebula/key-concepts/response-handling",
            },
            {
              name: "Sessions",
              href: "/nebula/key-concepts/sessions",
            },
          ],
        },
        {
          name: "API Reference",
          href: "/nebula/api-reference",
          icon: <Braces />,
          links: [
            {
              name: "Chat",
              expanded: true,
              links: [
                {
                  name: "Send Message",
                  href: "/nebula/api-reference/chat",
                },
                {
                  name: "Execute Action",
                  href: "/nebula/api-reference/execute",
                },
              ],
            },
            {
              name: "Session",
              expanded: true,
              links: [
                {
                  name: "List Sessions",
                  href: "/nebula/api-reference/list-session",
                },
                {
                  name: "Get Session",
                  href: "/nebula/api-reference/get-session",
                },
                {
                  name: "Create Session",
                  href: "/nebula/api-reference/create-session",
                },
                {
                  name: "Update Session",
                  href: "/nebula/api-reference/update-session",
                },
                {
                  name: "Clear Session",
                  href: "/nebula/api-reference/clear-session",
                },
                {
                  name: "Delete Session",
                  href: "/nebula/api-reference/delete-session",
                },
              ],
            },
          ],
        },
        {
          name: "SDK Reference",
          icon: <Code />,
          links: [
            {
              name: "Typescript",
              href: "/references/typescript/v5/chat",
              icon: <TypeScriptIcon />,
            },
            {
              name: "Unity",
              href: "/dotnet/nebula/quickstart",
              icon: <UnityIcon />,
            },
          ],
        },
        {
          name: "Plugins & Integrations",
          href: "/nebula/plugins",
          icon: <Blocks />,
          links: [
            {
              name: "OpenAI",
              href: "/nebula/plugins/openai",
            },
            {
              name: "Eliza",
              href: "/nebula/plugins/eliza",
            },
          ],
        },
      ]
    },
    {
      name: "MCP Server",
      isCollapsible: false,
      links: [
        {
          name: "Get Started",
          href: "/nebula/mcp-server/get-started",
          icon: <Rocket />,
        },
        {
          name: "Integrations",
          icon: <Workflow />,
          links: [
            {
              name: "Claude Desktop",
              href: "/nebula/mcp-server/integrations/claude-desktop",
            },
            {
              name: "MCP Server",
              href: "/nebula/mcp-server/integrations/mcp-server",
            }
          ]
        }
      ]
    },
    {
      name: "Tools",
      isCollapsible: false,
      links: [
        {
          name: "Python SDK",
          href: "/nebula/tools/python-sdk",
          icon: <Code />,
          links: [
            {
              name: "Installation",
              href: "/nebula/tools/python-sdk/installation",
            },
            {
              name: "Examples",
              href: "/nebula/tools/python-sdk/examples",
            },
          ]
        }

      ]
    },
    {
      separator: true,
    },
    {
      name: "Troubleshoot",
      href: "/nebula/troubleshoot",
      icon: <Wrench />,
    },
    {
      name: "FAQs",
      href: "/nebula/faqs",
      icon: <MessageCircleQuestion />,
    },
  ],
};

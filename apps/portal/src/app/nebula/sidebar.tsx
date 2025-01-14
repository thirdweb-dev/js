import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  BrickIcon,
  CodeIcon,
  EditIcon,
  NebulaSideIcon,
  PluginIcon,
  QuestionIcon,
  TroubleshootIcon,
} from "@/icons";

export const sidebar: SideBar = {
  name: "Nebula",
  links: [
    {
      name: "Overview",
      href: "/nebula",
      icon: <NebulaSideIcon />,
    },
    {
      name: "Use Cases",
      href: "/nebula/use-cases",
      icon: <BrickIcon />,
    },
    {
      name: "Prompt Guide",
      href: "/nebula/prompt-guide",
      icon: <EditIcon />,
    },
    {
      name: "Plugins",
      href: "/nebula/plugins",
      icon: <PluginIcon />,
      links: [
        {
          name: "Eliza",
          href: "/nebula/plugins/eliza",
        },
      ],
    },
    {
      name: "API Reference",
      href: "/nebula/api-reference",
      icon: <CodeIcon />,
      links: [
        {
          name: "GET",
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
          ],
        },
        {
          name: "POST",
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
            {
              name: "Create Session",
              href: "/nebula/api-reference/create-session",
            },
            {
              name: "Clear Session",
              href: "/nebula/api-reference/clear-session",
            },
          ],
        },
        {
          name: "PUT",
          expanded: true,
          links: [
            {
              name: "Update Session",
              href: "/nebula/api-reference/update-session",
            },
          ],
        },
        {
          name: "DELETE",
          expanded: true,
          links: [
            {
              name: "Delete Session",
              href: "/nebula/api-reference/delete-session",
            },
          ],
        },
      ],
    },
    {
      name: "Troubleshoot",
      href: "/nebula/troubleshoot",
      icon: <TroubleshootIcon />,
    },
    {
      name: "FAQs",
      href: "/nebula/faqs",
      icon: <QuestionIcon />,
    },
  ],
};

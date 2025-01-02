import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  BrickIcon,
  CodeIcon,
  EditIcon,
  GetIcon,
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
          name: "Send Message",
          href: "/nebula/api-reference/chat",
          icon: <GetIcon />,
        },
        {
          name: "Execute Transaction",
          href: "/nebula/api-reference/execute",
          icon: <GetIcon />,
        },
        {
          name: "List Sessions",
          href: "/nebula/api-reference/list-session",
          icon: <GetIcon />,
        },
        {
          name: "Get Session",
          href: "/nebula/api-reference/get-session",
          icon: <GetIcon />,
        },
        {
          name: "Create Session",
          href: "/nebula/api-reference/create-session",
          icon: <GetIcon />,
        },

        {
          name: "Update Session",
          href: "/nebula/api-reference/update-session",
          icon: <GetIcon />,
        },
        {
          name: "Clear Session",
          href: "/nebula/api-reference/clear-session",
          icon: <GetIcon />,
        },
        {
          name: "Delete Session",
          href: "/nebula/api-reference/delete-session",
          icon: <GetIcon />,
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

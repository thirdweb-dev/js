import {
  Code2Icon,
  KeyIcon,
  MessageCircleQuestionIcon,
  RocketIcon,
  ShieldQuestionIcon,
  VaultIcon,
  WrenchIcon,
} from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      href: "/vault",
      icon: <VaultIcon />,
      name: "Overview",
    },
    {
      href: "/vault/get-started",
      icon: <RocketIcon />,
      name: "Get Started",
    },
    {
      icon: <KeyIcon />,
      links: [
        {
          href: "/vault/key-concepts/key-management",
          name: "Key Management",
        },
        {
          href: "/vault/key-concepts/entities",
          name: "Entities",
        },
        {
          href: "/vault/key-concepts/accounts",
          name: "Accounts",
        },
        {
          href: "/vault/key-concepts/access-tokens",
          name: "Access Tokens",
        },
        {
          href: "/vault/key-concepts/access-control",
          name: "Access Control",
        },
      ],
      name: "Key Concepts",
    },
    {
      icon: <Code2Icon />,
      links: [
        {
          href: "/vault/sdk",
          name: "Overview",
        },
        {
          href: "/vault/sdk/installation",
          name: "Installation",
        },
        {
          href: "/vault/sdk/api-reference",
          name: "API Reference",
        },
        {
          links: [
            {
              href: "/vault/sdk/guides/creating-eoas",
              name: "Creating & Managing EOAs",
            },
            {
              href: "/vault/sdk/guides/signing",
              name: "Signing Transactions & Messages",
            },
            {
              href: "/vault/sdk/guides/access-tokens",
              name: "Managing Access Tokens",
            },
          ],
          name: "Guides",
        },
      ],
      name: "TypeScript SDK",
    },
    {
      href: "/vault/security",
      icon: <ShieldQuestionIcon />,
      name: "Security",
    },
    {
      href: "/vault/troubleshoot",
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: "/vault/faqs",
      icon: <MessageCircleQuestionIcon />,
      name: "FAQs",
    },
  ],
  name: "Vault",
};

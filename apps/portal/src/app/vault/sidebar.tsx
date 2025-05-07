import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  KeyIcon,
  MessageCircleQuestionIcon,
  RocketIcon,
  ShieldQuestionIcon,
  VaultIcon,
  WrenchIcon,
} from "lucide-react";

export const sidebar: SideBar = {
  name: "Vault",
  links: [
    {
      name: "Overview",
      href: "/vault",
      icon: <VaultIcon />,
    },
    {
      name: "Get Started",
      href: "/vault/get-started",
      icon: <RocketIcon />,
    },
    {
      name: "Key Concepts",
      icon: <KeyIcon />,
      links: [
        {
          name: "Key Management",
          href: "/vault/key-concepts/key-management",
        },
        {
          name: "Entities",
          href: "/vault/key-concepts/entities",
        },
        {
          name: "Accounts",
          href: "/vault/key-concepts/accounts",
        },
        {
          name: "Access Tokens",
          href: "/vault/key-concepts/access-tokens",
        },
        {
          name: "Access Control",
          href: "/vault/key-concepts/access-control",
        },
      ],
    },
    {
      name: "Security",
      href: "/vault/security",
      icon: <ShieldQuestionIcon />,
    },
    {
      name: "Troubleshoot",
      href: "/vault/troubleshoot",
      icon: <WrenchIcon />,
    },
    {
      name: "FAQs",
      href: "/vault/faqs",
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};

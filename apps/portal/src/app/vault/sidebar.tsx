import type { SideBar } from "@/components/Layouts/DocLayout";
import { Key, Rocket, ShieldQuestion, Vault } from "lucide-react";

export const sidebar: SideBar = {
  name: "Vault",
  links: [
    {
      name: "Overview",
      href: "/vault",
      icon: <Vault />,
    },
    {
      name: "Get Started",
      href: "/vault/get-started",
      icon: <Rocket />,
    },
    {
      name: "Key Concepts",
      icon: <Key />,
      links: [
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
          href: "/vault/key-concepts/accounts",
        },
        {
          name: "Access Control",
          href: "/vault/key-concepts/access-control",
        },
      ],
    },
    {
      name: "Security",
      href: "/vault/key-concepts/security",
      icon: <ShieldQuestion />,
    },
  ],
};

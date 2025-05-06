import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  Braces,
  Cloud,
  Code,
  ExternalLink,
  Key,
  MessageCircleQuestion,
  Rocket,
  ShieldQuestion,
  Wallet,
  Wrench,
} from "lucide-react";

const engineV3Slug = "/engine-v3";

export const sidebar: SideBar = {
  name: "Engine",
  links: [
    {
      name: "Overview",
      href: "/engine-v3",
      icon: <Cloud />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/engine/airdrop",
      icon: <ExternalLink />,
    },
    {
      name: "Get Started",
      href: `${engineV3Slug}/get-started`,
      icon: <Rocket />,
    },
    {
      name: "Key Concepts",
      icon: <Key />,
      links: [
        {
          name: "Vault",
          href: "/vault",
        },
      ],
    },
    {
      name: "Configure Wallets",
      icon: <Wallet />,
      links: [
        {
          name: "Smart Server Wallet",
          href: `${engineV3Slug}/configure-wallets/smart-server-wallet`,
        },
      ],
    },
    {
      name: "API Reference",
      href: "https://engine.thirdweb.com/reference",
      icon: <Braces />,
    },
    {
      name: "TypeScript SDK",
      href: "/references/typescript/v5/serverWallet",
      icon: <Code />,
    },
    {
      name: "Security",
      href: "/vault/security",
      icon: <ShieldQuestion />,
    },
    {
      name: "Troubleshoot",
      href: `${engineV3Slug}/troubleshoot`,
      icon: <Wrench />,
    },
    {
      name: "FAQ",
      href: `${engineV3Slug}/faq`,
      icon: <MessageCircleQuestion />,
    },
  ],
};

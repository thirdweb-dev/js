import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  BracesIcon,
  CloudIcon,
  CodeIcon,
  ExternalLinkIcon,
  KeyIcon,
  MessageCircleQuestionIcon,
  RocketIcon,
  ShieldQuestionIcon,
  WalletIcon,
  WrenchIcon,
} from "lucide-react";

const engineV3Slug = "/engine-v3";

export const sidebar: SideBar = {
  name: "Engine",
  links: [
    {
      name: "Overview",
      href: "/engine-v3",
      icon: <CloudIcon />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/engine/airdrop",
      icon: <ExternalLinkIcon />,
    },
    {
      name: "Get Started",
      href: `${engineV3Slug}/get-started`,
      icon: <RocketIcon />,
    },
    {
      name: "Key Concepts",
      icon: <KeyIcon />,
      links: [
        {
          name: "Vault",
          href: "/vault",
        },
      ],
    },
    {
      name: "Configure Wallets",
      icon: <WalletIcon />,
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
      icon: <BracesIcon />,
    },
    {
      name: "TypeScript SDK",
      href: "/references/typescript/v5/serverWallet",
      icon: <CodeIcon />,
    },
    {
      name: "Security",
      href: "/vault/security",
      icon: <ShieldQuestionIcon />,
    },
    {
      name: "Troubleshoot",
      href: `${engineV3Slug}/troubleshoot`,
      icon: <WrenchIcon />,
    },
    {
      name: "FAQ",
      href: `${engineV3Slug}/faq`,
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};

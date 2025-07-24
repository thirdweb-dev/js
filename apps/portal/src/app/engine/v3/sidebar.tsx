import {
  BookOpenIcon,
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
import type { SideBar } from "@/components/Layouts/DocLayout";

const engineV3Slug = "/engine/v3";

export const sidebar: SideBar = {
  links: [
    {
      href: engineV3Slug,
      icon: <CloudIcon />,
      name: "Overview",
    },
    {
      href: "https://playground.thirdweb.com/transactions/airdrop",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      href: `${engineV3Slug}/get-started`,
      icon: <RocketIcon />,
      name: "Get Started",
    },
    {
      icon: <KeyIcon />,
      links: [
        {
          href: "/vault",
          name: "Vault",
        },
      ],
      name: "Key Concepts",
    },
    {
      icon: <WalletIcon />,
      links: [
        {
          href: `${engineV3Slug}/configure-wallets/server-wallets`,
          name: "Smart Server Wallet",
        },
      ],
      name: "Configure Wallets",
    },
    {
      icon: <BookOpenIcon />,
      links: [
        {
          href: `${engineV3Slug}/guides/session-keys`,
          name: "Session Keys",
        },
      ],
      name: "Guides",
    },
    {
      href: "https://engine.thirdweb.com/reference",
      icon: <BracesIcon />,
      name: "API Reference",
    },
    {
      href: "/references/typescript/v5/serverWallet",
      icon: <CodeIcon />,
      name: "TypeScript SDK",
    },
    {
      href: "/vault/security",
      icon: <ShieldQuestionIcon />,
      name: "Security",
    },
    {
      href: `${engineV3Slug}/migrate`,
      icon: <WrenchIcon />,
      name: "Migrate from v2",
    },
    {
      href: `${engineV3Slug}/troubleshoot`,
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: `${engineV3Slug}/faq`,
      icon: <MessageCircleQuestionIcon />,
      name: "FAQ",
    },
  ],
  name: "Transactions",
};

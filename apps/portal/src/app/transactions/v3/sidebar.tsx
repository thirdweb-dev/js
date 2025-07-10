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

const transactionsV3Slug = "/transactions/v3";

export const sidebar: SideBar = {
  links: [
    {
      href: transactionsV3Slug,
      icon: <CloudIcon />,
      name: "Overview",
    },
    {
      href: "https://playground.thirdweb.com/transactions/airdrop",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      href: `${transactionsV3Slug}/get-started`,
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
          href: `${transactionsV3Slug}/configure-wallets/server-wallets`,
          name: "Smart Server Wallet",
        },
      ],
      name: "Configure Wallets",
    },
    {
      icon: <BookOpenIcon />,
      links: [
        {
          href: `${transactionsV3Slug}/guides/session-keys`,
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
      href: `${transactionsV3Slug}/migrate`,
      icon: <WrenchIcon />,
      name: "Migrate from v2",
    },
    {
      href: `${transactionsV3Slug}/troubleshoot`,
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: `${transactionsV3Slug}/faq`,
      icon: <MessageCircleQuestionIcon />,
      name: "FAQ",
    },
  ],
  name: "Transactions",
};

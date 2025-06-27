import {
  BookMarkedIcon,
  BracesIcon,
  CloudIcon,
  CodeIcon,
  ExternalLinkIcon,
  KeyIcon,
  ListCheckIcon,
  MessageCircleQuestionIcon,
  RocketIcon,
  ServerIcon,
  ShieldQuestionIcon,
  WalletIcon,
  WrenchIcon,
} from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

const engineSlug = "/engine/v2";

export const sidebar: SideBar = {
  links: [
    {
      href: engineSlug,
      icon: <CloudIcon />,
      name: "Overview",
    },
    {
      href: "https://playground.thirdweb.com/engine/airdrop",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      href: `${engineSlug}/get-started`,
      icon: <RocketIcon />,
      name: "Get Started",
    },
    {
      icon: <KeyIcon />,
      links: [
        {
          href: `${engineSlug}/features/transactions`,
          name: "Transactions",
        },
        {
          href: `${engineSlug}/features/contracts`,
          name: "Contracts",
        },
        {
          href: `${engineSlug}/features/admins`,
          name: "Admins",
        },
        {
          href: `${engineSlug}/features/access-tokens`,
          name: "Access Tokens",
        },
        {
          href: `${engineSlug}/features/webhooks`,
          name: "Webhooks",
        },
        {
          href: `${engineSlug}/features/preventing-duplicate-transactions`,
          name: "Preventing Duplicate Transactions",
        },
        {
          href: `${engineSlug}/features/custom-chains`,
          name: "Custom Chains",
        },
        {
          href: `${engineSlug}/features/account-abstraction`,
          name: "Account Abstraction",
        },
        {
          href: `${engineSlug}/features/relayers`,
          name: "Relayers",
        },
        {
          href: `${engineSlug}/features/gasless-transactions`,
          name: "Gasless Transactions",
        },
        {
          href: `${engineSlug}/features/contract-subscriptions`,
          name: "Contract Subscriptions",
        },
        {
          href: `${engineSlug}/features/alert-notifications`,
          name: "Alert Notifications",
        },
        {
          href: `${engineSlug}/features/security`,
          name: "Security",
        },
      ],
      name: "Key Concepts",
    },
    {
      href: `${engineSlug}/configure-wallets`,
      icon: <WalletIcon />,
      links: [
        {
          href: `${engineSlug}/configure-wallets/server-wallet`,
          name: "Smart Server Wallet",
        },
        {
          href: `${engineSlug}/configure-wallets/aws-kms`,
          name: "AWS KMS",
        },
        {
          href: `${engineSlug}/configure-wallets/gcp-kms`,
          name: "Google Cloud KMS",
        },
        {
          href: `${engineSlug}/configure-wallets/circle-wallet`,
          name: "Circle Wallet",
        },
        {
          href: `${engineSlug}/configure-wallets/wallet-credentials`,
          name: "Wallet Credentials",
        },
      ],
      name: "Configure Wallets",
    },
    {
      icon: <BookMarkedIcon />,
      links: [
        { href: `${engineSlug}/guides/airdrop-nfts`, name: "Airdrop NFTs" },
        { href: `${engineSlug}/guides/nft-checkout`, name: "NFT Checkout" },
      ],
      name: "Tutorials",
    },
    {
      href: "https://thirdweb-engine.apidocumentation.com/",
      icon: <BracesIcon />,
      name: "API Reference",
    },
    {
      href: `${engineSlug}/references/typescript`,
      icon: <CodeIcon />,
      name: "Typescript SDK",
    },
    {
      href: `${engineSlug}/production-checklist`,
      icon: <ListCheckIcon />,
      name: "Prod Checklist",
    },
    {
      href: `${engineSlug}/self-host`,
      icon: <ServerIcon />,
      name: "Self-Host",
    },
    {
      href: `${engineSlug}/security`,
      icon: <ShieldQuestionIcon />,
      name: "Security",
    },
    {
      href: `${engineSlug}/troubleshooting`,
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: `${engineSlug}/faq`,
      icon: <MessageCircleQuestionIcon />,
      name: "FAQ",
    },
  ],
  name: "Transactions",
};

import type { SideBar } from "@/components/Layouts/DocLayout";
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
  WebhookIcon,
  WrenchIcon,
} from "lucide-react";

const engineSlug = "/engine";

export const sidebar: SideBar = {
  name: "Engine",
  links: [
    {
      name: "Overview",
      href: "/engine",
      icon: <CloudIcon />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/engine/airdrop",
      icon: <ExternalLinkIcon />,
    },
    {
      name: "Get Started",
      href: `${engineSlug}/get-started`,
      icon: <RocketIcon />,
    },
    {
      name: "Key Concepts",
      icon: <KeyIcon />,
      links: [
        {
          name: "Transactions",
          href: `${engineSlug}/features/transactions`,
        },
        {
          name: "Contracts",
          href: `${engineSlug}/features/contracts`,
        },
        {
          name: "Admins",
          href: `${engineSlug}/features/admins`,
        },
        {
          name: "Access Tokens",
          href: `${engineSlug}/features/access-tokens`,
        },
        {
          name: "Webhooks",
          href: `${engineSlug}/features/webhooks`,
        },
        {
          name: "Preventing Duplicate Transactions",
          href: `${engineSlug}/features/preventing-duplicate-transactions`,
        },
        {
          name: "Custom Chains",
          href: `${engineSlug}/features/custom-chains`,
        },
        {
          name: "Account Abstraction",
          href: `${engineSlug}/features/account-abstraction`,
        },
        {
          name: "Relayers",
          href: `${engineSlug}/features/relayers`,
        },
        {
          name: "Gasless Transactions",
          href: `${engineSlug}/features/gasless-transactions`,
        },
        {
          name: "Contract Subscriptions",
          href: `${engineSlug}/features/contract-subscriptions`,
        },
        {
          name: "Alert Notifications",
          href: `${engineSlug}/features/alert-notifications`,
        },
        {
          name: "Security",
          href: `${engineSlug}/features/security`,
        },
      ],
    },
    {
      name: "Configure Wallets",
      href: `${engineSlug}/configure-wallets`,
      icon: <WalletIcon />,
      links: [
        {
          name: "Smart Server Wallet",
          href: `${engineSlug}/configure-wallets/server-wallet`,
        },
        {
          name: "AWS KMS",
          href: `${engineSlug}/configure-wallets/aws-kms`,
        },
        {
          name: "Google Cloud KMS",
          href: `${engineSlug}/configure-wallets/gcp-kms`,
        },
        {
          name: "Circle Wallet",
          href: `${engineSlug}/configure-wallets/circle-wallet`,
        },
        {
          name: "Wallet Credentials",
          href: `${engineSlug}/configure-wallets/wallet-credentials`,
        },
      ],
    },
    {
      name: "Tutorials",
      icon: <BookMarkedIcon />,
      links: [
        { name: "Airdrop NFTs", href: `${engineSlug}/guides/airdrop-nfts` },
        { name: "NFT Checkout", href: `${engineSlug}/guides/nft-checkout` },
      ],
    },
    {
      name: "API Reference",
      href: "https://thirdweb-engine.apidocumentation.com/",
      icon: <BracesIcon />,
    },
    {
      name: "Typescript SDK",
      href: `${engineSlug}/references/typescript`,
      icon: <CodeIcon />,
    },
    {
      name: "Webhooks",
      href: `${engineSlug}/webhooks`,
      icon: <WebhookIcon />,
    },
    {
      name: "Prod Checklist",
      href: `${engineSlug}/production-checklist`,
      icon: <ListCheckIcon />,
    },
    {
      name: "Self-Host",
      href: `${engineSlug}/self-host`,
      icon: <ServerIcon />,
    },
    {
      name: "Security",
      href: `${engineSlug}/security`,
      icon: <ShieldQuestionIcon />,
    },
    {
      name: "Troubleshoot",
      href: `${engineSlug}/troubleshooting`,
      icon: <WrenchIcon />,
    },
    {
      name: "FAQ",
      href: `${engineSlug}/faq`,
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};

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

const transactionsSlug = "/transactions/v2";

export const sidebar: SideBar = {
  links: [
    {
      href: transactionsSlug,
      icon: <CloudIcon />,
      name: "Overview",
    },
    {
      href: "https://playground.thirdweb.com/transactions/airdrop",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      href: `${transactionsSlug}/get-started`,
      icon: <RocketIcon />,
      name: "Get Started",
    },
    {
      icon: <KeyIcon />,
      links: [
        {
          href: `${transactionsSlug}/features/transactions`,
          name: "Transactions",
        },
        {
          href: `${transactionsSlug}/features/contracts`,
          name: "Contracts",
        },
        {
          href: `${transactionsSlug}/features/admins`,
          name: "Admins",
        },
        {
          href: `${transactionsSlug}/features/access-tokens`,
          name: "Access Tokens",
        },
        {
          href: `${transactionsSlug}/features/webhooks`,
          name: "Webhooks",
        },
        {
          href: `${transactionsSlug}/features/preventing-duplicate-transactions`,
          name: "Preventing Duplicate Transactions",
        },
        {
          href: `${transactionsSlug}/features/custom-chains`,
          name: "Custom Chains",
        },
        {
          href: `${transactionsSlug}/features/account-abstraction`,
          name: "Account Abstraction",
        },
        {
          href: `${transactionsSlug}/features/relayers`,
          name: "Relayers",
        },
        {
          href: `${transactionsSlug}/features/gasless-transactions`,
          name: "Gasless Transactions",
        },
        {
          href: `${transactionsSlug}/features/contract-subscriptions`,
          name: "Contract Subscriptions",
        },
        {
          href: `${transactionsSlug}/features/alert-notifications`,
          name: "Alert Notifications",
        },
        {
          href: `${transactionsSlug}/features/security`,
          name: "Security",
        },
      ],
      name: "Key Concepts",
    },
    {
      href: `${transactionsSlug}/configure-wallets`,
      icon: <WalletIcon />,
      links: [
        {
          href: `${transactionsSlug}/configure-wallets/server-wallet`,
          name: "Smart Server Wallet",
        },
        {
          href: `${transactionsSlug}/configure-wallets/aws-kms`,
          name: "AWS KMS",
        },
        {
          href: `${transactionsSlug}/configure-wallets/gcp-kms`,
          name: "Google Cloud KMS",
        },
        {
          href: `${transactionsSlug}/configure-wallets/circle-wallet`,
          name: "Circle Wallet",
        },
        {
          href: `${transactionsSlug}/configure-wallets/wallet-credentials`,
          name: "Wallet Credentials",
        },
      ],
      name: "Configure Wallets",
    },
    {
      icon: <BookMarkedIcon />,
      links: [
        {
          href: `${transactionsSlug}/guides/airdrop-nfts`,
          name: "Airdrop NFTs",
        },
        {
          href: `${transactionsSlug}/guides/nft-checkout`,
          name: "NFT Checkout",
        },
      ],
      name: "Tutorials",
    },
    {
      href: "https://thirdweb-engine.apidocumentation.com/",
      icon: <BracesIcon />,
      name: "API Reference",
    },
    {
      href: `${transactionsSlug}/references/typescript`,
      icon: <CodeIcon />,
      name: "Typescript SDK",
    },
    {
      href: `${transactionsSlug}/production-checklist`,
      icon: <ListCheckIcon />,
      name: "Prod Checklist",
    },
    {
      href: `${transactionsSlug}/self-host`,
      icon: <ServerIcon />,
      name: "Self-Host",
    },
    {
      href: `${transactionsSlug}/security`,
      icon: <ShieldQuestionIcon />,
      name: "Security",
    },
    {
      href: `${transactionsSlug}/troubleshooting`,
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: `${transactionsSlug}/faq`,
      icon: <MessageCircleQuestionIcon />,
      name: "FAQ",
    },
  ],
  name: "Transactions",
};

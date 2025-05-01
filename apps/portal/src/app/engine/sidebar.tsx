import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  BookMarked,
  Braces,
  Cloud,
  Code,
  ExternalLink,
  Key,
  ListCheck,
  MessageCircleQuestion,
  Rocket,
  Server,
  ShieldQuestion,
  Wallet,
  Wrench,
} from "lucide-react";

const engineSlug = "/engine";

export const sidebar: SideBar = {
  name: "Engine",
  links: [
    {
      name: "Overview",
      href: "/engine",
      icon: <Cloud />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/engine/airdrop",
      icon: <ExternalLink />,
    },
    {
      name: "Get Started",
      href: `${engineSlug}/get-started`,
      icon: <Rocket />,
    },
    {
      name: "Configure Wallets",
      href: `${engineSlug}/configure-wallets`,
      icon: <Wallet />,
    },
    {
      name: "Key Concepts",
      icon: <Key />,
      links: [
        {
          name: "Server Wallets",
          href: `${engineSlug}/features/backend-wallets`,
        },
        {
          name: "Wallet Credentials",
          href: `${engineSlug}/features/wallet-credentials`,
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
          name: "Cancelling Transactions",
          href: `${engineSlug}/features/cancelling-transactions`,
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
      name: "Tutorials",
      icon: <BookMarked />,
      links: [
        { name: "Airdrop NFTs", href: `${engineSlug}/guides/airdrop-nfts` },
        { name: "NFT Checkout", href: `${engineSlug}/guides/nft-checkout` },
      ],
    },
    {
      name: "API Reference",
      href: "https://thirdweb-engine.apidocumentation.com/",
      icon: <Braces />,
    },
    {
      name: "Typescript SDK",
      href: `${engineSlug}/references/typescript`,
      icon: <Code />,
    },
    {
      name: "Prod Checklist",
      href: `${engineSlug}/production-checklist`,
      icon: <ListCheck />,
    },
    {
      name: "Self-Host",
      href: `${engineSlug}/self-host`,
      icon: <Server />,
    },
    {
      name: "Security",
      href: `${engineSlug}/security`,
      icon: <ShieldQuestion />,
    },
    {
      name: "Troubleshoot",
      href: `${engineSlug}/troubleshooting`,
      icon: <Wrench />,
    },
    {
      name: "FAQ",
      href: `${engineSlug}/faq`,
      icon: <MessageCircleQuestion />,
    },
  ],
};

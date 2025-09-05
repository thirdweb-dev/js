"use client";

import { ArrowLeftRightIcon, BotIcon, Code2Icon } from "lucide-react";
import type { ShadcnSidebarLink } from "@/components/blocks/full-width-sidebar-layout";
import { ContractIcon } from "../icons/ContractIcon";
import { PayIcon } from "../icons/PayIcon";
import { SmartAccountIcon } from "../icons/SmartAccountIcon";
import { TokenIcon } from "../icons/TokenIcon";
import { WalletProductIcon } from "../icons/WalletProductIcon";

const ai: ShadcnSidebarLink = {
  subMenu: {
    label: "AI",
    icon: BotIcon,
  },
  links: [
    {
      href: "/ai",
      label: "Overview",
      exactMatch: true,
    },
    {
      href: "/ai/chat",
      label: "Blockchain LLM",
    },
    {
      href: "/ai/ai-sdk",
      label: "AI SDK Integration",
    },
  ],
};

const wallets: ShadcnSidebarLink = {
  subMenu: {
    label: "Wallets",
    icon: WalletProductIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/wallets",
      exactMatch: true,
    },
    {
      href: "/wallets/sign-in/button",
      label: "Connect Button",
    },
    {
      href: "/wallets/sign-in/embed",
      label: "Connect Embed",
    },
    {
      href: "/wallets/sign-in/headless",
      label: "Headless Connect",
    },
    {
      href: "/wallets/in-app-wallet",
      label: "In-App Wallets",
    },
    {
      href: "/wallets/ecosystem-wallet",
      label: "Ecosystem Wallets",
    },
    {
      href: "/wallets/auth",
      label: "Authentication (SIWE)",
    },
    {
      href: "/wallets/social",
      label: "Social Profiles",
    },
    {
      subMenu: {
        label: "Headless Components",
      },
      links: [
        {
          label: "Overview",
          href: "/wallets/headless",
          exactMatch: true,
        },
        {
          href: "/wallets/headless/account-components",
          label: "Account Components",
        },
        {
          href: "/wallets/headless/chain-components",
          label: "Chain Components",
        },
        {
          href: "/wallets/headless/wallet-components",
          label: "Wallet Components",
        },
      ],
    },
  ],
};

const contracts: ShadcnSidebarLink = {
  subMenu: {
    label: "Contracts",
    icon: ContractIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/contracts",
      exactMatch: true,
    },
    {
      href: "/contracts/read",
      label: "Read Contract",
    },
    {
      href: "/contracts/write",
      label: "Write Contract",
    },
    {
      href: "/contracts/extensions",
      label: "Pre-built Extensions",
    },
    {
      href: "/contracts/events",
      label: "Listen Contract Events",
    },
  ],
};

const tokens: ShadcnSidebarLink = {
  subMenu: {
    label: "Tokens",
    icon: TokenIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/tokens",
      exactMatch: true,
    },
    {
      href: "/tokens/token-components",
      label: "Token Components",
    },
    {
      href: "/tokens/nft-components",
      label: "NFT Components",
    },
  ],
};

const accountAbstractions: ShadcnSidebarLink = {
  subMenu: {
    label: "Account Abstraction",
    icon: SmartAccountIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/account-abstraction",
      exactMatch: true,
    },
    {
      href: "/account-abstraction/eip-4337",
      label: "EIP-4337",
    },
    {
      href: "/account-abstraction/eip-7702",
      label: "EIP-7702",
    },
    {
      href: "/account-abstraction/eip-5792",
      label: "EIP-5792",
    },
    {
      href: "/account-abstraction/native-aa",
      label: "Native AA (zkSync)",
    },
  ],
};

const payments: ShadcnSidebarLink = {
  subMenu: {
    label: "Payments",
    icon: PayIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/payments",
      exactMatch: true,
    },
    {
      href: "/payments/fund-wallet",
      label: "Buy Crypto",
    },
    {
      href: "/payments/commerce",
      label: "Checkout",
    },
    {
      href: "/payments/transactions",
      label: "Onchain Transaction",
    },
  ],
};

const transactions: ShadcnSidebarLink = {
  subMenu: {
    label: "Transactions",
    icon: ArrowLeftRightIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/transactions",
      exactMatch: true,
    },
    {
      href: "/transactions/users",
      label: "From User Wallets",
    },
    {
      href: "/transactions/airdrop-tokens",
      label: "Airdrop Tokens",
    },
    {
      href: "/transactions/mint-tokens",
      label: "Mint NFTs",
    },
    {
      href: "/transactions/webhooks",
      label: "Webhooks",
    },
  ],
};

export const sidebarLinks: ShadcnSidebarLink[] = [
  ai,
  wallets,
  transactions,
  contracts,
  payments,
  tokens,
  accountAbstractions,
  {
    href: "/reference",
    label: "API Reference",
    icon: Code2Icon,
  },
];

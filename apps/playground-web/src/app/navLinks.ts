"use client";

import {
  BotIcon,
  BringToFrontIcon,
  Code2Icon,
  DollarSignIcon,
} from "lucide-react";
import type { ShadcnSidebarLink } from "@/components/blocks/full-width-sidebar-layout";
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
    {
      subMenu: {
        label: "Transactions",
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
    },
    {
      subMenu: {
        label: "Account Abstraction",
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

const bridge: ShadcnSidebarLink = {
  subMenu: {
    label: "Bridge",
    icon: BringToFrontIcon,
  },
  links: [
    {
      label: "Overview",
      href: "/bridge",
      exactMatch: true,
    },
    {
      href: "/bridge/swap-widget",
      label: "Swap Widget",
    },
    {
      href: "/bridge/buy-widget",
      label: "Buy Widget",
    },
    {
      href: "/bridge/checkout-widget",
      label: "Checkout Widget",
    },
    {
      href: "/bridge/transaction-widget",
      label: "Transaction Widget",
    },
    {
      href: "/bridge/transaction-button",
      label: "Transaction Button",
    },
  ],
};

export const sidebarLinks: ShadcnSidebarLink[] = [
  ai,
  wallets,
  bridge,
  tokens,
  {
    label: "x402",
    href: "/x402",
    icon: DollarSignIcon,
  },
  {
    href: "/reference",
    label: "API Reference",
    icon: Code2Icon,
  },
];

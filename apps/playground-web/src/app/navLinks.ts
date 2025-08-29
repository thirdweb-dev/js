"use client";

import { ArrowLeftRightIcon, BotIcon } from "lucide-react";
import type { ShadcnSidebarLink } from "@/components/blocks/full-width-sidebar-layout";
import { ContractIcon } from "../icons/ContractIcon";
import { InsightIcon } from "../icons/InsightIcon";
import { PayIcon } from "../icons/PayIcon";
import { SmartAccountIcon } from "../icons/SmartAccountIcon";
import { TokenIcon } from "../icons/TokenIcon";
import { WalletProductIcon } from "../icons/WalletProductIcon";
import { insightBlueprints } from "./insight/insightBlueprints";

const ai: ShadcnSidebarLink = {
  subMenu: {
    label: "AI",
    icon: BotIcon,
  },
  links: [
    {
      href: "/ai/chat",
      label: "Blockchain LLM",
    },
    {
      href: "/ai/ai-sdk",
      label: "AI SDK",
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
      href: "/payments/ui-components",
      label: "UI Components",
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
    {
      href: "/payments/backend",
      label: "Payments API",
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

const insightLinks: ShadcnSidebarLink[] = insightBlueprints.map((blueprint) => {
  return {
    links: blueprint.paths.map((pathInfo) => {
      return {
        href: `/insight/${blueprint.id}?path=${pathInfo.path}`,
        label: pathInfo.name,
        exactMatch: true,
      };
    }),
    subMenu: {
      label: blueprint.name,
    },
  };
});

const insight: ShadcnSidebarLink = {
  links: [
    {
      href: "/insight",
      label: "Overview",
      exactMatch: true,
    },
    ...insightLinks,
  ],
  subMenu: {
    label: "Insight",
    icon: InsightIcon,
  },
};

export const sidebarLinks: ShadcnSidebarLink[] = [
  ai,
  wallets,
  transactions,
  contracts,
  payments,
  tokens,
  insight,
  accountAbstractions,
];

import type { SidebarLink } from "../components/ui/sidebar";

export const navLinks: SidebarLink[] = [
  {
    name: "Sign in",
    expanded: true,
    links: [
      {
        name: "Button",
        href: "/connect/sign-in/button",
      },
      {
        name: "Embed",
        href: "/connect/sign-in/embed",
      },
      {
        name: "Headless",
        href: "/connect/sign-in/headless",
      },
    ],
  },
  {
    name: "Account Abstraction",
    expanded: false,
    links: [
      {
        name: "Connect",
        href: "/connect/account-abstraction/connect",
      },
      {
        name: "Sponsor Gas",
        href: "/connect/account-abstraction/sponsor",
      },
      {
        name: "Native AA (zkSync)",
        href: "/connect/account-abstraction/native-aa",
      },
    ],
  },
  {
    name: "In-App Wallet",
    expanded: false,
    links: [
      {
        name: "Any Auth",
        href: "/connect/in-app-wallet",
      },
      {
        name: "Ecosystems",
        href: "/connect/in-app-wallet/ecosystem",
      },
      {
        name: "Sponsor Gas",
        href: "/connect/in-app-wallet/sponsor",
      },
    ],
  },
  {
    name: "Pay",
    expanded: false,
    links: [
      {
        name: "Top up",
        href: "/connect/pay",
      },
      {
        name: "Commerce",
        href: "/connect/pay/commerce",
      },
      {
        name: "Transactions",
        href: "/connect/pay/transactions",
      },
    ],
  },
  {
    name: "Engine",
    expanded: false,
    links: [
      {
        name: "Airdrop",
        href: "/engine/airdrop",
      },
      {
        name: "Minting",
        href: "/engine/minting",
      },
      {
        name: "Webhooks",
        href: "/engine/webhooks",
      },
      // {
      //   name: "Session Keys",
      //   href: "/engine/account-abstraction/session-keys",
      // },
      // {
      //   name: "Smart Backend Wallets",
      //   href: "/engine/account-abstraction/smart-backend-wallets",
      // },
    ],
  },
  {
    name: "Auth",
    href: "/connect/auth",
  },
  {
    name: "Social",
    href: "/connect/social",
  },
  {
    name: "Blockchain API",
    href: "/connect/blockchain-api",
  },
  {
    name: "Headless UI",
    expanded: true,
    links: [
      {
        name: "Account",
        href: "/connect/ui",
      },
      {
        name: "NFT",
        href: "/connect/ui/nft",
      },
      {
        name: "Token",
        href: "/connect/ui/token",
      },
      {
        name: "Chain",
        href: "/connect/ui/chain",
      },
    ],
  },
];

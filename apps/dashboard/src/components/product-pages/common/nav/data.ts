import authIcon from "../../../../../public/assets/product-icons/auth.png";
import contractsProductIcon from "../../../../../public/assets/product-icons/contracts.png";
import deployIcon from "../../../../../public/assets/product-icons/deploy.png";
import embeddedWalletIcon from "../../../../../public/assets/product-icons/embedded-wallet.png";
import engineProductIcon from "../../../../../public/assets/product-icons/engine.png";
import extensionIcon from "../../../../../public/assets/product-icons/extensions.png";
import payIcon from "../../../../../public/assets/product-icons/pay.svg";
import publishIcon from "../../../../../public/assets/product-icons/publish.png";
import rpcEdgeIcon from "../../../../../public/assets/product-icons/rpc-edge.png";
import smartWalletIcon from "../../../../../public/assets/product-icons/smart-wallet.png";
import storageIcon from "../../../../../public/assets/product-icons/storage.png";
import walletSdkIcon from "../../../../../public/assets/product-icons/wallet-sdk.png";
import type { SectionItemProps } from "./types";

export const PRODUCTS: SectionItemProps[] = [
  {
    name: "Deploy",
    label: "deploy",
    description: "Contract deployment built for any use-case",
    link: "/deploy",
    dashboardLink: "/team/~/~/contracts",
    icon: deployIcon,
    section: "contracts",
    inLandingPage: true,
  },
  {
    name: "Build",
    label: "contractkit",
    description: "Write your own smart contracts",
    link: "/build",
    dashboardLink: "https://portal.thirdweb.com/contracts/build/overview",
    icon: extensionIcon,
    section: "contracts",
    inLandingPage: true,
  },
  {
    name: "Explore",
    label: "explore",
    description: "Ready-to-deploy contracts",
    link: "/smart-contracts",
    icon: contractsProductIcon,
    section: "contracts",
    inLandingPage: true,
  },
  {
    name: "Publish",
    label: "publish",
    description: "Publish your contracts on-chain",
    link: "/publish",
    icon: publishIcon,
    section: "contracts",
  },
  {
    name: "Sign in",
    label: "sign-in",
    description:
      "Flexible user sign-up flow with wallet and social sign-in methods",
    link: "/connect",
    dashboardLink: "https://playground.thirdweb.com/connect/sign-in/button",
    icon: walletSdkIcon,
    section: "connect",
    inLandingPage: true,
  },
  {
    name: "Account Abstraction",
    label: "smart-wallet",
    description: "Complete toolkit for Account Abstraction",
    link: "/account-abstraction",
    dashboardLink:
      "https://portal.thirdweb.com/connect/account-abstraction/overview",
    icon: smartWalletIcon,
    section: "connect",
    inLandingPage: true,
  },
  {
    name: "In-App Wallets",
    label: "embedded-wallets",
    description: "Email & social login wallets for your customers",
    link: "/embedded-wallets",
    dashboardLink: "https://portal.thirdweb.com/connect/in-app-wallet/overview",
    icon: embeddedWalletIcon,
    section: "connect",
    inLandingPage: true,
  },
  {
    name: "Pay",
    label: "pay",
    description:
      "Easily integrate fiat onramps and cross-chain crypto purchases",
    link: "/pay",
    dashboardLink: "https://portal.thirdweb.com/connect/pay/overview",
    icon: payIcon,
    section: "connect",
    inLandingPage: true,
  },
  {
    name: "Auth",
    label: "auth",
    description: "Authenticate users with their wallets",
    link: "/auth",
    icon: authIcon,
    section: "connect",
  },
  {
    name: "Storage",
    label: "storage",
    description: "Secure, fast, decentralized storage",
    link: "/storage",
    icon: storageIcon,
    section: "infrastructure",
  },
  {
    name: "RPC Edge",
    label: "rpc-edge",
    description: "Enterprise-grade RPCs, for free",
    link: "/rpc-edge",
    icon: rpcEdgeIcon,
    section: "infrastructure",
  },
  {
    name: "Engine",
    label: "engine",
    description: "HTTP server with contract APIs and backend wallets",
    link: "/engine",
    dashboardLink: "/team/~/~/engine",
    icon: engineProductIcon,
    section: "infrastructure",
    inLandingPage: true,
  },
];

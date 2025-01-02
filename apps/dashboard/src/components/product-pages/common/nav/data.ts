import connectIcon from "../../../../../public/assets/landingpage/connect-icon.png";
import contractsIcon from "../../../../../public/assets/landingpage/contracts-icon.png";
import engineIcon from "../../../../../public/assets/landingpage/engine-icon.png";
import authIcon from "../../../../../public/assets/product-icons/auth.png";
import cliIcon from "../../../../../public/assets/product-icons/cli.svg";
import contractsProductIcon from "../../../../../public/assets/product-icons/contracts.png";
import dashboardProductIcon from "../../../../../public/assets/product-icons/dashboard.svg";
import deployIcon from "../../../../../public/assets/product-icons/deploy.png";
import embeddedWalletIcon from "../../../../../public/assets/product-icons/embedded-wallet.png";
import engineProductIcon from "../../../../../public/assets/product-icons/engine.png";
import extensionIcon from "../../../../../public/assets/product-icons/extensions.png";
import netIcon from "../../../../../public/assets/product-icons/net.svg";
import payIcon from "../../../../../public/assets/product-icons/pay.svg";
import publishIcon from "../../../../../public/assets/product-icons/publish.png";
import reactIcon from "../../../../../public/assets/product-icons/react.svg";
import rpcEdgeIcon from "../../../../../public/assets/product-icons/rpc-edge.png";
import smartWalletIcon from "../../../../../public/assets/product-icons/smart-wallet.png";
import solidityIcon from "../../../../../public/assets/product-icons/solidity.svg";
import storageIcon from "../../../../../public/assets/product-icons/storage.png";
import typescriptIcon from "../../../../../public/assets/product-icons/typescript.svg";
import unityIcon from "../../../../../public/assets/product-icons/unity.svg";
import walletSdkIcon from "../../../../../public/assets/product-icons/wallet-sdk.png";
import chainsIcon from "../../../../../public/assets/solutions-icons/chains.svg";
import gamingIcon from "../../../../../public/assets/solutions-icons/gaming.svg";
import datastoreIcon from "../../../../../public/assets/tw-icons/datastore.png";
import docsIcon from "../../../../../public/assets/tw-icons/docs.svg";
import guidesIcon from "../../../../../public/assets/tw-icons/guides.svg";
import missionIcon from "../../../../../public/assets/tw-icons/mission.svg";
import opensourceIcon from "../../../../../public/assets/tw-icons/opensource.svg";
import templatesIcon from "../../../../../public/assets/tw-icons/templates.svg";
import type { SectionItemProps, SectionProps } from "./types";

export const PRODUCT_SECTIONS: SectionProps[] = [
  {
    name: "Connect",
    label: "connect",
    description: "Onboard, authenticate and manage users",
    link: "/connect",
    icon: connectIcon,
    section: "connect-v2",
  },
  {
    name: "Contracts",
    label: "contracts",
    description: "Create, deploy, and interact with smart contracts",
    link: "/contracts",
    icon: contractsIcon,
    section: "contracts-v2",
  },
  {
    name: "Engine",
    label: "engine",
    description: "Connect your application to decentralized networks",
    link: "/engine",
    icon: engineIcon,
    section: "engine-v2",
  },
];

export const MOBILE_PRODUCTS_SECTIONS: SectionItemProps[] = [
  {
    name: "Connect",
    label: "connect",
    description: "Onboard, authenticate and manage users",
    link: "/connect",
    dashboardLink: "/connect",
    icon: connectIcon,
    section: "connect",
    inLandingPage: true,
  },
  {
    name: "Contracts",
    label: "contracts",
    description: "Create, deploy, and interact with smart contracts",
    link: "/contracts",
    icon: contractsIcon,
    section: "contracts",
  },
  {
    name: "Engine",
    label: "engine",
    description: "Connect your application to decentralized networks",
    link: "/engine",
    dashboardLink: "/engine",
    icon: engineProductIcon,
    section: "infrastructure",
  },
];

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

export const SOLUTIONS: SectionItemProps[] = [
  {
    name: "Gaming",
    label: "gaming",
    description: "Integrate web3 into games",
    link: "/solutions/gaming",
    icon: gamingIcon,
    section: "solutions",
  },
  {
    name: "Chains",
    label: "chains",
    description: "All-in-one dev tools for your chain",
    link: "/solutions/chains",
    icon: chainsIcon,
    section: "solutions",
  },
];

export const COMPANY: SectionItemProps[] = [
  {
    name: "Mission",
    label: "mission",
    description: "Why we work in web3",
    link: "/mission",
    icon: missionIcon,
    section: "company",
  },
  {
    name: "Blog",
    label: "blog",
    description: "Our latest news and updates",
    link: "https://blog.thirdweb.com",
    icon: datastoreIcon,
    section: "company",
  },
];

export const DEVELOPER_SECTIONS = [
  {
    name: "Resources",
    label: "resources",
    description: "Get started and learn how to build with thirdweb platform",
  },
  {
    name: "Dev Tools",
    label: "tools",
    description: "Interfaces for deploying and interacting with contracts",
  },
  {
    name: "SDKs",
    label: "sdks",
    description: "Smart and intuitive SDKs to get you up to speed",
  },
];

export const DEVELOPER_RESOURCES: SectionItemProps[] = [
  {
    name: "Docs",
    label: "docs",
    description: "Complete thirdweb documentation",
    link: "https://portal.thirdweb.com",
    icon: docsIcon,
    section: "resources",
  },
  {
    name: "Templates",
    label: "templates",
    description: "Ready-to-ship repositories",
    link: "/templates",
    icon: templatesIcon,
    section: "resources",
  },
  {
    name: "Guides",
    label: "guides",
    description: "Learn how to build with thirdweb",
    link: "https://blog.thirdweb.com/guides",
    icon: guidesIcon,
    section: "resources",
  },
  {
    name: "Bounties",
    label: "bounties",
    description: "Found an issue? Get rewarded",
    link: "/bounties",
    icon: opensourceIcon,
    section: "resources",
  },
  {
    name: "TypeScript",
    label: "typescript",
    description: "Integrate web3 into your app",
    link: "https://portal.thirdweb.com/typescript/v5",
    icon: typescriptIcon,
    section: "sdks",
  },
  {
    name: "React",
    label: "react",
    description: "Components and Hooks for wallets and contracts",
    link: "https://portal.thirdweb.com/typescript/v5/react",
    icon: reactIcon,
    section: "sdks",
  },
  {
    name: "React Native",
    label: "react-native",
    description: "React Native hooks and components for mobile apps",
    link: "https://portal.thirdweb.com/react-native/v0",
    icon: reactIcon,
    section: "sdks",
  },
  {
    name: "Unity",
    label: "unity",
    description: "Build games with blockchain and web3 capabilities",
    link: "https://portal.thirdweb.com/unity",
    icon: unityIcon,
    section: "sdks",
  },
  {
    name: ".NET",
    label: ".net",
    description: "Build .NET apps and Godot games",
    link: "https://portal.thirdweb.com/dotnet",
    icon: netIcon,
    section: "sdks",
  },
  {
    name: "Dashboard",
    label: "dashboard",
    description: "Manage and analyze contract activity",
    link: "/dashboards",
    icon: dashboardProductIcon,
    section: "tools",
  },
  {
    name: "Solidity",
    label: "solidity",
    description: "Build custom smart contracts efficiently",
    link: "https://portal.thirdweb.com/contracts/build/overview",
    icon: solidityIcon,
    section: "sdks",
  },
  {
    name: "CLI",
    label: "cli",
    description: "Tools to create, build, and deploy web3 applications",
    link: "https://portal.thirdweb.com/cli",
    icon: cliIcon,
    section: "tools",
  },
  {
    name: "Transaction Simulator",
    label: "transaction-simulator",
    description: "",
    link: "/tools/transaction-simulator",
    icon: dashboardProductIcon,
    section: "tools",
  },
  {
    name: "Wei Converter",
    label: "wei-converter",
    description: "",
    link: "https://thirdweb.com/tools/wei-converter",
    icon: dashboardProductIcon,
    section: "tools",
  },
  {
    name: "Hex Converter",
    label: "hex-converter",
    description: "",
    link: "https://thirdweb.com/tools/hex-converter",
    icon: dashboardProductIcon,
    section: "tools",
  },
  {
    name: "Unix Time Converter",
    label: "unixtime-converter",
    description: "",
    link: "https://thirdweb.com/tools/unixtime-converter",
    icon: dashboardProductIcon,
    section: "tools",
  },
  {
    name: "Keccak-256 Converter",
    label: "keccak256-converter",
    description: "",
    link: "https://thirdweb.com/tools/keccak256-converter",
    icon: dashboardProductIcon,
    section: "tools",
  },
];

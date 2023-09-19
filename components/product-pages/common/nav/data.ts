import { FiShoppingCart } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdOutlineLoyalty } from "react-icons/md";
import { TfiStamp } from "react-icons/tfi";
import { SectionProps, SectionItemProps } from "./types";

export const PRODUCT_SECTIONS: SectionProps[] = [
  {
    name: "Smart Contracts",
    label: "contracts",
    description: "Create, deploy, and interact with smart contracts",
    icon: require("public/assets/product-icons/smart-contracts.png"),
  },
  {
    name: "Wallets",
    label: "wallets",
    description: "Onboard, authenticate and manage users",
    icon: require("public/assets/product-icons/wallets.png"),
  },
  {
    name: "Infrastructure",
    label: "infrastructure",
    description: "Connect your application to decentralized networks",
    icon: require("public/assets/product-icons/infrastructure.png"),
  },
  {
    name: "Payments",
    label: "payments",
    description: "Facilitate financial transactions on the blockchain",
    icon: require("public/assets/product-icons/payments.png"),
  },
];

export const PRODUCTS: SectionItemProps[] = [
  {
    name: "Explore",
    label: "explore",
    description: "Ready-to-deploy contracts",
    link: "/smart-contracts",
    icon: require("public/assets/product-icons/contracts.png"),
    section: "contracts",
  },
  {
    name: "Publish",
    label: "publish",
    description: "Publish your contracts on-chain",
    link: "/publish",
    icon: require("public/assets/product-icons/publish.png"),
    section: "contracts",
  },
  {
    name: "Solidity SDK",
    label: "contractkit",
    description: "Build your own contract easily",
    link: "/solidity-sdk",
    icon: require("public/assets/product-icons/extensions.png"),
    section: "contracts",
  },
  {
    name: "Deploy",
    label: "deploy",
    description: "Seamless contract deployment for teams",
    link: "/deploy",
    icon: require("public/assets/product-icons/deploy.png"),
    section: "contracts",
  },
  {
    name: "Auth",
    label: "auth",
    description: "Authenticate users with their wallets",
    link: "/auth",
    icon: require("public/assets/product-icons/auth.png"),
    section: "wallets",
  },
  {
    name: "Wallet SDK",
    label: "wallet-sdk",
    description: "Connect any wallet",
    link: "/wallet-sdk",
    icon: require("public/assets/product-icons/wallet-sdk.png"),
    section: "wallets",
  },
  {
    name: "Smart Wallet",
    label: "smart-wallet",
    description: "Transform UX with Account Abstraction",
    link: "/account-abstraction",
    icon: require("public/assets/product-icons/smart-wallet.svg"),
    section: "wallets",
  },
  {
    name: "Storage",
    label: "storage",
    description: "Secure, fast, decentralized storage",
    link: "/storage",
    icon: require("public/assets/product-icons/storage.png"),
    section: "infrastructure",
  },
  {
    name: "NFT Checkout",
    label: "nft-checkout",
    description: "Accept credit card checkout for NFTs",
    link: "https://withpaper.com/product/checkouts",
    icon: require("public/assets/product-icons/payments.png"),
    section: "payments",
  },
  {
    name: "Engine",
    label: "engine",
    description: "All-in-one API for enterprise-grade Web3 apps",
    link: "/engine",
    icon: require("public/assets/product-icons/engine.png"),
    section: "infrastructure",
  },
];

export const SOLUTIONS: SectionItemProps[] = [
  {
    name: "CommerceKit",
    label: "commerce",
    description: "Integrate web3 into commerce apps",
    link: "/solutions/commerce",
    iconType: FiShoppingCart,
    section: "solutions",
  },
  {
    name: "GamingKit",
    label: "gaming",
    description: "Integrate web3 into games",
    link: "/solutions/gaming",
    iconType: IoGameControllerOutline,
    section: "solutions",
  },
  {
    name: "Minting",
    label: "minting",
    description: "Build and mint NFTs at scale easily",
    link: "/solutions/minting",
    iconType: TfiStamp,
    section: "solutions",
  },
  {
    name: "Loyalty",
    label: "loyalty",
    description: "Activate new customer experiences",
    link: "/solutions/loyalty",
    iconType: MdOutlineLoyalty,
    section: "solutions",
  },
];

export const COMPANY: SectionItemProps[] = [
  {
    name: "About us",
    label: "about",
    description: "Learn more about our company",
    link: "/about",
    icon: require("public/assets/tw-icons/general.png"),
    section: "company",
  },
  {
    name: "Blog",
    label: "blog",
    description: "Our latest news and updates",
    link: "https://blog.thirdweb.com",
    icon: require("public/assets/tw-icons/datastore.png"),
    section: "company",
  },
  {
    name: "Events",
    label: "events",
    description: "Our latest events",
    link: "/events",
    icon: require("public/assets/tw-icons/events.png"),
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
    icon: require("public/assets/tw-icons/pack.png"),
    section: "resources",
  },
  {
    name: "Templates",
    label: "templates",
    description: "Ready-to-ship repositories",
    link: "/templates",
    icon: require("public/assets/tw-icons/dynamic-nft.png"),
    section: "resources",
  },
  {
    name: "Guides",
    label: "guides",
    description: "Learn how to build with thirdweb",
    link: "https://blog.thirdweb.com/guides",
    icon: require("public/assets/tw-icons/edition.png"),
    section: "resources",
  },
  {
    name: "Open Source",
    label: "open-source",
    description: "Learn how to contribute to thirdweb",
    link: "/open-source",
    icon: require("public/assets/tw-icons/advanced-nfts.png"),
    section: "resources",
  },
  {
    name: "SDKs",
    label: "sdk",
    description: "Integrate web3 into your app",
    link: "/sdk",
    icon: require("public/assets/product-icons/sdks.png"),
    section: "sdks",
  },
  {
    name: "Dashboard",
    label: "dashboard",
    description: "Manage and analyze contract activity",
    link: "/dashboards",
    icon: require("public/assets/product-icons/dashboards.png"),
    section: "tools",
  },
  {
    name: "UI Components",
    label: "ui-components",
    description: "Plug-and-play frontend components",
    link: "/ui-components",
    icon: require("public/assets/product-icons/ui-components.png"),
    section: "sdks",
  },
  {
    name: "CLI",
    label: "cli",
    description: "Tools to create, build, and deploy web3 applications",
    link: "https://portal.thirdweb.com/cli",
    icon: require("public/assets/product-icons/support.png"),
    section: "tools",
  },
];

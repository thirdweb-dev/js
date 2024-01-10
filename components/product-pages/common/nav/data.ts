import { SectionItemProps, SectionProps } from "./types";

export const PRODUCT_SECTIONS: SectionProps[] = [
  {
    name: "Smart Contracts",
    label: "contracts",
    description: "Create, deploy, and interact with smart contracts",
  },
  {
    name: "Wallets",
    label: "wallets",
    description: "Onboard, authenticate and manage users",
  },
  {
    name: "Infrastructure",
    label: "infrastructure",
    description: "Connect your application to decentralized networks",
  },
  {
    name: "Payments",
    label: "payments",
    description: "Facilitate financial transactions on the blockchain",
  },
];

export const PRODUCTS: SectionItemProps[] = [
  {
    name: "Deploy",
    label: "deploy",
    description: "Contract deployment built for any use-case",
    link: "/deploy",
    dashboardLink: "/dashboard/contracts/deploy",
    icon: require("public/assets/product-icons/deploy.png"),
    section: "contracts",
    inLandingPage: true,
  },
  {
    name: "Build",
    label: "contractkit",
    description: "Write your own smart contracts",
    link: "/build",
    dashboardLink: "/dashboard/contracts/build",
    icon: require("public/assets/product-icons/extensions.png"),
    section: "contracts",
    inLandingPage: true,
  },
  {
    name: "Interact",
    label: "interact",
    description: "Integrate smart contract interactions directly into your app",
    link: "/interact",
    dashboardLink: "https://portal.thirdweb.com/contracts/interact/overview",
    icon: require("public/assets/product-icons/interact.png"),
    section: "contracts",
    inLandingPage: true,
  },
  {
    name: "Explore",
    label: "explore",
    description: "Ready-to-deploy contracts",
    link: "/smart-contracts",
    icon: require("public/assets/product-icons/contracts.png"),
    section: "contracts",
    inLandingPage: true,
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
    name: "Connect",
    label: "connect",
    description: "Fully customizable Connect Wallet component",
    link: "/connect",
    dashboardLink: "/dashboard/wallets/connect",
    icon: require("public/assets/product-icons/wallet-sdk.png"),
    section: "wallets",
    inLandingPage: true,
  },
  {
    name: "Smart Wallet",
    label: "smart-wallet",
    description: "Complete toolkit for Account Abstraction",
    link: "/account-abstraction",
    dashboardLink: "/dashboard/wallets/smart-wallet",
    icon: require("public/assets/product-icons/smart-wallet.png"),
    section: "wallets",
    inLandingPage: true,
  },
  {
    name: "Embedded Wallets",
    label: "embedded-wallets",
    description: "Email & social login wallets for your customers",
    link: "/embedded-wallets",
    dashboardLink: "/dashboard/wallets/embedded",
    icon: require("public/assets/product-icons/embedded-wallet.png"),
    section: "wallets",
    inLandingPage: true,
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
    name: "Storage",
    label: "storage",
    description: "Secure, fast, decentralized storage",
    link: "/storage",
    icon: require("public/assets/product-icons/storage.png"),
    section: "infrastructure",
  },
  {
    name: "RPC Edge",
    label: "rpc-edge",
    description: "Enterprise-grade RPCs, for free",
    link: "/rpc-edge",
    icon: require("public/assets/product-icons/rpc-edge.png"),
    section: "infrastructure",
  },
  {
    name: "NFT Checkout",
    label: "nft-checkout",
    description: "Credit card checkout for NFTs",
    link: "/checkout",
    dashboardLink: "/dashboard/payments/contracts",
    icon: require("public/assets/product-icons/payments.png"),
    section: "payments",
    inLandingPage: true,
  },
  {
    name: "Sponsored Transactions",
    label: "sponsored-transactions",
    description: "Remove all user friction with invisible transactions",
    link: "/sponsored-transactions",
    icon: require("public/assets/product-icons/sponsored-transactions.png"),
    section: "payments",
  },
  {
    name: "Engine",
    label: "engine",
    description: "HTTP server with contract APIs and backend wallets",
    link: "/engine",
    dashboardLink: "/dashboard/engine",
    icon: require("public/assets/product-icons/engine.png"),
    section: "infrastructure",
    inLandingPage: true,
  },
];

const PRODUCT_LABELS = PRODUCTS.map((product) => product.label);
export type ProductLabel = (typeof PRODUCT_LABELS)[number];

export const SOLUTIONS: SectionItemProps[] = [
  {
    name: "Gaming",
    label: "gaming",
    description: "Integrate web3 into games",
    link: "/solutions/gaming",
    icon: require("public/assets/solutions-icons/gaming.svg"),
    section: "solutions",
  },
  {
    name: "Minting",
    label: "minting",
    description: "Build and mint NFTs at scale easily",
    link: "/solutions/minting",
    icon: require("public/assets/solutions-icons/minting.svg"),
    section: "solutions",
  },
  {
    name: "Loyalty",
    label: "loyalty",
    description: "Activate new customer experiences",
    link: "/solutions/loyalty",
    icon: require("public/assets/solutions-icons/loyalty.svg"),
    section: "solutions",
  },
  {
    name: "Marketplace",
    label: "marketplace",
    description: "Add marketplaces to any app or game",
    link: "/solutions/marketplace",
    icon: require("public/assets/solutions-icons/marketplace.svg"),
    section: "solutions",
  },
  {
    name: "Chains",
    label: "chains",
    description: "All-in-one dev tools for your chain",
    link: "/solutions/chains",
    icon: require("public/assets/solutions-icons/chains.svg"),
    section: "solutions",
  },
  {
    name: "Web2 Onboarding",
    label: "web2-onboarding",
    description: "Seamless Web3 onboarding for everyone",
    link: "/solutions/web2-onboarding",
    icon: require("public/assets/solutions-icons/web2-onboarding.svg"),
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
  {
    name: "Wallet SDK",
    label: "wallet-sdk",
    description: "Connect any wallet",
    link: "https://portal.thirdweb.com/wallet-sdk/latest",
    icon: require("public/assets/product-icons/wallet-sdk.png"),
    section: "sdks",
  },
];

export const metrics = [
  {
    title: "Pixels",
    description:
      "Building a web3 game with a thriving ecosystem — with VIP memberships, in-game tokens, and digital assets that users own, on the blockchain.",
    image: require("public/assets/landingpage/pixels.png"),
    mobileImage: require("public/assets/landingpage/mobile-pixels.png"),
    items: [
      {
        title: "100k+",
        description: "Daily Users",
      },
      {
        title: "1.5M+",
        description: "Monthly Transactions",
        colSpan: 2,
      },
      {
        title: "11k+",
        description: "VIP Members",
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/pixels-builds-an-onchain-ecosystem-for-its-web3-game",
    hoverBackground: "#622AFF",
  },
  {
    title: "Coinbase",
    description:
      "Bringing onchain experiences to the real world — with seamless NFT creation, delivery, & transaction management via the Coinbase Wallet app.",
    image: require("public/assets/landingpage/coinbase.png"),
    mobileImage: require("public/assets/landingpage/mobile-coinbase.png"),
    items: [
      {
        title: "1,000+",
        description: "Real-World Transactions",
        colSpan: 2,
      },
      {
        title: "4 Weeks",
        description: "Total Development Time",
        colSpan: 2,
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/coinbase-brings-onchain-experiences-to-life",
    hoverBackground: "#0053FF",
  },
  {
    title: "Mirror",
    description:
      "Empowering creators to build engaged audiences with 'Subscribe to Mint' NFTs — rewarding loyal fans for subscribing to their publication.",
    image: require("public/assets/landingpage/mirror.png"),
    mobileImage: require("public/assets/landingpage/mobile-mirror.png"),
    items: [
      {
        title: "2M+",
        description: "NFTs Minted",
      },
      {
        title: "1M+",
        description: "New Subscribers",
        colSpan: 2,
      },
      {
        title: "120+",
        description: "Publications",
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/mirror-creators-build-loyal-audiences-with-subscriber-nfts",
    hoverBackground: "#007CFF",
  },
];

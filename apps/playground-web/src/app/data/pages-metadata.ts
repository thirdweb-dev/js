import {
  ArrowLeftRightIcon,
  BlocksIcon,
  BotIcon,
  BoxIcon,
  CircleUserIcon,
  CreditCardIcon,
  DollarSignIcon,
  GlobeIcon,
  ImageIcon,
  LinkIcon,
  LockIcon,
  PanelTopIcon,
  PencilIcon,
  PlaneIcon,
  RectangleHorizontalIcon,
  RssIcon,
  ScanTextIcon,
  ShieldIcon,
  ShoppingBagIcon,
  SquircleDashedIcon,
  StampIcon,
  UserIcon,
  WalletCardsIcon,
} from "lucide-react";

export type FeatureCardMetadata = {
  icon: React.FC<{ className?: string }>;
  title: string;
  link: string;
  description: string;
};

export const walletsFeatureCards: FeatureCardMetadata[] = [
  {
    icon: RectangleHorizontalIcon,
    title: "Connect Button",
    link: "/wallets/sign-in/button",
    description:
      "Wallet connection component for EOA or email, mobile, social, and passkey logins",
  },
  {
    icon: PanelTopIcon,
    title: "Connect Embed",
    link: "/wallets/sign-in/embed",
    description: "Embedded component to view balance, get funds, and more",
  },

  {
    icon: SquircleDashedIcon,
    title: "Headless Connect",
    link: "/wallets/sign-in/headless",
    description: "Customizable wallet connection components using React hooks",
  },

  {
    icon: UserIcon,
    title: "In-App Wallets",
    link: "/wallets/in-app-wallet",
    description:
      "Add social login, passkey, phone, or email sign-in to your app",
  },

  {
    icon: LockIcon,
    title: "Authentication (SIWE)",
    link: "/wallets/auth",
    description: "Authenticate users to your backend using their wallet",
  },

  {
    icon: GlobeIcon,
    title: "Social Profiles",
    link: "/wallets/social",
    description:
      "Get user profiles across apps like ENS, Lens, Farcaster, and more",
  },

  {
    icon: BoxIcon,
    title: "Headless Components",
    link: "/wallets/headless",
    description: "Components for rendering various wallet related information",
  },
];

export const headlessComponentsFeatureCards: FeatureCardMetadata[] = [
  {
    icon: CircleUserIcon,
    title: "Account Components",
    link: "/wallets/headless/account-components",
    description: "Components for rendering various account related information",
  },
  {
    icon: LinkIcon,
    title: "Chain Components",
    link: "/wallets/headless/chain-components",
    description: "Components for rendering various chain related information",
  },
  {
    icon: WalletCardsIcon,
    title: "Wallet Components",
    link: "/wallets/headless/wallet-components",
    description: "Components for rendering various wallet related information",
  },
];

export const transactionsFeatureCards: FeatureCardMetadata[] = [
  {
    icon: UserIcon,
    title: "From User Wallets",
    link: "/transactions/users",
    description: "Transactions from user wallets with monitoring and retries.",
  },
  {
    icon: PlaneIcon,
    title: "Airdrop Tokens",
    link: "/transactions/airdrop-tokens",
    description:
      "Airdrop any token with a few lines of code with gas sponsorship, optional.",
  },
  {
    icon: StampIcon,
    title: "Mint NFTs",
    link: "/transactions/mint-tokens",
    description:
      "Gasless and efficient token minting with just a wallet address",
  },

  {
    icon: RssIcon,
    title: "Webhooks",
    link: "/transactions/webhooks",
    description:
      "Receive real-time notifications for transactions and wallet events.",
  },
];

export const contractsFeatureCards: FeatureCardMetadata[] = [
  {
    icon: ScanTextIcon,
    title: "Read Contract",
    link: "/contracts/read",
    description: "Read data from any contract on any EVM",
  },
  {
    icon: PencilIcon,
    title: "Write Contract",
    link: "/contracts/write",
    description: "Send transactions from the connected wallet",
  },
  {
    icon: BlocksIcon,
    title: "Pre-Built Extensions",
    link: "/contracts/extensions",
    description: "High-level read and write functions",
  },
  {
    icon: RssIcon,
    title: "Listen Contract Events",
    link: "/contracts/events",
    description: "Subscribe to any contract event",
  },
];

export const paymentsFeatureCards: FeatureCardMetadata[] = [
  {
    icon: ShoppingBagIcon,
    title: "Buy Crypto",
    link: "/payments/fund-wallet",
    description:
      "Buy any token with ability to customize theme, amounts, and more",
  },
  {
    icon: CreditCardIcon,
    title: "Checkout",
    link: "/payments/commerce",
    description:
      "Enable crypto payments for services and get notified on each sale",
  },
  {
    icon: ArrowLeftRightIcon,
    title: "Onchain Transaction",
    link: "/payments/transactions",
    description:
      "Enable users to pay for onchain transactions with fiat or crypto",
  },
];

export const accountAbstractionsFeatureCards: FeatureCardMetadata[] = [
  {
    icon: ShieldIcon,
    title: "EIP-4337",
    link: "/account-abstraction/eip-4337",
    description:
      "Implement via a higher-layer mempool using objects and bundlers",
  },
  {
    icon: ShieldIcon,
    title: "EIP-7702",
    link: "/account-abstraction/eip-7702",
    description:
      "Allow EOAs to temporarily behave like smart contracts during txs",
  },
  {
    icon: ShieldIcon,
    title: "EIP-5792",
    link: "/account-abstraction/eip-5792",
    description:
      "Define a standard RPC interface for smart account interactions",
  },
  {
    icon: ShieldIcon,
    title: "Native AA (zkSync)",
    link: "/account-abstraction/native-aa",
    description: "Native account abstraction available for zkSync chains",
  },
];

export const tokensFeatureCards: FeatureCardMetadata[] = [
  {
    icon: DollarSignIcon,
    title: "Token Components",
    link: "/tokens/token-components",
    description:
      "Headless UI components for rendering token image, name, and symbol",
  },
  {
    icon: ImageIcon,
    title: "NFT Components",
    link: "/tokens/nft-components",
    description: "Headless UI components for rendering NFT Media and metadata",
  },
];

export const aiFeatureCards: FeatureCardMetadata[] = [
  {
    icon: BotIcon,
    title: "Blockchain LLM",
    link: "/ai/chat",
    description: "thirdweb AI demo chat application",
  },
  {
    icon: BotIcon,
    title: "AI SDK Integration",
    link: "/ai/ai-sdk",
    description: "Use the thirdweb blockchain models with the Vercel AI SDK",
  },
];

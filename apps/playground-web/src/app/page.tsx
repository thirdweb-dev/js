import {
  ArrowLeftRightIcon,
  BlocksIcon,
  BoxIcon,
  BracesIcon,
  CreditCardIcon,
  GlobeIcon,
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
} from "lucide-react";
import Link from "next/link";
import { InsightIcon } from "../icons/InsightIcon";
import { ThirdwebIcon } from "../icons/ThirdwebMiniLogo";

export default function Page() {
  return (
    <main className="pb-10">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="flex mb-6">
            <div className="rounded-full p-3 border  bg-card">
              <ThirdwebIcon
                isMonoChrome
                className="size-9 text-muted-foreground"
              />
            </div>
          </div>

          <h1 className="mb-3 font-bold text-5xl tracking-tighter">
            thirdweb Playground
          </h1>
          <p className="max-w-4xl text-base md:text-lg text-muted-foreground leading-normal">
            Interactive UI components and endpoints to test, tweak, and ship
            faster with thirdweb.
          </p>
        </div>
      </section>

      <div className="container max-w-5xl space-y-12">
        {/* Wallets Section */}
        <section>
          <SectionTitle label="Wallets" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={RectangleHorizontalIcon}
              title="Connect Button"
              href="/wallets/sign-in/button"
              description="Wallet connection component for EOA or email, mobile, social, and passkey logins"
            />
            <FeatureCard
              icon={PanelTopIcon}
              title="Connect Embed"
              href="/wallets/sign-in/embed"
              description="Embedded component to view balance, get funds, and more"
            />
            <FeatureCard
              icon={SquircleDashedIcon}
              title="Headless Connect"
              href="/wallets/sign-in/headless"
              description="Customizable wallet connection components using React hooks"
            />
            <FeatureCard
              icon={UserIcon}
              title="In-App Wallets"
              href="/wallets/in-app-wallet"
              description="Add social login, passkey, phone, or email sign-in to your app"
            />
            <FeatureCard
              icon={LockIcon}
              title="Authentication (SIWE)"
              href="/wallets/auth"
              description="Authenticate users to your backend using their wallet"
            />
            <FeatureCard
              icon={GlobeIcon}
              title="Social Profiles"
              href="/wallets/social"
              description="Get user profiles across apps like ENS, Lens, Farcaster, and more"
            />
          </div>
        </section>

        {/* Transactions Section */}
        <section>
          <SectionTitle label="Transactions" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={PlaneIcon}
              title="Airdrop Tokens"
              href="/transactions/airdrop-tokens"
              description="Airdrop any token with a few lines of code with gas sponsorship, optional."
            />
            <FeatureCard
              icon={StampIcon}
              title="Mint NFTs"
              href="/transactions/mint-tokens"
              description="Gasless and efficient token minting with just a wallet address"
            />
            <FeatureCard
              icon={RssIcon}
              href="/transactions/webhooks"
              title="Webhooks"
              description="Receive real-time notifications for transactions and wallet events."
            />
          </div>
        </section>

        {/* Contracts Section */}
        <section>
          <SectionTitle label="Contracts" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={ScanTextIcon}
              title="Read Contract"
              href="/contracts/read"
              description="Read data from any contract on any EVM"
            />
            <FeatureCard
              icon={PencilIcon}
              title="Write Contract"
              href="/contracts/write"
              description="Send transactions from the connected wallet"
            />
            <FeatureCard
              icon={BlocksIcon}
              title="Pre-Built Extensions"
              href="/contracts/extensions"
              description="High-level read and write functions"
            />
            <FeatureCard
              icon={RssIcon}
              title="Listen Contract Events"
              href="/contracts/events"
              description="Subscribe to any contract event"
            />
          </div>
        </section>

        {/* Payments Section */}
        <section>
          <SectionTitle label="Payments" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BoxIcon}
              title="Payments UI Components"
              description="Onramp, swap, and bridge over 1,000+ crypto tokens"
              href="/payments/ui-components"
            />
            <FeatureCard
              icon={ShoppingBagIcon}
              title="Buy Crypto"
              description="Buy any token with ability to customize theme, amounts, and more"
              href="/payments/fund-wallet"
            />
            <FeatureCard
              icon={CreditCardIcon}
              title="Checkout"
              description="Enable crypto payments for services and get notified on each sale"
              href="/payments/commerce"
            />
            <FeatureCard
              icon={ArrowLeftRightIcon}
              title="Transactions"
              description="Enable users to pay for onchain transactions with fiat or crypto"
              href="/payments/transactions"
            />
            <FeatureCard
              icon={BracesIcon}
              title="Payments API"
              description="Create customizable UIs or backend flows using the HTTP API"
              href="/payments/backend"
            />
          </div>
        </section>

        {/* Insight Section */}
        <section>
          <SectionTitle label="Insight" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={InsightIcon}
              title="Events"
              href="/insight"
              description="Query contract events on any supported EVM chain"
            />
            <FeatureCard
              icon={InsightIcon}
              title="Transactions"
              href="/insight"
              description="Query transactions to and from specified recipients"
            />
            <FeatureCard
              icon={InsightIcon}
              title="Tokens"
              href="/insight"
              description="Query token owners, transfers, prices, and more"
            />
            <FeatureCard
              icon={InsightIcon}
              title="NFTs"
              href="/insight"
              description="Query NFT balances, collections, transfers, metadata, and more."
            />
            <FeatureCard
              icon={InsightIcon}
              title="Wallets"
              href="/insight"
              description="Query transactions to and from specific wallets"
            />
            <FeatureCard
              icon={InsightIcon}
              title="Contracts"
              href="/insight"
              description="Query a contract's ABI or metadata"
            />
          </div>
        </section>

        {/* Account Abstraction Section */}
        <section>
          <SectionTitle label="Account Abstraction" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={ShieldIcon}
              title="EIP-4337"
              href="/account-abstraction/eip-4337"
              description="Implement via a higher-layer mempool using objects and bundlers"
            />
            <FeatureCard
              icon={ShieldIcon}
              title="EIP-7702"
              href="/account-abstraction/eip-7702"
              description="Allow EOAs to temporarily behave like smart contracts during txs"
            />
            <FeatureCard
              icon={ShieldIcon}
              title="EIP-5792"
              href="/account-abstraction/eip-5792"
              description="Define a standard RPC interface for smart account interactions"
            />
            <FeatureCard
              icon={ShieldIcon}
              title="Native (zkSync)"
              href="/account-abstraction/native-aa"
              description="Native account abstraction available for zkSync chains"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle(props: { label: string }) {
  return (
    <h2 className="font-semibold text-xl text-foreground tracking-tight mb-3">
      {props.label}
    </h2>
  );
}

function FeatureCard(props: {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  href: string; // todo make this required
}) {
  return (
    <div className="rounded-lg border bg-card p-4 hover:border-active-border relative">
      <div className="flex mb-4">
        <div className="p-2 rounded-full border bg-background">
          <props.icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <h3 className="font-medium mb-0.5 text-lg tracking-tight">
        <Link className="before:absolute before:inset-0" href={props.href}>
          {props.title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground">{props.description}</p>
    </div>
  );
}

import {
  ArchiveIcon,
  ArrowUpRightIcon,
  BrainIcon,
  BringToFrontIcon,
  CoinsIcon,
  GlobeIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { ChatButton } from "../components/AI/chat-button";
import { Button } from "../components/ui/button";
import {
  DotNetIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "../icons";
import { ConnectIcon } from "../icons/products/ConnectIcon";

export default function Page() {
  return (
    <main className="container max-w-5xl grow pb-24" data-noindex>
      <Hero />
      <div className="space-y-24">
        <ProductsSection />
        <ReferenceSection />
        <ArchiveSection />
      </div>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 lg:py-24">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground">
        Developer Documentation
      </div>

      {/* Title */}
      <h1 className="mb-2 lg:mb-4 font-semibold lg:font-bold text-3xl tracking-tighter lg:text-6xl max-w-2xl bg-gradient-to-t dark:bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
        Build the next generation of internet products
      </h1>

      {/* Subtitle */}
      <p className="mb-8 text-base lg:text-lg text-muted-foreground max-w-xl">
        Where users and AI can spend, earn and transact autonomously.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap justify-center gap-2">
        <ChatButton className="bg-card rounded-xl px-6" />
        <Button
          asChild
          variant="outline"
          className="gap-2 bg-card rounded-xl px-6"
        >
          <Link href="https://playground.thirdweb.com" target="_blank">
            Playground
            <ArrowUpRightIcon className="size-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function SectionHeader(props: { title: string; description: string }) {
  return (
    <div className="text-center mb-8">
      <h2 className="font-semibold text-3xl tracking-tight mb-1">
        {props.title}
      </h2>
      <p className="text-muted-foreground">{props.description}</p>
    </div>
  );
}

function ReferenceSection() {
  return (
    <section>
      <SectionHeader
        title="SDKs"
        description="Build on any platform with our SDKs"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="TypeScript"
          description="SDK for web and node.js applications"
          href="/references/typescript/v5"
          icon={TypeScriptIcon}
        />
        <Card
          title="React"
          description="Hooks and components for React apps"
          href="/references/typescript/v5"
          icon={ReactIcon}
        />
        <Card
          title="React Native"
          description="SDK for React Native apps"
          href="/references/typescript/v5"
          icon={ReactIcon}
        />
        <Card
          title=".NET"
          description="SDK for .NET applications"
          href="/dotnet"
          icon={DotNetIcon}
        />
        <Card
          title="Unity"
          description="SDK for Unity games"
          href="/unity"
          icon={UnityIcon}
        />
        <Card
          title="Unreal Engine"
          description="SDK for Unreal Engine games"
          href="/unreal-engine"
          icon={UnrealEngineIcon}
        />
      </div>
    </section>
  );
}

function ArchiveSection() {
  return (
    <section>
      <p className="font-semibold text-muted-foreground text-3xl tracking-tighter mb-8 text-center">
        Archived Documentation
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <MinimalCard
          title="Insight API"
          description="Insight API Documentation"
          href="https://insight.thirdweb.com/reference"
          icon={ArchiveIcon}
          external
        />
        <MinimalCard
          title="Payments API"
          description="Payments API Documentation"
          href="https://bridge.thirdweb.com/reference"
          icon={ArchiveIcon}
          external
        />
        <MinimalCard
          title="Transactions"
          description="Transactions knowledge base and guides"
          href="/engine"
          icon={ArchiveIcon}
        />
        <MinimalCard
          title="Contracts"
          description="Contracts knowledge base and guides"
          href="/contracts"
          icon={ArchiveIcon}
        />
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Wallets"
          description="Create wallets for your users with flexible authentication options"
          href="/wallets"
          icon={ConnectIcon}
        />
        <Card
          title="x402"
          description="Internet-native payments with the HTTP 402 protocol"
          href="/x402"
          icon={ZapIcon}
        />
        <Card
          title="Bridge"
          description="Swap and bridge tokens seamlessly across chains"
          href="/bridge"
          icon={BringToFrontIcon}
        />
        <Card
          title="Tokens"
          description="Launch and manage tokens and create markets on any blockchain"
          href="/tokens"
          icon={CoinsIcon}
        />
        <Card
          title="Blockchain LLM"
          description="Read and write onchain via natural language"
          href="/ai/chat"
          icon={BrainIcon}
        />
        <Card
          title="HTTP API"
          description="Build products with our comprehensive HTTP API"
          href="/reference"
          icon={GlobeIcon}
        />
      </div>
    </section>
  );
}

function Card(props: {
  title: string;
  description?: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  external?: boolean;
}) {
  return (
    <Link
      href={props.href}
      target={props.external ? "_blank" : undefined}
      className="group relative flex flex-col rounded-2xl border bg-card px-6 py-8 md:py-10 transition-all duration-300 hover:border-active-border"
    >
      {/* Icon */}
      <div className="items-center justify-start flex mb-5">
        <div className="rounded-full bg-background border p-2.5">
          <props.icon className="size-5 text-muted-foreground transition-colors" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-semibold text-xl tracking-tight">{props.title}</h3>
        {props.description && (
          <p className="text-sm text-muted-foreground text-pretty">
            {props.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function MinimalCard(props: {
  title: string;
  description?: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  external?: boolean;
}) {
  return (
    <Link
      href={props.href}
      target={props.external ? "_blank" : undefined}
      className="group relative items-center flex rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-active-border gap-4"
    >
      <div className="rounded-full bg-background border p-3">
        <props.icon className="size-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="space-y-0.5">
        <h3 className="font-medium text-lg">{props.title}</h3>
        {props.description && (
          <p className="text-sm text-muted-foreground text-pretty">
            {props.description}
          </p>
        )}
      </div>
    </Link>
  );
}

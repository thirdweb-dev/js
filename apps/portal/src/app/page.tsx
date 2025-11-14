import {
  ArchiveIcon,
  ArrowUpRightIcon,
  BrainIcon,
  CoinsIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/Document";
import { ChatButton } from "../components/AI/chat-button";
import { Button } from "../components/ui/button";
import {
  DotNetIcon,
  ExternalLinkIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "../icons";
import { ConnectIcon } from "../icons/products/ConnectIcon";
import DocsHeroDark from "./_images/docs-hero-dark.png";
import DocsHeroLight from "./_images/docs-hero-light.png";

export default function Page() {
  return (
    <main
      className="container max-w-5xl grow pb-[4.75rem] scale-y-[0.95] origin-top"
      data-noindex
    >
      <Hero />
      <div className="space-y-8">
        <LearningResourcesSection />
        <ReferenceSection />
        <ArchiveSection />
      </div>
    </main>
  );
}

function Hero() {
  return (
    <section className="grid gap-4 pt-14 pb-6 lg:grid-cols-[1fr_420px] lg:py-0">
      {/* Left */}
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="mb-3 font-bold text-4xl tracking-tighter lg:text-6xl">
            thirdweb Documentation
          </h1>
          <p className="mb-6 max-w-lg text-base lg:text-lg text-muted-foreground leading-normal text-pretty">
            Platform for building the next generation of internet products
          </p>
          <div className="flex gap-3">
            <ChatButton />
            <Button
              asChild
              className="flex items-center gap-2 rounded-full bg-card"
              variant="outline"
            >
              <Link href="https://playground.thirdweb.com">
                Playground
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="hidden justify-center lg:flex">
        <Image alt="" className="dark-only w-full" src={DocsHeroDark} />
        <Image alt="" className="light-only w-full" src={DocsHeroLight} />
      </div>
    </section>
  );
}

function ArchiveSection() {
  return (
    <section>
      <SectionTitle anchorId="client" title="Archived Documentation" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCardIndex
          description="Insight API Documentation"
          href="https://insight.thirdweb.com/reference"
          icon={ArchiveIcon}
          title="Insight API"
          external
        />
        <ArticleCardIndex
          description="Payments API Documentation"
          href="https://bridge.thirdweb.com/reference"
          icon={ArchiveIcon}
          title="Payments API"
          external
        />
        <ArticleCardIndex
          description="Transactions knowledge base and guides"
          href="/transactions"
          icon={ArchiveIcon}
          title="Transactions"
          external
        />
        <ArticleCardIndex
          description="Contracts knowledge base and guides"
          href="/contracts"
          icon={ArchiveIcon}
          title="Contracts"
          external
        />
      </div>
    </section>
  );
}

function ReferenceSection() {
  return (
    <section>
      <SectionTitle anchorId="client" title="Client libraries" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SDKCard
          href="/references/typescript/v5"
          icon={TypeScriptIcon}
          title="TypeScript"
        />
        <SDKCard
          href="/references/typescript/v5"
          icon={ReactIcon}
          title="React"
        />
        <SDKCard
          href="/references/typescript/v5"
          icon={ReactIcon}
          title="React Native"
        />
        <SDKCard href="/dotnet" icon={DotNetIcon} title="DotNet" />
        <SDKCard href="/unity" icon={UnityIcon} title="Unity" />
        <SDKCard
          href="/unreal-engine"
          icon={UnrealEngineIcon}
          title="Unreal Engine"
        />
      </div>
    </section>
  );
}

function LearningResourcesSection() {
  return (
    <section>
      <SectionTitle anchorId="learning" title="Documentation" />
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <ArticleCardIndex
          description="Create wallets to read and transact."
          href="/wallets"
          icon={ConnectIcon}
          title="Wallets"
        />
        <ArticleCardIndex
          description="Create internet native payments with x402"
          href="/x402"
          icon={ZapIcon}
          title="x402"
        />
        <ArticleCardIndex
          description="Swap and bridge tokens across chains"
          href="/bridge"
          icon={CoinsIcon}
          title="Bridge"
        />
        <ArticleCardIndex
          description="Launch tokens and markets"
          href="/tokens"
          icon={CoinsIcon}
          title="Tokens"
        />
        <ArticleCardIndex
          description="Read and write onchain via natural language"
          href="/ai/chat"
          icon={BrainIcon}
          title="AI"
        />
        <ArticleCardIndex
          description="Build products with our HTTP API"
          href="/reference"
          icon={ConnectIcon}
          title="HTTP API"
        />
      </div>
    </section>
  );
}

function SectionTitle(props: { title: string; anchorId: string }) {
  return (
    <Heading anchorId={props.anchorId} anchorClassName="mb-2" level={2}>
      {props.title}
    </Heading>
  );
}

/***
 * This component is only for the index page
 */
function ArticleCardIndex(props: {
  title: string;
  description: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  external?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 hover:border-active-border relative">
      <div className="flex mb-3">
        <div className="p-2 rounded-full border bg-background">
          <props.icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <h3 className="mb-0.5 font-medium text-lg tracking-tight">
        <Link
          className="before:absolute before:inset-0"
          href={props.href}
          target={props.external ? "_blank" : undefined}
        >
          {props.title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground">{props.description}</p>
    </div>
  );
}

function SDKCard(props: {
  title: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-active-border text-foreground/80 hover:text-foreground">
      <div className="p-2 rounded-full border bg-background">
        <props.icon className="size-4 shrink-0" />
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-base text-foreground mb-0.5">
          <Link
            href={props.href}
            target={props.href.includes("http") ? "_blank" : undefined}
            className="before:absolute before:inset-0"
          >
            {props.title}
          </Link>
        </h3>
        <p className="inline-flex items-center gap-1 text-muted-foreground text-xs">
          View docs
          <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
        </p>
      </div>
    </div>
  );
}

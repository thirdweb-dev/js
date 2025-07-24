import { MessageCircleIcon, WebhookIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/Document";
import { Button } from "@/components/ui/button";
import {
  DotNetIcon,
  ExternalLinkIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "../icons";
import { BridgeIcon } from "../icons/products/BridgeIcon";
import { ConnectIcon } from "../icons/products/ConnectIcon";
import { EngineIcon } from "../icons/products/EngineIcon";
import { InsightIcon } from "../icons/products/InsightIcon";
import { PlaygroundIcon } from "../icons/products/PlaygroundIcon";
import DocsHeroDark from "./_images/docs-hero-dark.png";
import DocsHeroLight from "./_images/docs-hero-light.png";
export default function Page() {
  return (
    <main className="container max-w-5xl grow pb-20" data-noindex>
      <Hero />
      <div className="space-y-8">
        <PlaygroundSection />
        <LearningResourcesSection />
        <ReferenceSection />
      </div>
    </main>
  );
}

function Hero() {
  return (
    <section className="grid gap-4 py-14 lg:grid-cols-[1fr_420px] lg:py-0">
      {/* Left */}
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="mb-3 font-bold text-4xl tracking-tighter lg:text-6xl">
            thirdweb Documentation
          </h1>
          <p className="mb-8 max-w-md text-lg text-muted-foreground leading-normal">
            Development framework for building onchain apps, games, and agents.
          </p>
          <div className="flex">
            <Button className="flex items-center gap-2" asChild>
              <Link href="/chat">
                <MessageCircleIcon className="size-4" />
                Ask AI
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

function PlaygroundSection() {
  return (
    <section>
      <SectionTitle anchorId="playground" title="Live Demos" />
      <ArticleCardIndex
        description="Try out our interactive playground to get started"
        external
        href="https://playground.thirdweb.com"
        icon={PlaygroundIcon}
        title="Playground"
      />
    </section>
  );
}

function ReferenceSection() {
  return (
    <>
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

      <section>
        <SectionTitle anchorId="backend" title="Backend APIs" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SDKCard
            href="https://api.thirdweb.com/reference"
            icon={ConnectIcon}
            title="HTTP API"
          />
          <SDKCard
            href="https://engine.thirdweb.com/reference"
            icon={EngineIcon}
            title="Engine"
          />
          <SDKCard
            href="https://insight.thirdweb.com/reference"
            icon={InsightIcon}
            title="Insight"
          />
          <SDKCard
            href="https://bridge.thirdweb.com/reference"
            icon={BridgeIcon}
            title="Payments"
          />
          <SDKCard
            href="/bundler"
            icon={ConnectIcon} // TODO: actual openAPI docs
            title="Bundler"
          />
          <SDKCard href="/webhooks" icon={WebhookIcon} title="Webhooks" />
        </div>
      </section>
    </>
  );
}

function LearningResourcesSection() {
  return (
    <section>
      <SectionTitle anchorId="learning" title="Documentation" />
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <ArticleCardIndex
          description="Create and manage crypto wallets"
          href="/wallets"
          icon={ConnectIcon}
          title="Wallets"
        />
        <ArticleCardIndex
          description="Bridge and onramp tokens on any chain"
          href="/payments"
          icon={BridgeIcon}
          title="Payments"
        />
        <ArticleCardIndex
          description="Reliable transactions and monitoring"
          href="/transactions"
          icon={EngineIcon}
          title="Transactions"
        />
        <ArticleCardIndex
          description="Create, deploy, and manage smart contracts"
          href="/contracts"
          icon={EngineIcon}
          title="Contracts"
        />
        <ArticleCardIndex
          description="Blockchain data queries and transformations"
          href="/insight"
          icon={InsightIcon}
          title="Insight"
        />
        <ArticleCardIndex
          description="Non-custodial key management service"
          href="/vault"
          icon={ConnectIcon}
          title="Vault"
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
          <props.icon className="size-5 text-muted-foreground" />
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
        <h3 className="font-medium text-base text-foreground mb-0.5">
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

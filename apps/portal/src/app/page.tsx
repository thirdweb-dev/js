import { MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Grid, Heading, SDKCard } from "@/components/Document";
import { Button } from "@/components/ui/button";
import {
  DotNetIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "../icons";
import { BridgeIcon } from "../icons/products/BridgeIcon";
import { ConnectIcon } from "../icons/products/ConnectIcon";
import { EngineIcon } from "../icons/products/EngineIcon";
import { InsightIcon } from "../icons/products/InsightIcon";
import { NebulaIcon } from "../icons/products/NebulaIcon";
import { PlaygroundIcon } from "../icons/products/PlaygroundIcon";
import { cn } from "../lib/utils";
import DocsHeroDark from "./_images/docs-hero-dark.png";
import DocsHeroLight from "./_images/docs-hero-light.png";
export default function Page() {
  return (
    <main className="container max-w-[900px] grow pb-20" data-noindex>
      <Hero />
      <div className="grid grid-cols-1 gap-8">
        <PlaygroundSection />
        <LearningResourcesSection />
        <ReferenceSection />
      </div>
    </main>
  );
}

function Hero() {
  return (
    <section className="grid gap-4 py-14 lg:grid-cols-2 lg:py-0">
      {/* Left */}
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="mb-3 font-bold text-4xl tracking-tighter lg:text-6xl">
            thirdweb Documentation
          </h1>
          <p className="mb-8 max-w-md text-lg text-muted-foreground leading-normal">
            Development framework for building onchain apps, games, and agents.
          </p>

          <Link href="/chat">
            <Button className="flex items-center gap-2">
              <MessageCircleIcon className="size-4" />
              Ask AI
            </Button>
          </Link>
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
    <section>
      <SectionTitle anchorId="reference" title="API Reference" />
      <SectionTitle
        anchorId="client"
        className="text-muted-foreground"
        level={4}
        title="Client libraries"
      />
      <Grid>
        <SDKCard
          href="/typescript/v5"
          icon={TypeScriptIcon}
          title="TypeScript"
        />
        <SDKCard href="/react/v5" icon={ReactIcon} title="React" />
        <SDKCard
          href="/react-native/v5"
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
      </Grid>
      <SectionTitle
        anchorId="backend"
        className="text-muted-foreground"
        level={4}
        title="Backend APIs"
      />
      <Grid>
        <SDKCard
          href="https://thirdweb-engine.apidocumentation.com/"
          icon={EngineIcon}
          iconClassName="text-muted-foreground"
          isExternal
          title="Engine"
        />
        <SDKCard
          href="https://insight.thirdweb.com/reference#tag/webhooks"
          icon={InsightIcon}
          iconClassName="text-muted-foreground"
          isExternal
          title="Insight"
        />
        <SDKCard
          href="https://bridge.thirdweb.com/reference"
          icon={BridgeIcon}
          iconClassName="text-muted-foreground"
          isExternal
          title="Universal Bridge"
        />
        <SDKCard
          href="/connect/wallet/get-users"
          icon={ConnectIcon} // TODO: actual openAPI docs
          iconClassName="text-muted-foreground"
          title="Wallets"
        />
        <SDKCard
          href="/connect/account-abstraction/api"
          icon={ConnectIcon} // TODO: actual openAPI docs
          iconClassName="text-muted-foreground"
          title="Bundler"
        />
        <SDKCard
          href="/nebula/api-reference"
          icon={NebulaIcon} // TODO: actual openAPI docs
          iconClassName="text-muted-foreground"
          title="Nebula"
        />
      </Grid>
    </section>
  );
}

function LearningResourcesSection() {
  return (
    <section>
      <SectionTitle anchorId="learning" title="Learning Resources" />
      <Grid className="md:grid-cols-1 lg:grid-cols-2">
        <ArticleCardIndex
          description="Wallets, auth, and onchain interactions"
          href="/connect"
          icon={ConnectIcon}
          title="Connect"
        />
        <ArticleCardIndex
          description="Bridge and onramp tokens on any chain"
          href="/pay"
          icon={BridgeIcon}
          title="Universal Bridge"
        />
        <ArticleCardIndex
          description="Reliable transactions and monitoring"
          href="/engine"
          icon={EngineIcon}
          title="Engine"
        />
        <ArticleCardIndex
          description="Blockchain data queries and transformations"
          href="/insight"
          icon={InsightIcon}
          title="Insight"
        />
        <ArticleCardIndex
          description="API interface for LLMs"
          href="/nebula"
          icon={NebulaIcon}
          title="Nebula"
        />
      </Grid>
    </section>
  );
}

function SectionTitle(props: {
  title: string;
  anchorId: string;
  level?: number;
  className?: string;
}) {
  return (
    <Heading
      anchorClassName="mb-4 mt-0"
      anchorId={props.anchorId}
      className={cn(props.className)}
      level={props.level || 2}
    >
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
  icon?: React.FC<{ className?: string }>;
  external?: boolean;
}) {
  return (
    <Link
      className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-active-border"
      href={props.href}
      target={props.external ? "_blank" : undefined}
    >
      <div className="flex items-center gap-3">
        {props.icon && <props.icon className="text-muted-foreground" />}
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-foreground text-lg">
            {props.title}
          </h3>
          <p className="text-muted-foreground">{props.description}</p>
        </div>
      </div>
    </Link>
  );
}

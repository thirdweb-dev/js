import { Grid, Heading, SDKCard } from "@/components/Document";
import Image from "next/image";
import Link from "next/link";
import { UnityIcon } from "../icons";
import { DotNetIcon } from "../icons";
import { UnrealEngineIcon } from "../icons";
import { ReactIcon } from "../icons";
import { TypeScriptIcon } from "../icons";
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
        </div>
      </div>

      {/* right */}
      <div className="hidden justify-center lg:flex">
        <Image src={DocsHeroDark} alt="" className="dark-only w-full" />
        <Image src={DocsHeroLight} alt="" className="light-only w-full" />
      </div>
    </section>
  );
}

function PlaygroundSection() {
  return (
    <section>
      <SectionTitle id="playground" title="Live Demos" />
      <ArticleCardIndex
        href="https://playground.thirdweb.com"
        title="Playground"
        external
        description="Try out our interactive playground to get started"
        icon={PlaygroundIcon}
      />
    </section>
  );
}

function ReferenceSection() {
  return (
    <section>
      <SectionTitle id="reference" title="API Reference" />
      <SectionTitle
        id="client"
        title="Client libraries"
        level={4}
        className="text-muted-foreground"
      />
      <Grid>
        <SDKCard
          title="TypeScript"
          href="/typescript/v5"
          icon={TypeScriptIcon}
        />
        <SDKCard title="React" href="/react/v5" icon={ReactIcon} />
        <SDKCard
          title="React Native"
          href="/react-native/v5"
          icon={ReactIcon}
        />
        <SDKCard title="DotNet" href="/dotnet" icon={DotNetIcon} />
        <SDKCard title="Unity" href="/unity" icon={UnityIcon} />
        <SDKCard
          title="Unreal Engine"
          href="/unreal-engine"
          icon={UnrealEngineIcon}
        />
      </Grid>
      <SectionTitle
        id="backend"
        title="Backend APIs"
        level={4}
        className="text-muted-foreground"
      />
      <Grid>
        <SDKCard
          title="Engine"
          href="https://thirdweb-engine.apidocumentation.com/"
          icon={EngineIcon}
          isExternal
          iconClassName="text-muted-foreground"
        />
        <SDKCard
          title="Insight"
          href="https://insight.thirdweb.com/reference#tag/webhooks"
          icon={InsightIcon}
          isExternal
          iconClassName="text-muted-foreground"
        />
        <SDKCard
          title="Universal Bridge"
          href="https://bridge.thirdweb.com/reference"
          icon={BridgeIcon}
          isExternal
          iconClassName="text-muted-foreground"
        />
        <SDKCard
          title="Wallets"
          href="/connect/wallet/get-users" // TODO: actual openAPI docs
          icon={ConnectIcon}
          iconClassName="text-muted-foreground"
        />
        <SDKCard
          title="Nebula"
          href="/nebula/api-reference" // TODO: actual openAPI docs
          icon={NebulaIcon}
          iconClassName="text-muted-foreground"
        />
      </Grid>
    </section>
  );
}

function LearningResourcesSection() {
  return (
    <section>
      <SectionTitle id="learning" title="Learning Resources" />
      <Grid className="md:grid-cols-1 lg:grid-cols-2">
        <ArticleCardIndex
          href="/connect"
          title="Connect"
          description="Wallets, auth, and onchain interactions"
          icon={ConnectIcon}
        />
        <ArticleCardIndex
          href="/pay"
          title="Universal Bridge"
          description="Bridge and onramp tokens on any chain"
          icon={BridgeIcon}
        />
        <ArticleCardIndex
          href="/engine"
          title="Engine"
          description="Reliable transactions and monitoring"
          icon={EngineIcon}
        />
        <ArticleCardIndex
          href="/insight"
          title="Insight"
          description="Blockchain data queries and transformations"
          icon={InsightIcon}
        />
        <ArticleCardIndex
          href="/nebula"
          title="Nebula"
          description="API interface for LLMs"
          icon={NebulaIcon}
        />
      </Grid>
    </section>
  );
}

function SectionTitle(props: {
  title: string;
  id: string;
  level?: number;
  className?: string;
}) {
  return (
    <Heading
      id={props.id}
      level={props.level || 2}
      anchorClassName="mb-4 mt-0"
      className={cn(props.className)}
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
      href={props.href}
      target={props.external ? "_blank" : undefined}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-active-border"
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

import { Grid, Heading } from "@/components/Document";
import Image from "next/image";
import Link from "next/link";
import DocsHero from "./_images/docs-hero.svg";

import {
  ContractDeployIcon,
  InfraEngineIcon,
  InfraInsightIcon,
  NebulaIcon,
  WalletsConnectIcon,
} from "@/icons";

export default function Page() {
  return (
    <main className="container grow pb-20">
      <Hero />
      <Grid>
        <FrontendSection />
        <BackendSection />
        <ContractsSection />
      </Grid>
    </main>
  );
}

function Hero() {
  return (
    <section className="grid py-10 lg:grid-cols-2 xl:py-2">
      {/* Left */}
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="mb-5 font-bold text-4xl tracking-tight md:text-5xl">
            thirdweb Documentation
          </h1>
          <p className="mb-8 max-w-md font-medium text-f-300 text-lg leading-relaxed md:text-xl">
            Frontend, backend, and onchain tools to build complete web3 apps —
            on every EVM chain.
          </p>
        </div>
      </div>

      {/* right */}
      <div className="hidden justify-center lg:flex">
        <Image src={DocsHero} alt="" className="w-full" />
      </div>
    </section>
  );
}

function FrontendSection() {
  return (
    <section className="my-6">
      <SectionTitle id="frontend" title="Frontend" />
      <div className="mb-6 border-b" />
      <ArticleCardIndex
        href="/connect"
        title="Connect"
        description="Wallets, auth, and onchain interactions"
        icon={WalletsConnectIcon}
      />
    </section>
  );
}

function ContractsSection() {
  return (
    <section className="my-6">
      <SectionTitle id="onchain" title="Onchain" />
      <div className="mb-6 border-b" />
      <ArticleCardIndex
        title="Contracts"
        description="Solidity contracts and deployment tools"
        href="/contracts"
        icon={ContractDeployIcon}
      />
    </section>
  );
}

function BackendSection() {
  return (
    <section className="my-6">
      <SectionTitle id="backend" title="Backend" />
      <div className="mb-6 border-b" />
      <ArticleCardIndex
        href="/engine"
        title="Engine"
        description="Reliable transactions and monitoring"
        icon={InfraEngineIcon}
      />
      <div className="mb-4" />
      <ArticleCardIndex
        href="/insight"
        title="Insight"
        description="Blockchain data queries and transformations"
        icon={InfraInsightIcon}
      />
      <div className="mb-4" />
      <ArticleCardIndex
        href="/nebula"
        title="Nebula"
        description="API interface for LLMs"
        icon={NebulaIcon}
      />
    </section>
  );
}

function SectionTitle(props: {
  title: string;
  id: string;
  level?: number;
}) {
  return (
    <Heading id={props.id} level={props.level || 2} anchorClassName="mb-4 mt-0">
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
}) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:border-accent-500 hover:bg-accent-900"
    >
      {props.icon && <props.icon className="size-10 shrink-0" />}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-f-100 text-lg">{props.title}</h3>
        <p className="font-medium text-f-300">{props.description}</p>
      </div>
    </Link>
  );
}

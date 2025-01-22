import { Heading } from "@/components/Document";
import Image from "next/image";
import Link from "next/link";
import DocsHeroDark from "./_images/docs-hero-dark.png";
import DocsHeroLight from "./_images/docs-hero-light.png";

export default function Page() {
  return (
    <main className="container max-w-[900px] grow pb-20">
      <Hero />
      <div className="grid grid-cols-1 gap-8">
        <FrontendSection />
        <BackendSection />
        <ContractsSection />
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
            Frontend, Backend, and Onchain tools to build complete web3 apps —
            on every EVM chain.
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

function FrontendSection() {
  return (
    <section>
      <SectionTitle id="frontend" title="Frontend" />
      <ArticleCardIndex
        href="/connect"
        title="Connect"
        description="Wallets, auth, and onchain interactions"
      />
    </section>
  );
}

function ContractsSection() {
  return (
    <section>
      <SectionTitle id="onchain" title="Onchain" />
      <ArticleCardIndex
        title="Contracts"
        description="Solidity contracts and deployment tools"
        href="/contracts"
      />
    </section>
  );
}

function BackendSection() {
  return (
    <section>
      <SectionTitle id="backend" title="Backend" />
      <div className="flex flex-col gap-4">
        <ArticleCardIndex
          href="/engine"
          title="Engine"
          description="Reliable transactions and monitoring"
        />
        <ArticleCardIndex
          href="/insight"
          title="Insight"
          description="Blockchain data queries and transformations"
        />
        <ArticleCardIndex
          href="/nebula"
          title="Nebula"
          description="API interface for LLMs"
        />
      </div>
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
}) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-active-border"
    >
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold text-foreground text-lg">{props.title}</h3>
        <p className="text-muted-foreground">{props.description}</p>
      </div>
    </Link>
  );
}

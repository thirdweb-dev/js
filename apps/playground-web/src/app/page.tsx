import { FeatureCard } from "@/components/blocks/FeatureCard";
import { ThirdwebIcon } from "../icons/ThirdwebMiniLogo";
import {
  accountAbstractionsFeatureCards,
  aiFeatureCards,
  bridgeFeatureCards,
  contractsFeatureCards,
  type FeatureCardMetadata,
  paymentsFeatureCards,
  transactionsFeatureCards,
  walletsFeatureCards,
} from "./data/pages-metadata";

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
        <FeatureSection featureCards={aiFeatureCards} title="AI" />
        <FeatureSection featureCards={walletsFeatureCards} title="Wallets" />
        <FeatureSection
          featureCards={transactionsFeatureCards}
          title="Transactions"
        />
        <FeatureSection
          featureCards={contractsFeatureCards}
          title="Contracts"
        />
        <FeatureSection featureCards={paymentsFeatureCards} title="Payments" />
        <FeatureSection featureCards={bridgeFeatureCards} title="Bridge" />
        <FeatureSection
          featureCards={accountAbstractionsFeatureCards}
          title="Account Abstraction"
        />
      </div>
    </main>
  );
}

function FeatureSection(props: {
  featureCards: FeatureCardMetadata[];
  title: string;
}) {
  return (
    <section>
      <h2 className="font-semibold text-xl text-foreground tracking-tight mb-2">
        {props.title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {props.featureCards.slice(0, 6).map((card) => (
          <FeatureCard
            key={card.title}
            description={card.description}
            href={card.link}
            icon={card.icon}
            title={card.title}
          />
        ))}
      </div>
    </section>
  );
}

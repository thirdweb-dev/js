import type { FeatureCardMetadata } from "@/app/data/pages-metadata";
import { FeatureCard } from "@/components/blocks/FeatureCard";

export function OverviewPage(props: {
  featureCards: FeatureCardMetadata[];
  title: string;
  description: React.ReactNode;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <div className="pb-10">
      <div className="pt-10 pb-8">
        <div className="container max-w-5xl">
          <div className="flex mb-5">
            <div className="rounded-full p-3 border bg-card">
              <props.icon className="size-6 text-muted-foreground" />
            </div>
          </div>
          <h1 className="mb-2 font-bold text-5xl tracking-tight">
            {props.title}
          </h1>
          <p className="text-base text-muted-foreground leading-normal text-pretty max-w-[80%]">
            {props.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 container max-w-5xl pb-20">
        {props.featureCards.map((card) => (
          <FeatureCard
            key={card.title}
            description={card.description}
            href={card.link}
            icon={card.icon}
            title={card.title}
          />
        ))}
      </div>
    </div>
  );
}

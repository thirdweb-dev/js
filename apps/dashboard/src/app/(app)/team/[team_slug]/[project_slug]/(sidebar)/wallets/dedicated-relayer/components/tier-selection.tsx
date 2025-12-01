"use client";

import { CheckIcon, ExternalLinkIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export type RelayerTier = "starter" | "growth" | "enterprise";

type TierConfig = {
  id: RelayerTier;
  name: string;
  description: string;
  price: string;
  priceSubtext?: string;
  features: string[];
  maxChains: number;
  executors: number;
  cta: string;
  highlighted?: boolean;
};

const TIERS: TierConfig[] = [
  {
    id: "starter",
    name: "Single Executor",
    description: "One dedicated executor for your project",
    price: "$99",
    priceSubtext: "/month",
    features: ["1 dedicated executor wallet", "Up to 2 chains"],
    maxChains: 2,
    executors: 1,
    cta: "Subscribe",
  },
  {
    id: "growth",
    name: "Executor Fleet",
    description: "10x the throughput with parallel execution",
    price: "$299",
    priceSubtext: "/month",
    features: ["10 dedicated executor wallets", "Up to 4 chains"],
    maxChains: 4,
    executors: 10,
    cta: "Subscribe",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Executor Army",
    description: "Custom executor count for maximum throughput",
    price: "Custom",
    features: ["Custom executor count", "Unlimited chains"],
    maxChains: -1,
    executors: -1,
    cta: "Contact Sales",
  },
];

type TierSelectionProps = {
  onSelectTier: (tier: RelayerTier) => void;
  isLoading?: boolean;
  selectedTier?: RelayerTier | null;
};

export function TierSelection(props: TierSelectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isLoading={props.isLoading && props.selectedTier === tier.id}
            isDisabled={props.isLoading && props.selectedTier !== tier.id}
            onSelect={() => props.onSelectTier(tier.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TierCard(props: {
  tier: TierConfig;
  onSelect: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}) {
  const { tier } = props;
  const isEnterprise = tier.id === "enterprise";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border bg-card p-6",
        tier.highlighted && "border-primary ring-1 ring-primary",
      )}
    >
      {tier.highlighted && (
        <div className="-top-3 absolute left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground text-xs">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-lg">{tier.name}</h3>
        <p className="mt-1 text-muted-foreground text-sm">{tier.description}</p>
      </div>

      <div className="mb-6">
        <span className="font-bold text-3xl">{tier.price}</span>
        {tier.priceSubtext && (
          <span className="text-muted-foreground">{tier.priceSubtext}</span>
        )}
      </div>

      <ul className="mb-6 flex flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isEnterprise ? (
        <Button asChild variant="outline" className="w-full">
          <Link
            href="https://thirdweb.com/contact-us"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UsersIcon className="mr-2 size-4" />
            {tier.cta}
            <ExternalLinkIcon className="ml-2 size-4" />
          </Link>
        </Button>
      ) : (
        <Button
          onClick={props.onSelect}
          disabled={props.isLoading || props.isDisabled}
          variant={tier.highlighted ? "default" : "outline"}
          className="w-full"
        >
          {props.isLoading ? (
            <>
              <Spinner className="mr-2 size-4" />
              Setting up...
            </>
          ) : (
            tier.cta
          )}
        </Button>
      )}
    </div>
  );
}

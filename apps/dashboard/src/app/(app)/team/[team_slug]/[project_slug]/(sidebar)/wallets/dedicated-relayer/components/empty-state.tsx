"use client";

import { ExternalLinkIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type RelayerTier, TierSelection } from "./tier-selection";

type DedicatedRelayerEmptyStateProps = {
  teamSlug: string;
  projectSlug: string;
  onPurchaseTier: (tier: RelayerTier) => Promise<void>;
};

/**
 * Empty state shown when user hasn't purchased a dedicated relayer fleet.
 * Shows tier selection for purchasing.
 */
export function DedicatedRelayerEmptyState(
  props: DedicatedRelayerEmptyStateProps,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<RelayerTier | null>(null);

  const handleSelectTier = async (tier: RelayerTier) => {
    setSelectedTier(tier);
    setIsLoading(true);
    try {
      await props.onPurchaseTier(tier);
    } finally {
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
          <div className="flex items-center justify-center rounded-full bg-primary/10 p-4">
            <ZapIcon className="size-8 text-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl tracking-tight">
              Dedicated Relayer Fleet
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              Your own dedicated executor wallets that automatically relay
              transactions on your chosen chains. No manual gas management, no
              shared infrastructure.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Priority Processing"
              description="Your transactions never compete with others. Dedicated executors mean guaranteed throughput at scale."
            />
            <FeatureCard
              title="Zero Config Relaying"
              description="Select your chains and we handle the rest. Transactions are automatically relayed with optimal gas."
            />
            <FeatureCard
              title="Full Visibility"
              description="Monitor every transaction from your executor fleet. See gas usage, success rates, and balances in real-time."
            />
          </div>

          <Button asChild size="lg" variant="outline">
            <Link
              href="https://portal.thirdweb.com/transactions/relayer"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn More
              <ExternalLinkIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tier Selection */}
      <div className="rounded-lg border bg-card p-6">
        <TierSelection
          onSelectTier={handleSelectTier}
          isLoading={isLoading}
          selectedTier={selectedTier}
        />
      </div>
    </div>
  );
}

function FeatureCard(props: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-background p-4 text-left">
      <h3 className="font-medium">{props.title}</h3>
      <p className="mt-1 text-muted-foreground text-sm">{props.description}</p>
    </div>
  );
}

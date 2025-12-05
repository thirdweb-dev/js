"use client";

import { Img } from "@workspace/ui/components/img";
import { useTheme } from "next-themes";
import { useState } from "react";
import type { DedicatedRelayerSKU } from "@/types/billing";
import { PlanSection } from "./tier-selection";

type DedicatedRelayerEmptyStateProps = {
  teamSlug: string;
  projectSlug: string;
  onPurchaseTier: (
    tier: DedicatedRelayerSKU,
    chainIds: number[],
  ) => Promise<void>;
};

/**
 * Empty state shown when user hasn't purchased a dedicated relayer fleet.
 * Shows tier selection for purchasing.
 */
export function DedicatedRelayerEmptyState(
  props: DedicatedRelayerEmptyStateProps,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<DedicatedRelayerSKU | null>(
    null,
  );

  const handleSelectTier = async (tier: DedicatedRelayerSKU) => {
    setSelectedTier(tier);
    setIsLoading(true);
    try {
      // TODO-FLEET: pass the actual chain ids up
      await props.onPurchaseTier(tier, [84532, 421614]);
    } finally {
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-2">
      <FeatureSection />
      <PlanSection
        onSelectTier={handleSelectTier}
        isLoading={isLoading}
        selectedTier={selectedTier}
      />
    </div>
  );
}

function FeatureSection() {
  return (
    <div className="grid lg:grid-cols-3 border rounded-xl bg-card">
      <FeatureCard
        title="Prioritized Queueing"
        description="Dedicated infrastructure to avoid competing with other user wallets"
        images={{
          darkSrc: "/assets/dedicated-relayer/server-wallet-dark.png",
          lightSrc: "/assets/dedicated-relayer/server-wallet-light.png",
        }}
      />

      <FeatureCard
        title="Zero Configuration"
        className="border-t lg:border-t-0 lg:border-l border-dashed"
        description="Gas fees are paid automatically without need to top up funds"
        images={{
          darkSrc: "/assets/dedicated-relayer/no-config-dark.png",
          lightSrc: "/assets/dedicated-relayer/no-config-light.png",
        }}
      />

      <FeatureCard
        title="Monitoring"
        className="border-t lg:border-t-0 lg:border-l border-dashed"
        description="Full visibility on gas usage, success rates, and balances in real-time"
        images={{
          darkSrc: "/assets/dedicated-relayer/monitoring-dark.png",
          lightSrc: "/assets/dedicated-relayer/monitoring-light.png",
        }}
      />
    </div>
  );
}

function FeatureCard(props: {
  title: string;
  description: string;
  className?: string;
  images: {
    darkSrc: string;
    lightSrc: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  const imageSrc =
    resolvedTheme === "light" ? props.images.lightSrc : props.images.darkSrc;

  return (
    <div className={props.className}>
      <Img src={imageSrc} alt="" className="object-cover" key={imageSrc} />
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-1 tracking-tight">
          {props.title}
        </h3>
        <p className="text-muted-foreground text-sm text-pretty">
          {props.description}
        </p>
      </div>
    </div>
  );
}

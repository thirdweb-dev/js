"use client";

import { Img } from "@workspace/ui/components/img";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DedicatedRelayerSKU } from "@/types/billing";
import { RELAYER_SUPPORTED_CHAINS } from "../constants";
import { PlanSection } from "./tier-selection";

type DedicatedRelayerEmptyStateProps = {
  teamSlug: string;
  projectSlug: string;
  onPurchaseTier: (
    tier: DedicatedRelayerSKU,
    chainIds: number[],
  ) => Promise<void>;
  client: ThirdwebClient;
  className?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([]);

  const handleSelectTier = async (tier: DedicatedRelayerSKU) => {
    if (tier === "product:dedicated_relayer_enterprise") {
      window.open("https://thirdweb.com/contact-us", "_blank");
      return;
    }

    setSelectedTier(tier);
    setSelectedChainIds([]);
    setIsModalOpen(true);
  };

  const handlePurchase = async () => {
    if (!selectedTier) return;
    setIsLoading(true);
    try {
      await props.onPurchaseTier(selectedTier, selectedChainIds);
      setIsModalOpen(false);
      setSelectedTier(null);
      setSelectedChainIds([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to purchase dedicated relayer");
    } finally {
      setIsLoading(false);
    }
  };

  const requiredChains =
    selectedTier === "product:dedicated_relayer_standard" ? 2 : 4;

  return (
    <div className={cn("flex flex-col gap-8 pt-2", props.className)}>
      <FeatureSection />
      <PlanSection
        onSelectTier={handleSelectTier}
        isLoading={isLoading}
        selectedTier={selectedTier}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Chains</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Select {requiredChains} chains for your dedicated relayer.
            </p>
            <MultiNetworkSelector
              selectedChainIds={selectedChainIds}
              onChange={setSelectedChainIds}
              client={props.client}
              chainIds={RELAYER_SUPPORTED_CHAINS}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handlePurchase}
              disabled={selectedChainIds.length !== requiredChains || isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeatureSection() {
  return (
    <div className="grid lg:grid-cols-3 border rounded-xl bg-card">
      <FeatureCard
        title="Prioritized Queueing"
        description="Dedicated infrastructure to avoid sharing resources and competing with other wallets"
        images={{
          darkSrc: "/assets/dedicated-relayer/server-wallet-dark.png",
          lightSrc: "/assets/dedicated-relayer/server-wallet-light.png",
        }}
      />

      <FeatureCard
        title="Zero Configuration"
        className="border-t lg:border-t-0 lg:border-l border-dashed"
        description="No code changes required, gas fees continue to be sponsored without need to top up funds"
        images={{
          darkSrc: "/assets/dedicated-relayer/no-config-dark.png",
          lightSrc: "/assets/dedicated-relayer/no-config-light.png",
        }}
      />

      <FeatureCard
        title="Monitoring"
        className="border-t lg:border-t-0 lg:border-l border-dashed"
        description="All your transactions are initiated from the same onchain relayer address, making monitoring and dashboard building easy"
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

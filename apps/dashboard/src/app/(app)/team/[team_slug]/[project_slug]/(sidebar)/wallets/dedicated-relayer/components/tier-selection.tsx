"use client";

import {
  ArrowUpRightIcon,
  BoxesIcon,
  FolderCogIcon,
  FolderIcon,
  FoldersIcon,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { cn } from "@/lib/utils";
import type { DedicatedRelayerSKU } from "@/types/billing";

type TierConfig = {
  id: DedicatedRelayerSKU;
  icon: React.FC<{ className?: string }>;
  name: string;
  description: string;
  price: string;
  isPerMonth?: boolean;
  features: Array<{ icon: React.FC<{ className?: string }>; label: string }>;
  cta: string;
  isRecommended?: boolean;
};

const TIERS: TierConfig[] = [
  {
    id: "product:dedicated_relayer_standard",
    icon: FolderIcon,
    name: "Standard",
    description:
      "Most suitable for startups and applications with moderate transaction volume",
    price: "$99",
    isPerMonth: true,
    features: [
      { icon: WalletProductIcon, label: "Single executor wallet" },
      { icon: BoxesIcon, label: "Support for 1 chain" },
    ],
    cta: "Select",
  },
  {
    id: "product:dedicated_relayer_premium",
    icon: FoldersIcon,
    name: "Premium",
    description:
      "Best for enterprise companies and applications with high transaction volume",
    price: "$299",
    isPerMonth: true,
    features: [
      {
        icon: WalletProductIcon,
        label: "10 executor wallets (10x throughput)",
      },
      { icon: BoxesIcon, label: "Support for up to 2 chains" },
    ],
    cta: "Select",
    isRecommended: true,
  },
  {
    id: "product:dedicated_relayer_enterprise",
    icon: FolderCogIcon,
    name: "Custom",
    description:
      "Contact us for applications operating at a global scale with custom requirements",
    price: "Custom",
    features: [
      { icon: WalletProductIcon, label: "Unlimited executor wallets" },
      { icon: BoxesIcon, label: "Unlimited chains" },
    ],
    cta: "Contact Sales",
  },
];

export function PlanSection(props: {
  onSelectTier: (tier: DedicatedRelayerSKU) => void;
  isLoading?: boolean;
  selectedTier?: DedicatedRelayerSKU | null;
  className?: string;
}) {
  return (
    <div className={cn("border rounded-xl bg-card", props.className)}>
      <div className="p-6 border-b border-dashed">
        <h2 className="font-semibold text-xl tracking-tight">Select a plan</h2>
      </div>
      <div className="grid lg:grid-cols-3">
        {TIERS.map((tier, index) => (
          <PlanCard
            key={tier.id}
            tier={tier}
            isLoading={props.isLoading && props.selectedTier === tier.id}
            isDisabled={props.isLoading && props.selectedTier !== tier.id}
            onSelect={() => props.onSelectTier(tier.id)}
            className={
              index !== 0
                ? "border-t lg:border-t-0 lg:border-l border-dashed"
                : ""
            }
            isRecommended={tier.isRecommended}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard(props: {
  tier: TierConfig;
  onSelect: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  isRecommended?: boolean;
}) {
  const { tier } = props;
  const isEnterprise = tier.id === "product:dedicated_relayer_enterprise";

  return (
    <div className={cn("relative flex flex-col px-6 py-8", props.className)}>
      <div className="mb-5">
        <div className="p-2.5 mb-5 inline-flex rounded-full border bg-background">
          <tier.icon className="size-5 text-muted-foreground" />
        </div>
        <div className="h-10">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-2xl tracking-tight">
              {tier.name}
            </h3>
            {props.isRecommended && (
              <span className="text-xs border border-blue-500 bg-blue-500/10 text-blue-800 dark:border-blue-600 dark:text-blue-200 dark:bg-blue-600/10 rounded-full px-2.5 py-1 font-medium">
                Recommended
              </span>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm text-pretty max-w-[320px]">
          {tier.description}
        </p>
      </div>

      <div className="mb-5 flex items-end gap-1">
        <span className="font-semibold text-3xl tracking-tight text-foreground">
          {tier.price}
        </span>
        {tier.isPerMonth && (
          <span className="text-muted-foreground font-medium"> / month</span>
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-3">Includes:</p>

      <ul className="mb-8 flex flex-1 flex-col gap-2">
        {tier.features.map((feature) => (
          <li
            key={feature.label}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <feature.icon className="size-4 shrink-0 mt-0.5" />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      {isEnterprise ? (
        <Button
          asChild
          variant="outline"
          className="w-full rounded-full py-3 h-auto text-base bg-background gap-2"
        >
          <Link
            href="https://thirdweb.com/contact-us"
            target="_blank"
            rel="noopener noreferrer"
          >
            {tier.cta}
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button
          onClick={props.onSelect}
          disabled={props.isLoading || props.isDisabled}
          variant="outline"
          className="w-full gap-2 rounded-full py-3 h-auto text-base bg-background"
        >
          {props.isLoading && <Spinner className="size-4" />}
          {tier.cta}
          <ArrowUpRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}

"use client";

import { redirectToCheckout } from "@/actions/billing";
import { CheckoutButton } from "@/components/billing";
import { Button } from "@/components/ui/button";
import type { EngineTier } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Spacer } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface EngineTierCardConfig {
  name: string;
  monthlyPriceUsd: number | "custom";
  features: string[];
}

const ENGINE_TIER_CARD_CONFIG: Record<EngineTier, EngineTierCardConfig> = {
  STARTER: {
    name: "Standard",
    monthlyPriceUsd: 99,
    features: [
      "Isolated server & database",
      "APIs for contracts on 1700+ EVM chains",
      "Secured backend wallets",
      "Gas & nonce management",
    ],
  },
  PREMIUM: {
    name: "Premium",
    monthlyPriceUsd: 299,
    features: [
      "Autoscaling",
      "Production-grade server (high availability and redundancy)",
      "Production-grade database (high availability, Multi-AZ)",
      "30-day database backups",
      "On-call monitoring from thirdweb",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    monthlyPriceUsd: "custom",
    features: ["Custom features", "Custom deployment", "Priority support"],
  },
};

export const EngineTierCard = ({
  tier,
  previousTier,
  isPrimaryCta = false,
  ctaText,
}: {
  tier: EngineTier;
  previousTier?: string;
  isPrimaryCta?: boolean;
  ctaText?: string;
}) => {
  const trackEvent = useTrack();
  const params = useParams<{ team_slug: string }>();
  const { name, monthlyPriceUsd } = ENGINE_TIER_CARD_CONFIG[tier];
  let features = ENGINE_TIER_CARD_CONFIG[tier].features;
  if (tier === "PREMIUM") {
    features = [...ENGINE_TIER_CARD_CONFIG.STARTER.features, ...features];
  }

  const defaultCtaText =
    monthlyPriceUsd === "custom" ? "Contact us" : "Deploy now";

  return (
    <div
      className="flex flex-col gap-6 rounded-xl border border-border bg-muted/50 p-6"
      style={{
        backgroundImage: isPrimaryCta
          ? "linear-gradient(to top, hsl(var(--muted)) 40%, transparent)"
          : undefined,
      }}
    >
      <Flex flexDir="column" gap={4}>
        {/* Name */}
        <h3 className="font-semibold text-2xl tracking-tight">{name}</h3>

        {/* Price */}
        {monthlyPriceUsd === "custom" ? (
          <p className="font-semibold text-lg text-muted-foreground">
            Custom Pricing
          </p>
        ) : (
          <Flex gap={2} alignItems="baseline">
            <p className="font-semibold text-3xl text-foreground tracking-tight">
              ${monthlyPriceUsd}
            </p>
            <p className="text-muted-foreground">per month</p>
          </Flex>
        )}
      </Flex>

      {/* Features */}
      <div className="flex flex-col gap-3">
        {previousTier && (
          <p>
            <span className="font-semibold"> All of {previousTier}</span>, plus:
          </p>
        )}
        {features.map((feature) => (
          <Flex key={feature} gap={3} align="center">
            <CheckIcon className="size-4 shrink-0 text-green-500" />
            <p className="text-muted-foreground text-sm">{feature}</p>
          </Flex>
        ))}
      </div>

      <Spacer />

      {/* CTA */}
      {tier === "ENTERPRISE" ? (
        <Button
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "click",
              label: "clicked-cloud-hosted",
              tier,
            });
          }}
          variant={isPrimaryCta ? "default" : "outline"}
          asChild
        >
          <Link href="/contact-us">{ctaText ?? defaultCtaText}</Link>
        </Button>
      ) : (
        <CheckoutButton
          sku={
            tier === "STARTER"
              ? "product:engine_standard"
              : "product:engine_premium"
          }
          redirectPath={`/team/${params?.team_slug}/~/engine`}
          teamSlug={params?.team_slug || "~"}
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "click",
              label: "clicked-cloud-hosted",
              tier,
            });
          }}
          variant={isPrimaryCta ? "default" : "outline"}
          redirectToCheckout={redirectToCheckout}
        >
          {ctaText ?? defaultCtaText}
        </CheckoutButton>
      )}
    </div>
  );
};

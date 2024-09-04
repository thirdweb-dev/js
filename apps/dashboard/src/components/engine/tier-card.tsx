import { Button } from "@/components/ui/button";
import type { EngineTier } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Spacer, Stack } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";

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

export const MONTHLY_PRICE_USD: Record<EngineTier, number> = {
  STARTER: 99,
  PREMIUM: 299,
  ENTERPRISE: 0,
};

export const EngineTierCard = ({
  tier,
  previousTier,
  isPrimaryCta = false,
  onClick,
  ctaText,
}: {
  tier: EngineTier;
  previousTier?: string;
  isPrimaryCta?: boolean;
  onClick: () => void;
  ctaText?: string;
}) => {
  const { name, monthlyPriceUsd } = ENGINE_TIER_CARD_CONFIG[tier];
  let features = ENGINE_TIER_CARD_CONFIG[tier].features;
  if (tier === "PREMIUM") {
    features = [...ENGINE_TIER_CARD_CONFIG.STARTER.features, ...features];
  }

  const defaultCtaText =
    monthlyPriceUsd === "custom" ? "Contact us" : "Deploy now";

  const card = (
    <div
      className="border border-border rounded-xl flex flex-col gap-6 p-6 bg-muted/20"
      style={{
        background: isPrimaryCta
          ? "linear-gradient(to top, hsl(var(--muted)), hsl(var(--muted)/50%))"
          : undefined,
      }}
    >
      <Flex flexDir="column" gap={4}>
        {/* Name */}
        <h3 className="text-3xl font-semibold tracking-tight">{name}</h3>

        {/* Price */}
        {monthlyPriceUsd === "custom" ? (
          <p className="text-lg font-semibold text-muted-foreground">
            Custom Pricing
          </p>
        ) : (
          <Flex gap={2} alignItems="baseline">
            <p className="text-foreground text-3xl font-semibold tracking-tight">
              ${monthlyPriceUsd}
            </p>
            <p className="text-muted-foreground">per month</p>
          </Flex>
        )}
      </Flex>

      {/* Features */}
      <Stack spacing={3}>
        {previousTier && (
          <p>
            <span className="font-semibold"> All of {previousTier}</span>, plus:
          </p>
        )}
        {features.map((feature) => (
          <Flex key={feature} gap={3} align="center">
            <CheckIcon className="size-4 text-green-500 shrink-0" />
            <p className="text-sm text-muted-foreground">{feature}</p>
          </Flex>
        ))}
      </Stack>

      <Spacer />

      {/* CTA */}
      <Button onClick={onClick} variant={isPrimaryCta ? "default" : "outline"}>
        {ctaText ?? defaultCtaText}
      </Button>
    </div>
  );

  return card;
};

import type { EngineTier } from "@3rdweb-sdk/react/hooks/useEngine";
import { DarkMode, Flex, Icon, Spacer, Stack } from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";
import { Badge, Button, Card, Heading, Text } from "tw-components";

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
    <Card
      as={Stack}
      gap={6}
      background={
        isPrimaryCta
          ? `linear-gradient(-5deg, #CE7161FF, #CE716120 80%),
          linear-gradient(110deg, #40358EFF, #40358E20 70%),
          linear-gradient(240deg, #180217FF, #18021720 100%);`
          : undefined
      }
      p={6}
    >
      <Flex flexDir="column" gap={4}>
        {/* Name */}
        <Heading as="h3" size="title.md">
          {name}
        </Heading>

        {/* Price */}
        {monthlyPriceUsd === "custom" ? (
          <Badge w="fit-content" my={4}>
            Custom Pricing
          </Badge>
        ) : (
          <Flex gap={2} alignItems="baseline">
            <Text color="accent.900" fontSize="xx-large">
              ${monthlyPriceUsd}
            </Text>
            <Text color="accent.900">per month</Text>
          </Flex>
        )}
      </Flex>

      {/* Features */}
      <Stack spacing={3}>
        <Text>Includes</Text>
        {previousTier && (
          <Text color="accent.900" fontWeight="bold">
            All of <u>{previousTier}</u>, plus:
          </Text>
        )}
        {features.map((feature) => (
          <Flex key={feature} gap={3} align="center">
            <Icon as={FiCheck} boxSize={4} color="green.500" />
            <Text color="accent.900" fontWeight="medium">
              {feature}
            </Text>
          </Flex>
        ))}
      </Stack>

      <Spacer />

      {/* CTA */}
      <Button
        onClick={onClick}
        variant={isPrimaryCta ? "solid" : "outline"}
        colorScheme={isPrimaryCta ? "blackAlpha" : undefined}
        bg={isPrimaryCta ? "black" : undefined}
        _hover={
          isPrimaryCta
            ? {
                bg: "black",
                opacity: 0.75,
              }
            : {}
        }
      >
        {ctaText ?? defaultCtaText}
      </Button>
    </Card>
  );

  return isPrimaryCta ? <DarkMode>{card}</DarkMode> : card;
};

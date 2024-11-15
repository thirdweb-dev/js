import { Box, Container, Flex } from "@chakra-ui/react";
import { Heading, Text, TrackedLink } from "tw-components";
import { CONTACT_US_URL } from "utils/pricing";
import { PricingCard } from "./PricingCard";

interface PricingSectionProps {
  trackingCategory: string;
  onHomepage?: boolean;
  canTrialGrowth?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  trackingCategory,
  onHomepage,
  canTrialGrowth,
}) => {
  return (
    <Container maxW="6xl">
      <Flex flexDir="column" pt={{ base: 8, lg: 24 }} gap={{ base: 8, md: 16 }}>
        <Flex flexDir="column" gap={6}>
          <Heading
            as={onHomepage ? "h2" : "h1"}
            size={onHomepage ? "display.sm" : "display.md"}
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            Simple, transparent & flexible{" "}
            <Box bgGradient="linear(to-r, #4DABEE, #692AC1)" bgClip="text">
              pricing for every team.
            </Box>
          </Heading>
          {onHomepage && (
            <Text textAlign="center" size="body.lg">
              Learn more about{" "}
              <TrackedLink
                category={trackingCategory}
                href="/pricing"
                label="pricing-plans"
                color="blue.500"
              >
                pricing plans
              </TrackedLink>
              .
            </Text>
          )}
        </Flex>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <PricingCard
            billingPlan="starter"
            cta={{
              title: "Get started for free",
              href: "/team/~/~/settings/billing",
              target: "_blank",
              tracking: {
                category: trackingCategory,
                label: "getStartedFree",
              },
            }}
          />

          <PricingCard
            highlighted
            billingPlan="growth"
            cta={{
              title: canTrialGrowth ? "Claim your 1-month free" : "Get started",
              hint: canTrialGrowth
                ? "Your free trial will end after 30 days."
                : undefined,
              href: "/team/~/~/settings/billing",
              target: "_blank",
              tracking: {
                category: trackingCategory,
                label: canTrialGrowth ? "claimGrowthTrial" : undefined,
              },
              variant: "default",
            }}
          />

          <PricingCard
            billingPlan="pro"
            cta={{
              href: CONTACT_US_URL,
              title: "Contact us",
              target: "_blank",
              tracking: {
                category: trackingCategory,
                label: "contactUs",
              },
            }}
          />
        </div>
      </Flex>
    </Container>
  );
};

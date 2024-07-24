import { AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
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

        <SimpleGrid columns={{ base: 1, xl: 3 }} gap={{ base: 6, xl: 8 }}>
          <PricingCard
            name={AccountPlan.Free}
            ctaTitle="Get started for free"
            ctaProps={{
              category: trackingCategory,
              href: "/dashboard/settings/billing",
            }}
          />

          <PricingCard
            highlighted
            ctaTitle={
              canTrialGrowth ? "Claim your 1-month free" : "Get started"
            }
            name={AccountPlan.Growth}
            ctaHint={
              canTrialGrowth
                ? "Your free trial will end after 30 days."
                : undefined
            }
            canTrialGrowth={canTrialGrowth}
            ctaProps={{
              category: trackingCategory,
              label: canTrialGrowth ? "claimGrowthTrial" : undefined,
              href: "/dashboard/settings/billing",
              bgColor: "white",
              color: "black",
              _hover: {
                bgColor: "white",
                opacity: 0.8,
              },
            }}
          />

          <PricingCard
            name={AccountPlan.Pro}
            ctaTitle="Contact us"
            ctaProps={{
              category: trackingCategory,
              href: CONTACT_US_URL,
              isExternal: true,
            }}
          />
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

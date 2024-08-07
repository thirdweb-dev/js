import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";

import { EngineTierCard } from "components/engine/tier-card";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { Heading } from "tw-components";

interface PricingSectionProps {
  trackingCategory: string;
}

export const PricingEngineHomepage: React.FC<PricingSectionProps> = ({
  trackingCategory,
}) => {
  const track = useTrack();
  const router = useRouter();
  return (
    <Container maxW="6xl">
      <Flex flexDir="column" pt={{ base: 8, lg: 24 }} gap={{ base: 8, md: 16 }}>
        <Flex flexDir="column" gap={6}>
          <Heading
            as="h2"
            size="display.sm"
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            Simple, transparent & flexible{" "}
            <Box bgGradient="linear(to-r, #4DABEE, #692AC1)" bgClip="text">
              pricing for every team.
            </Box>
          </Heading>
        </Flex>
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          <EngineTierCard
            tier="STARTER"
            ctaText="Get Started"
            onClick={() => {
              track({
                category: trackingCategory,
                action: "click",
                label: "clicked-cloud-hosted",
                tier: "STANDARD",
              });
              router.push("/dashboard/engine");
            }}
          />

          <EngineTierCard
            tier="PREMIUM"
            isPrimaryCta
            ctaText="Get Started"
            onClick={() => {
              track({
                category: trackingCategory,
                action: "click",
                label: "clicked-cloud-hosted",
                tier: "PREMIUM",
              });
              router.push("/dashboard/engine");
            }}
          />

          <EngineTierCard
            tier="ENTERPRISE"
            previousTier="Premium Engine"
            onClick={() => {
              track({
                category: trackingCategory,
                action: "click",
                label: "clicked-cloud-hosted",
                tier: "ENTERPRISE",
              });
              router.push("/contact-us");
            }}
          />
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

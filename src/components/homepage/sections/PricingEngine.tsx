import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";

import { EngineTierCard } from "../../engine/create-engine-instance";
import { useTrack } from "../../../hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { Heading } from "../../../tw-components";

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
            iconSrc={require("../../../../public/assets/engine/cloud-icon1.png")}
            tier="Standard Engine"
            monthlyPrice={99}
            features={[
              "Isolated server & database",
              "APIs for contracts on all EVM chains",
              "Secure backend wallets",
              "Automated gas & nonce management",
              "On-call monitoring from thirdweb",
            ]}
            ctaText="Get Started"
            // empty to override the default cta hint
            ctaHint=" "
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
            iconSrc={require("../../../../public/assets/engine/cloud-icon2.png")}
            tier="Premium Engine"
            previousTier="Standard Engine"
            monthlyPrice={299}
            features={[
              "Autoscaling",
              "Server failover",
              "Database failover",
              "30-day database backups",
            ]}
            isPrimaryCta
            ctaText="Get Started"
            // empty to override the default cta hint
            ctaHint=" "
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
            iconSrc={require("../../../../public/assets/engine/cloud-icon3.png")}
            tier="Enterprise Engine"
            previousTier="Premium Engine"
            features={[
              "Custom features",
              "Custom deployment",
              "Priority support",
            ]}
            // empty to override the default cta hint
            ctaHint=" "
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

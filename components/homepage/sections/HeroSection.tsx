import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Aurora } from "../Aurora";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { Heading, Text, TrackedLink } from "tw-components";
import { LandingCTAButtons } from "components/landing-pages/cta-buttons";
import { ChakraNextImage } from "components/Image";
import styles from "../category/categories.module.css";

interface HeroSectionProps {
  TRACKING_CATEGORY: string;
}
export const HeroSection = ({ TRACKING_CATEGORY }: HeroSectionProps) => {
  return (
    <HomepageSection id="home">
      {/* top */}
      <Aurora
        pos={{ left: "50%", top: "0%" }}
        size={{ width: "2400px", height: "1400px" }}
        color="hsl(260deg 78% 35% / 40%)"
      />

      <SimpleGrid
        columns={{ base: 1, xl: 2 }}
        gap={{ base: 12, xl: 8 }}
        mt={{ base: 4, xl: 20 }}
        placeItems="center"
      >
        <Flex flexDir="column" gap={{ base: 6, md: 8 }}>
          <Flex flexDir="column" gap={4}>
            <Heading as="h1" size="display.sm" px={{ base: 2, md: 0 }} mr={6}>
              Full-Stack Web3 Development Platform
            </Heading>
          </Flex>
          <Text size="body.xl" mr={6}>
            Onboard users with wallets, build & deploy smart contracts, accept
            fiat & crypto payments, and scale your app with infrastructure — on
            any EVM chain.
          </Text>
          <LandingCTAButtons
            ctaText="Get started"
            ctaLink="/dashboard"
            noContactUs
            trackingCategory={TRACKING_CATEGORY}
            alignLeft
          />
        </Flex>
        <Flex
          maxW={{ base: "280px", sm: "400px", md: "500px" }}
          position="relative"
          className={styles.heroContainer}
        >
          <TrackedLink
            href="/connect"
            category={TRACKING_CATEGORY}
            label="connect-icon"
          >
            <ChakraNextImage
              src={require("public/assets/landingpage/desktop/icon-frontend.png")}
              alt="icon-frontend"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              zIndex={2}
              cursor="pointer"
              className={styles.connect}
            />
          </TrackedLink>

          <TrackedLink
            href="/engine"
            category={TRACKING_CATEGORY}
            label="backend-icon"
          >
            <ChakraNextImage
              src={require("public/assets/landingpage/desktop/icon-backend.png")}
              alt="icon-backend"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              position="absolute"
              zIndex={2}
              cursor="pointer"
              className={styles.backend}
            />
          </TrackedLink>

          <TrackedLink
            href="/explore"
            category={TRACKING_CATEGORY}
            label="onchain-icon"
          >
            <ChakraNextImage
              src={require("public/assets/landingpage/desktop/icon-onchain.png")}
              alt="icon-onchain"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              position="absolute"
              zIndex={2}
              cursor="pointer"
              className={styles.onchain}
            />
          </TrackedLink>

          <ChakraNextImage
            src={require("public/assets/landingpage/desktop/hero-homepage.png")}
            alt="hero-image"
            className={styles.heroImageV1}
          />

          <ChakraNextImage
            src={require("public/assets/landingpage/desktop/hero-homepage-v2.png")}
            alt="hero-image"
            className={styles.heroImageV2}
          />
        </Flex>
      </SimpleGrid>
    </HomepageSection>
  );
};

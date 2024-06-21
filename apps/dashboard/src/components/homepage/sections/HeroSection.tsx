import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { Heading, Text, TrackedLink, TrackedLinkButton } from "tw-components";
import { Aurora } from "../Aurora";
import styles from "../category/categories.module.css";
import { OpenSource } from "../open-source/OpenSource";

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
        columns={{ base: 1, md: 2 }}
        gap={{ base: 12, md: 8 }}
        mt={{ base: 4, md: 20 }}
        placeItems="center"
      >
        <Flex flexDir="column" gap={{ base: 6, md: 8 }}>
          <Flex flexDir="column" gap={4}>
            <Heading
              as="h1"
              size="title.2xl"
              fontWeight={800}
              px={{ base: 2, md: 0 }}
              fontSize={{ base: "36px", sm: "45px" }}
            >
              Full-stack, <OpenSource TRACKING_CATEGORY={TRACKING_CATEGORY} />{" "}
              web3 development platform
            </Heading>
          </Flex>
          <Text size="body.xl" mr={6}>
            Frontend, backend, and onchain tools to build complete web3 apps —
            on every EVM chain.
          </Text>

          <Flex
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: 4, md: 6 }}
          >
            <TrackedLinkButton
              leftIcon={<Icon as={BsFillLightningChargeFill} boxSize={4} />}
              py={6}
              px={8}
              w="full"
              bgColor="white"
              _hover={{
                bgColor: "white",
                opacity: 0.8,
              }}
              color="black"
              href="/dashboard"
              category={TRACKING_CATEGORY}
              label="get-started"
              fontWeight="bold"
              maxW={{ base: "full", sm: "fit-content" }}
            >
              Get started
            </TrackedLinkButton>

            <TrackedLinkButton
              variant="outline"
              w="full"
              py={6}
              px={8}
              href="https://portal.thirdweb.com"
              category={TRACKING_CATEGORY}
              label="see-docs"
              maxW={{ base: "full", sm: "fit-content" }}
              isExternal
            >
              See the docs
            </TrackedLinkButton>
          </Flex>
        </Flex>
        <Flex
          minW={{ base: "auto", md: "420px" }}
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
              src={require("../../../../public/assets/landingpage/desktop/icon-frontend.png")}
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
              src={require("../../../../public/assets/landingpage/desktop/icon-backend.png")}
              alt="icon-backend"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              position="absolute"
              zIndex={2}
              cursor="pointer"
              className={styles.backend}
            />
          </TrackedLink>

          <TrackedLink
            href="/contracts"
            category={TRACKING_CATEGORY}
            label="onchain-icon"
          >
            <ChakraNextImage
              src={require("../../../../public/assets/landingpage/desktop/icon-onchain.png")}
              alt="icon-onchain"
              maxW={{ base: "45px", sm: "60px", md: "75px" }}
              position="absolute"
              zIndex={2}
              cursor="pointer"
              className={styles.onchain}
            />
          </TrackedLink>

          <ChakraNextImage
            src={require("../../../../public/assets/landingpage/desktop/hero-homepage.png")}
            alt="hero-image"
            className={styles.heroImageV1}
          />

          <ChakraNextImage
            src={require("../../../../public/assets/landingpage/desktop/hero-homepage-v2.png")}
            alt="hero-image"
            className={styles.heroImageV2}
          />
        </Flex>
      </SimpleGrid>
    </HomepageSection>
  );
};

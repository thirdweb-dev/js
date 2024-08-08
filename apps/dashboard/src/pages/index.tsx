import { useForceDarkTheme } from "@/components/theme-provider";
import { Box, Center, Flex } from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { GetStartedSection } from "components/homepage/sections/GetStartedSection";
import { HeroSection } from "components/homepage/sections/HeroSection";
import HomePageCard from "components/homepage/sections/HomePageCard";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { PricingSection } from "components/homepage/sections/PricingSection";
import { SDKSection } from "components/homepage/sections/SDKSection";
import { SolutionsSection } from "components/homepage/sections/Solutions";
import { WithoutThirdwebSection } from "components/homepage/sections/WithoutThirdwebSection";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
import { PartnerCarousel } from "components/partners/carousel";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { metrics } from "components/product-pages/common/nav/data";
import { PageId } from "page-id";
import { Suspense } from "react";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { AnyEVMSection } from "../components/homepage/sections/AnyEVM";

const TRACKING_CATEGORY = "homepage";

const HomePage: ThirdwebNextPage = () => {
  useForceDarkTheme();
  return (
    <Flex
      sx={{
        // overwrite the theme colors because the home page is *always* in "dark mode"
        "--chakra-colors-heading": "#F2F2F7",
        "--chakra-colors-paragraph": "#AEAEB2",
        "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
      }}
      justify="center"
      flexDir="column"
      as="main"
      bg="#000"
    >
      <HomepageTopNav />
      <Box mt="-80px" pt={{ base: "100px", xl: "40px" }} overflowX="hidden">
        <HeroSection TRACKING_CATEGORY={TRACKING_CATEGORY} />
        <PartnerCarousel />
        <HomePageCard
          title="Client SDKs to connect users to web3"
          description="Onboard every user, connect to any wallet, and build apps that anyone can use — with in-app wallets, account abstraction, and fiat & crypto payments."
          miniTitle="Connect"
          miniImage={require("../../public/assets/landingpage/connect-icon.png")}
          ctaText="Get started"
          label="get-started-connect"
          ctaLink="/connect"
          image={require("../../public/assets/landingpage/connect-hero.png")}
          mobileImage={require("../../public/assets/landingpage/connect-hero.png")}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />
        <HomePageCard
          title="Dedicated APIs for web3 apps & games"
          description="Scalable smart contract APIs backed by secure wallets, with automatic nonce queuing & gas-optimized retries."
          miniTitle="Engine"
          miniImage={require("../../public/assets/landingpage/engine-icon.png")}
          ctaText="Get started"
          label="get-started-engine"
          ctaLink="/engine"
          image={require("../../public/assets/landingpage/engine-hero.png")}
          mobileImage={require("../../public/assets/landingpage/engine-hero.png")}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />
        <HomePageCard
          title="End-to-end tools for smart contracts"
          description="Trusted and modular smart contracts that can be deployed securely on any EVM chain."
          miniTitle="Contracts"
          miniImage={require("../../public/assets/landingpage/contracts-icon.png")}
          ctaText="Get started"
          label="get-started-contracts"
          ctaLink="/contracts"
          image={require("../../public/assets/landingpage/contracts-hero.png")}
          mobileImage={require("../../public/assets/landingpage/contracts-hero.png")}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />

        <Box px={4}>
          <LandingCardWithMetrics
            title={
              <Center flexDir="column" textAlign="center">
                <Heading size="display.sm" color="white">
                  Trusted by the best
                </Heading>

                <Text fontSize={[16, 20]} mt={6}>
                  Powering web3 apps across verticals — from onchain games to
                  creator platforms.
                </Text>
              </Center>
            }
            desktopColumns={3}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            metrics={metrics}
          />
        </Box>

        <WithoutThirdwebSection />
        <Suspense>
          <SDKSection />
          <AnyEVMSection />
          <PricingSection
            trackingCategory={TRACKING_CATEGORY}
            onHomepage
            canTrialGrowth={true}
          />
          <SolutionsSection />
          <GetStartedSection />
          <NewsletterSection />
          <HomepageFooter />
        </Suspense>
      </Box>
    </Flex>
  );
};

HomePage.pageId = PageId.Homepage;

export default HomePage;

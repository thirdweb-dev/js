import { Box, DarkMode, Flex } from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { CLISection } from "components/homepage/sections/CLISection";
import { ContractsSection } from "components/homepage/sections/ContractsSection";
import { DashboardFeaturesSection } from "components/homepage/sections/DashboardFeaturesSection";
import { GetStartedSection } from "components/homepage/sections/GetStartedSection";
import { HeroSection } from "components/homepage/sections/HeroSection";
import { KeyFeatures } from "components/homepage/sections/KeyFeatures";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { NetworksSection } from "components/homepage/sections/NextworksSection";
import { PricingSection } from "components/homepage/sections/PricingSection";
import { SDKSection } from "components/homepage/sections/SDKSection";
import { SolutionsSection } from "components/homepage/sections/Solutions";
import { StatsSection } from "components/homepage/sections/StatsSection";
import { ValuesSection } from "components/homepage/sections/ValuesSection";
import { PartnerCarousel } from "components/partners/carousel";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { PageId } from "page-id";
import { Suspense } from "react";
import { ThirdwebNextPage } from "utils/types";

const HomePage: ThirdwebNextPage = () => {
  return (
    <DarkMode>
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
        <Box mt="-80px" pt="100px" overflowX="hidden">
          <HeroSection />
          <PartnerCarousel />
          <StatsSection />
          <KeyFeatures />
          <ContractsSection />
          <Suspense>
            <Box position="relative" zIndex={10}>
              <SDKSection />
              <Aurora
                pos={{ left: "50%", top: "50%" }}
                size={{ width: "2000px", height: "2000px" }}
                color={"hsl(280deg 78% 30% / 30%)"}
              />
            </Box>
            <CLISection />
            <DashboardFeaturesSection />
            <NetworksSection />
            <PricingSection />
            <SolutionsSection />
            <ValuesSection />
            <GetStartedSection />
            <NewsletterSection />
            <HomepageFooter />
          </Suspense>
        </Box>
      </Flex>
    </DarkMode>
  );
};

HomePage.pageId = PageId.Homepage;

export default HomePage;

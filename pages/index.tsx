import HomePageCard from "components/homepage/sections/HomePageCard";
import { AnyEVMSection } from "../components/homepage/sections/AnyEVM";
import { BuildSection } from "../components/homepage/sections/key-features/BuildSection";
import { LaunchSection } from "../components/homepage/sections/key-features/LaunchSection";
import { ManageSection } from "../components/homepage/sections/key-features/ManageSection";
import { Box, DarkMode, Flex } from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { GetStartedSection } from "components/homepage/sections/GetStartedSection";
import { HeroSection } from "components/homepage/sections/HeroSection";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { PricingSection } from "components/homepage/sections/PricingSection";
import { SDKSection } from "components/homepage/sections/SDKSection";
import { SolutionsSection } from "components/homepage/sections/Solutions";
import { StatsSection } from "components/homepage/sections/StatsSection";
import { ValuesSection } from "components/homepage/sections/ValuesSection";
import { WithoutThirdwebSection } from "components/homepage/sections/WithoutThirdwebSection";
import { PartnerCarousel } from "components/partners/carousel";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { PageId } from "page-id";
import { Suspense } from "react";
import { ThirdwebNextPage } from "utils/types";
import { PRODUCTS } from "components/product-pages/common/nav/data";

const TRACKING_CATEGORY = "homepage";

const HomePage: ThirdwebNextPage = () => {
  const filterProducts = (section: string) => {
    return PRODUCTS.filter(
      (p) => p.section === section && !!p.inLandingPage && !!p.link,
    );
  };

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
          <HomePageCard
            title="Onboard everyone to web3, instantly"
            description="The complete web3 wallet stack — with a customizable Connect Wallet modal, embedded wallets for flexible sign-in options, and account abstraction for the smoothest user experiences."
            introductionTitle="WALLET PRODUCTS"
            image={require("public/assets/bear-market-airdrop/desktop-wallets.png")}
            mobileImage={require("public/assets/bear-market-airdrop/mobile-wallets.png")}
            products={filterProducts("wallets")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
          <HomePageCard
            title="Build smart contracts, deploy on any EVM"
            description="The smart contract development toolkit — with a powerful Solidity SDK to build custom contracts, a library of pre-built & audited contracts, and a 1-click deployment flow to any EVM-compatible blockchains."
            introductionTitle="CONTRACT PRODUCTS"
            image={require("public/assets/bear-market-airdrop/desktop-contracts.png")}
            mobileImage={require("public/assets/bear-market-airdrop/mobile-contracts.png")}
            products={filterProducts("contracts")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
          <HomePageCard
            title="Scale with enterprise-grade infrastructure"
            description="The production-grade server for scalable web3 apps — with backend wallet creation, nonce management, smart contract interactions, account abstraction support, gasless transactions, and managed infrastructure."
            introductionTitle="INFRASTRUCTURE PRODUCT"
            image={require("public/assets/bear-market-airdrop/desktop-engine.png")}
            mobileImage={require("public/assets/bear-market-airdrop/mobile-engine.png")}
            products={filterProducts("infrastructure")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
          <HomePageCard
            title="Simplify NFT purchases with fiat checkouts"
            description="The most powerful NFT checkout — with worldwide availability, support for major payment methods, and full compliance for enterprise-grade apps. Built to onboard everyone, even if they've never created a web3 wallet or bought crypto."
            introductionTitle="CHECKOUT PRODUCT"
            image={require("public/assets/bear-market-airdrop/desktop-checkout.png")}
            mobileImage={require("public/assets/bear-market-airdrop/mobile-checkout.png")}
            products={filterProducts("payments")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
          <WithoutThirdwebSection />
          <ValuesSection />
          <Suspense>
            <BuildSection />
            <SDKSection />
            <LaunchSection />
            <ManageSection />
            <AnyEVMSection />
            <PricingSection TRACKING_CATEGORY={TRACKING_CATEGORY} onHomepage />
            <SolutionsSection />
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

import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "checkout-landing";

const CASE_STUDIES = [
  {
    title: "Balmain x Space Runners",
    description:
      "Pushed the boundaries of fashion and the Metaverse with a collection of limited-edition sneakers linked to a unique Balmain x Space Runners Unicorn NFT.",
    image: require("public/assets/product-pages/checkout/case-study-1.png"),
    link: "https://blog.withpaper.com/how-space-runners-and-balmain-are-shaping-the-future-of-fashion-with-nfts/",
  },
  {
    title: "Ostrich",
    description:
      "Used NFTs to crowdfund their new fintech startup, raising more money with a fiat checkout solution.",
    image: require("public/assets/product-pages/checkout/case-study-2.png"),
    link: "https://blog.withpaper.com/how-ostrich-crowdfunded-their-startup-with-the-help-of-paper/",
  },
];

const CheckoutLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Buy NFTs with Credit Card Checkout",
        description:
          "Let users buy digital assets with a credit card, via a one-click checkout flow. Onboard anyone, even if they've never create a wallet.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/checkout.png`,
              width: 1200,
              height: 630,
              alt: "Buy NFTs with Credit Card Checkout",
            },
          ],
        },
      }}
    >
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "120px" }}
      >
        <LandingHeroWithSideImage
          miniTitle="Checkout"
          title="NFT checkout"
          titleWithGradient="with a credit card"
          subtitle="Enable users to buy digital assets with a credit card. Onboard everyone — even if they've never created a web3 wallet or bought crypto before."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://withpaper.com/sign-up"
          contactUsTitle="Book Demo"
          gradient="linear(to-r,  #1DC1AE, #1DC1AE)"
          image={require("public/assets/product-pages/hero/desktop-hero-checkout.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-checkout.png")}
          miniImage={require("public/assets/product-icons/payments.png")}
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/payments/icon-global.svg")}
            title="Available worldwide"
            description="Available in 190+ countries, all 50 U.S. states, with 10+ currencies and languages supported."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/payments/icon-smart-wallet.svg")}
            title="Accept all payment methods"
            description="Credit & debit cards, Apple Pay, Google Pay, iDEAL, and cross-chain crypto — or bring your own payment processor."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/payments/icon-secure.svg")}
            title="Enterprise-grade security"
            description="Fully compliant & enterprise-ready — with built-in fraud & AML detection and 90%+ authorization rates."
          />
        </LandingGridSection>
        <LandingGridSection desktopColumns={2}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-share.svg")}
              title=" Checkout Links"
              description="Public, reusable URLs that allows buyers to complete a purchase with Paper's prebuilt checkout experience."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-custom.svg")}
              title="Checkout Elements"
              description="Portions of the checkout experience broken down into components for complete customizability. You can embed Checkout Elements onto any page and create a fully white-labelled experience for your customers."
            />
          </Card>
        </LandingGridSection>

        <LandingGridSection
          title={
            <LandingSectionHeading
              title="What You Can Build"
              blackToWhiteTitle=""
            />
          }
        >
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-credit-card.svg")}
              title="Digital Collectibles"
              description="Onboard mainstream users onto Web3 by building an NFT drop which you can purchase using your credit card."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-marketplace.svg")}
              title="Marketplaces"
              description="Build a marketplace where users can buy and sell digital assets using traditional payment methods."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-fundraise.svg")}
              title="Fundraising"
              description="Make it easy for your users to donate to charitable causes, or fund your business idea with digital collectibles which they can purchase using their credit cards."
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="The best web3 apps use thirdweb's smart contract tools"
          category={TRACKING_CATEGORY}
          description="Seamlessly integrate your smart contracts into any app so you can focus on building a great user experience."
          guides={CASE_STUDIES}
          caseStudies
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://withpaper.com/sign-up"
          gradient="linear(to-r, #00A876, #75FFD6)"
        />
      </Container>
    </LandingLayout>
  );
};

CheckoutLanding.pageId = PageId.CheckoutLanding;

export default CheckoutLanding;

import { Box, Center, Container, Flex } from "@chakra-ui/react";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import checkoutLottie from "../public/assets/product-pages/checkout/checkout.json";

const TRACKING_CATEGORY = "checkout-landing";

const CASE_STUDIES = [
  {
    title: "NFT Checkout: Docs Overview",
    image: require("public/assets/product-pages/checkout/case-study-1.png"),
    link: "https://portal.thirdweb.com/payments",
  },
  {
    title: "NFT Checkout: Getting Started",
    image: require("public/assets/product-pages/checkout/case-study-3.png"),
    link: "https://portal.thirdweb.com/payments/nft-checkout/getting-started",
  },
  {
    title: "NFT Checkout: Embedded Elements",
    image: require("public/assets/product-pages/checkout/case-study-2.png"),
    link: "https://portal.thirdweb.com/payments/nft-checkout/elements",
  },
];

export const metrics = [
  {
    title: "Courtyard",
    description:
      "Bringing the collectibles market onchain — with a tokenization platform, marketplace app, and seamless fiat payments.",
    image: require("public/assets/landingpage/case-study-courtyard.png"),
    mobileImage: require("public/assets/landingpage/case-study-courtyard.png"),
    items: [],
    href: "https://blog.thirdweb.com/case-studies/courtyard-brings-collectors-onchain-with-fiat-payments/",
    hoverBackground: "#0053FF",
  },
  {
    title: "Balmain",
    description:
      "Shaping the future of luxury fashion with limited-edition phygital apparel — enabling customers to purchase with credit card or crypto.",
    image: require("public/assets/landingpage/case-study-balmain.png"),
    mobileImage: require("public/assets/landingpage/case-study-balmain.png"),
    flexImage: { base: 1, md: 0.93 },
    items: [],
    href: "https://blog.thirdweb.com/case-studies/balmain-and-space-runners-shape-the-future-of-fashion/",
    hoverBackground: "#082E2E",
  },
];

const CheckoutLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Buy NFTs with Credit Card | Fiat Checkout",
        description:
          "Let users buy digital assets with a credit card via one-click NFT checkouts. Onboard anyone, even if they've never created a wallet. Get started.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/checkout.png`,
              width: 1200,
              height: 630,
              alt: "Buy NFTs with Credit Card | Fiat Checkout",
            },
          ],
        },
      }}
    >
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "224px" }}
      >
        <LandingHeroWithSideImage
          miniTitle="Checkout"
          title="Powerful NFT checkouts,"
          titleWithGradient="for everyone"
          subtitle="Sell NFTs to users with a credit card — with worldwide support for major payment methods, seamless buyer & seller flows, and 100% chargeback protection."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/payments"
          contactUsTitle="Book Demo"
          gradient="linear(to-r,  #1DC1AE, #1DC1AE)"
          miniImage={require("public/assets/product-icons/payments.png")}
          lottie={checkoutLottie}
        />

        <LandingGridSection
          title={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="full"
              marginBottom="38px"
            >
              <LandingSectionHeading
                title="The most powerful NFT checkout"
                blackToWhiteTitle=""
              />
            </Box>
          }
          desktopColumns={4}
        >
          <LandingCardWithImage
            title="Accept all payment methods"
            description="Credit & debit cards, Apple Pay, Google Pay, and cross-chain crypto — or bring your own payments processor."
            image={require("public/assets/landingpage/desktop/payment-methods.png")}
            mobileImage={require("public/assets/landingpage/mobile/payment-methods.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/payments"
            direction="horizontal"
          />

          <LandingCardWithImage
            title="Available worldwide"
            description="Accept payments from 190+ countries and all 50 U.S. states, with 10+ currencies and languages supported."
            image={require("public/assets/landingpage/desktop/worldwide.png")}
            mobileImage={require("public/assets/landingpage/mobile/worldwide.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/payments"
          />

          <LandingCardWithImage
            title="World-class DX"
            description="Integrate in 10 minutes and a few lines of code, or use our hooks to create custom checkout flows."
            image={require("public/assets/landingpage/desktop/world-class-DX.png")}
            mobileImage={require("public/assets/landingpage/mobile/world-class-DX.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/payments/nft-checkout/getting-started"
            colSpan={1}
          />
          <LandingCardWithImage
            title="No wallet? No problem"
            description="Create wallets for buyers with an email, Google account, or social login and transfer instantly — or deposit to their existing wallet."
            image={require("public/assets/landingpage/desktop/wallet-no-problem.png")}
            mobileImage={require("public/assets/landingpage/mobile/wallet-no-problem.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/overview"
          />
          <LandingCardWithImage
            title="Built-in analytics"
            description="Seller analytics including buyer activity, gross revenue, NFTs minted, & number of purchases."
            image={require("public/assets/landingpage/desktop/built-in-analytics.png")}
            mobileImage={require("public/assets/landingpage/mobile/built-in-analytics.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/payments/contracts"
            colSpan={1}
          />
          <LandingCardWithImage
            title="Full chargeback protection"
            description="Compliant & enterprise-ready — with built-in fraud & AML detection, 100% chargeback protection, and enterprise SLAs."
            image={require("public/assets/landingpage/desktop/chargeback-protection.png")}
            mobileImage={require("public/assets/landingpage/mobile/chargeback-protection.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/payments/contracts"
          />
          <LandingCardWithImage
            title="Everything you need to manage payments"
            description="A dashboard with one-click checkout link creation, QR code generation, and fine-grained analytics for any smart contract."
            image={require("public/assets/landingpage/desktop/manage-payments.png")}
            mobileImage={require("public/assets/landingpage/mobile/manage-payments.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/payments/contracts"
          />
          <LandingCardWithImage
            title="Built for scale"
            description="Engineered to process millions of dollars — with ~3,000 transactions per minute, 90%+ authorization rates, & high limits."
            image={require("public/assets/landingpage/desktop/built-for-scale.png")}
            mobileImage={require("public/assets/landingpage/mobile/built-for-scale.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/payments/contracts"
            colSpan={1}
          />
          <LandingCardWithImage
            title="Seamless, transparent buyer flows"
            description="Designed for the best customer experience — with instant wallet creation, NFT delivery status, and flexible payment options."
            image={require("public/assets/landingpage/desktop/seamless-buyer-flows.png")}
            mobileImage={require("public/assets/landingpage/mobile/seamless-buyer-flows.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/payments"
          />
          <LandingCardWithImage
            title="Any EVM chain"
            description="Seamless buyer flows on any EVM network, with lightning-fast bridging and swapping."
            image={require("public/assets/landingpage/desktop/evm-chain.png")}
            mobileImage={require("public/assets/landingpage/mobile/evm-chain.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/payments"
            colSpan={1}
          />
        </LandingGridSection>

        <LandingCardWithMetrics
          title={
            <Center flexDir="column" textAlign="center">
              <Heading size="display.sm" color="white">
                Trusted by industry-leading companies
              </Heading>

              <Text size="body.lg" mt={6}>
                From Fortune 500 companies to the world&apos;s leading brands,
                our products power web3 apps at scale.
              </Text>
            </Center>
          }
          desktopColumns={2}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          metrics={metrics}
          gridMaxWidth={752}
        />

        <LandingGuidesShowcase
          title="Get started with NFT Checkout"
          category={TRACKING_CATEGORY}
          description="Read the full docs and start building with the most powerful web3 payments stack."
          guides={CASE_STUDIES}
          customSolution="See the full NFT Checkout docs"
          customSolutionHref="https://portal.thirdweb.com/payments"
          py={0}
        />

        <LandingEndCTA
          title="Add checkouts to your app"
          titleWithGradient="in 10 minutes."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/payments/contracts"
          gradient="linear(to-r,  #1DC1AE, #1DC1AE)"
        />
      </Container>
    </LandingLayout>
  );
};

CheckoutLanding.pageId = PageId.CheckoutLanding;

export default CheckoutLanding;

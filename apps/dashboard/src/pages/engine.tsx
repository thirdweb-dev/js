import { Box, Center, Container, Flex } from "@chakra-ui/react";
import { PricingEngineHomepage } from "components/homepage/sections/PricingEngine";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { Gradients } from "components/landing-pages/gradients";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import LandingImageSectionItem from "components/landing-pages/image-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { SplashImage } from "components/landing-pages/splash-image";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { OpenSource } from "../components/homepage/open-source/OpenSource";

const TRACKING_CATEGORY = "engine-landing";

export const metrics = [
  {
    title: "Stand With Crypto",
    description:
      "Championing clear crypto regulation to foster greater economic freedom via a grassroots advocacy hub.",
    image: require("../../public/assets/product-pages/engine/casestudy-image-standwithcrypto.png"),
    mobileImage: require("../../public/assets/product-pages/engine/casestudy-image-standwithcrypto.png"),
    items: [
      {
        title: "$87M+",
        description: "Raised",
      },
      {
        title: "515k+",
        description: "Crypto Advocates",
        colSpan: 2,
      },
      {
        title: "165k+",
        description: "Contacts",
      },
    ],
    href: "https://www.standwithcrypto.org/",
    hoverBackground: "#0053FF",
  },
  {
    title: "InfiniGods",
    description:
      "Building a free-to-play web3 game universe — with interoperable onchain assets that players truly own.",
    image: require("../../public/assets/product-pages/engine/casestudy-image-infinigods.png"),
    mobileImage: require("../../public/assets/product-pages/engine/casestudy-image-infinigods.png"),
    items: [
      {
        title: "100k+",
        description: "Daily Users",
      },
      {
        title: "1.5M+",
        description: "Monthly Transactions",
        colSpan: 2,
      },
      {
        title: "10k+",
        description: "VIP Members",
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/king-of-destiny-launches-avatar-nfts-thirdweb-engine/",
    hoverBackground: "#25262B",
  },
  {
    title: "Coinbase Wallet",
    description:
      "Bringing onchain experiences to the real world — with seamless NFT creation, delivery, & transaction management.",
    image: require("../../public/assets/product-pages/engine/casestudy-image-coinbase-wallet.png"),
    mobileImage: require("../../public/assets/product-pages/engine/casestudy-image-coinbase-wallet.png"),
    items: [
      {
        title: "1,000+",
        description: "Real-World Transactions",
        colSpan: 2,
      },
      {
        title: "4 Weeks",
        description: "Total Development Time",
        colSpan: 2,
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/coinbase-brings-onchain-experiences-to-life/",
    hoverBackground: "#0053FF",
  },
];

const GUIDES = [
  {
    title: "The Quick-Start Guide to thirdweb Engine",
    image: require("../../public/assets/product-pages/engine/guide-get-started.png"),
    link: "https://portal.thirdweb.com/engine/get-started",
  },
  {
    title: "Airdrop Tokens and NFTs to Users",
    image: require("../../public/assets/product-pages/engine/guide-airdrop.png"),
    link: "https://portal.thirdweb.com/engine/guides/airdrop-nfts",
  },
  {
    title: "Create a Gasless NFT Mint Farcaster Frame",
    image: require("../../public/assets/product-pages/engine/guide-farcaster-frame.png"),
    link: "https://blog.thirdweb.com/guides/create-an-nft-mint-farcaster-frame/",
  },
];

const EngineLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      py={0}
      seo={{
        title: "Engine: Open-Source APIs for Web3 Apps and Games",
        description:
          "Scalable smart contract APIs backed by secure wallets, with automatic nonce queuing & gas-optimized retries—on any EVM blockchain. Get started.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/engine.png`,
              width: 1200,
              height: 630,
              alt: "thirdweb Engine",
            },
          ],
        },
      }}
    >
      <Flex
        position="relative"
        flexDir="column"
        width="100%"
        overflow="hidden"
        py={{ base: "120px", md: "80px" }}
      >
        <Container
          zIndex={3}
          position="relative"
          maxW="container.page"
          as={Flex}
          flexDir="column"
          gap={{ base: "80px", md: "180px" }}
        >
          <LandingHeroWithSideImage
            miniTitle="Engine"
            miniImage={require("../../public/assets/landingpage/engine-icon.png")}
            title={
              <>
                <Box
                  as="div"
                  display="inline-block"
                  textTransform="capitalize"
                  mr={6}
                >
                  <OpenSource TRACKING_CATEGORY={TRACKING_CATEGORY} />
                </Box>
                APIs for web3 apps & games
              </>
            }
            titleWithGradient=""
            subtitle="Scalable smart contract APIs backed by secure wallets, with automatic nonce queuing & gas-optimized retries."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="/dashboard/engine"
            ctaText="Get started"
            contactUsTitle="Book a demo"
            gradient="linear(to-r, #9786DF, #9786DF)"
            lottie={require("../../public/assets/product-pages/engine/lottie.json")}
            contactUsBg="#0E0E0E"
            contactUsHover={{ background: "#0E0E0E" }}
          />
          <SplashImage
            title="Autoscale"
            titleWithGradient="your app"
            subtitle="Mint tokens and perform onchain actions with robust backend wallets — equipped with automatic nonce management, transaction queueing, and gas-optimized retries."
            trackingCategory={TRACKING_CATEGORY}
            ctaText="Deploy an instance"
            ctaLink="/dashboard/engine"
            gradient="linear(to-r, #FFFFFF, #FFFFFF)"
            lottie={require("../../public/assets/product-pages/engine/lottie2.json")}
          />
          <LandingGridSection
            desktopColumns={3}
            title={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginBottom={{ base: "35px", md: "55px" }}
              >
                <Box width="full" maxWidth="1000px" textAlign="center">
                  <LandingSectionHeading
                    title="What can you build with Engine?"
                    blackToWhiteTitle=""
                  />
                </Box>
              </Box>
            }
          >
            <LandingImageSectionItem
              image={require("../../public/assets/landingpage/desktop/scale-your-app-to-millions.png")}
              mobileImage={require("../../public/assets/landingpage/desktop/scale-your-app-to-millions.png")}
              title="Scale your app to millions"
              description="Eliminate stuck transactions and scale your app with automatic nonce management and gas-optimized transaction retries."
              justifyContent="flex-end"
            />

            <LandingImageSectionItem
              image={require("../../public/assets/landingpage/desktop/create-the-best-ux.png")}
              mobileImage={require("../../public/assets/landingpage/desktop/create-the-best-ux.png")}
              title="Create the best user experience"
              description="Abstract the blockchain away from users — removing wallet creation, gas fees, & signing. Powered by Account Abstraction."
            />

            <LandingImageSectionItem
              image={require("../../public/assets/landingpage/desktop/trigger-onchain-actions.png")}
              mobileImage={require("../../public/assets/landingpage/desktop/trigger-onchain-actions.png")}
              title="Trigger onchain actions with webhooks"
              description="Mint tokens, read & write to smart contracts, & perform onchain transactions with purpose-built webhooks."
            />
          </LandingGridSection>

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
                  title="Solutions for every web3-powered feature"
                  blackToWhiteTitle=""
                />
              </Box>
            }
            desktopColumns={4}
          >
            <LandingCardWithImage
              title="Wallet Management"
              description="Create backend wallets you can programatically use with automatic nonce and gas management. Eliminate gas spikes, stuck transactions and network instability."
              image={require("../../public/assets/landingpage/account-abstraction-desktop.png")}
              mobileImage={require("../../public/assets/landingpage/account-abstraction-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/engine/features/backend-wallets"
              direction="horizontal"
            />
            <LandingCardWithImage
              title="Smart Contracts"
              description="Deploy, read, & write to any smart contract across any EVM-compatible blockchain — and build with thirdweb's audited smart contracts."
              image={require("../../public/assets/landingpage/smart-contract-audits-desktop.png")}
              mobileImage={require("../../public/assets/landingpage/smart-contract-audits-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/engine/features/contracts"
              colSpan={2}
            />

            <LandingCardWithImage
              title="Web3 Auth"
              description="Create permissions to enable users' wallets to directly interact with certain endpoints on the thirdweb Engine."
              image={require("../../public/assets/product-pages/connect/desktop-auth.png")}
              mobileImage={require("../../public/assets/product-pages/connect/mobile-auth.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/connect"
              colSpan={1}
            />
            <LandingCardWithImage
              title="Account Abstraction"
              description="Deploy and manage smart wallets, use session keys for access controls, and transact on behalf of your users."
              image={require("../../public/assets/landingpage/account-desktop.png")}
              mobileImage={require("../../public/assets/landingpage/account-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/engine/features/account-abstraction"
              direction="horizontal"
            />
            <LandingCardWithImage
              title="Gasless Transactions"
              description="Sponsor user transactions with gasless relayers and user operations."
              image={require("../../public/assets/landingpage/transaction-fee-desktop.png")}
              mobileImage={require("../../public/assets/landingpage/transaction-fee-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/engine/features/gasless-transactions"
              colSpan={1}
            />
            <LandingCardWithImage
              title="High transaction throughput"
              description="Blockchain transactions are processed in parallel with nonce management, and stuck transactions are automatically retried."
              image={require("../../public/assets/landingpage/desktop/happy-people.png")}
              mobileImage={require("../../public/assets/landingpage/mobile/happy-people.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/dashboard/engine"
            />
            <LandingCardWithImage
              title="Advanced analytics"
              description="View transaction history trends, event logs for each transaction, a ledger of backend wallet funds, and more."
              image={require("../../public/assets/landingpage/desktop/analytics-v3.png")}
              mobileImage={require("../../public/assets/landingpage/mobile/analytics-v3.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/dashboard/engine"
              direction="horizontal"
              colSpan={2}
            />
            <LandingCardWithImage
              title="Infrastructure"
              description="Built-in infrastructure so you don't have to worry about RPCs, storage, bundlers or paymasters."
              image={require("../../public/assets/landingpage/infastructure-desktop.png")}
              mobileImage={require("../../public/assets/landingpage/infastructure-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/rpc-edge"
              direction="horizontal"
            />
            <LandingCardWithImage
              title="Self-hosted or Managed"
              description="Set up on your own server for free with minimal configuration or use our managed service."
              image={require("../../public/assets/landingpage/selfhost.png")}
              mobileImage={require("../../public/assets/landingpage/selfhost.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/dashboard/engine"
            />
          </LandingGridSection>

          <LandingCardWithMetrics
            title={
              <Center flexDir="column" textAlign="center">
                <Heading size="display.sm" color="white">
                  Trusted by the best
                </Heading>

                <Text fontSize={[16, 20]} mt={6}>
                  thirdweb Engine powers the best onchain apps, integrating into
                  any backend at scale.
                </Text>
              </Center>
            }
            desktopColumns={3}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            metrics={metrics}
          />

          <PricingEngineHomepage trackingCategory={TRACKING_CATEGORY} />

          <LandingGuidesShowcase
            title="Get started with thirdweb Engine"
            category={TRACKING_CATEGORY}
            description="Integrate powerful web3 infrastructure that scales as you grow."
            solution="Engine"
            guides={GUIDES}
          />
          <LandingEndCTA
            title="Start building with"
            titleWithGradient="thirdweb Engine."
            trackingCategory={TRACKING_CATEGORY}
            ctaText="Get started"
            ctaLink="/dashboard/engine"
            contactUsTitle="Book a demo"
            gradient="linear(to-r, #FFFFFF, #FFFFFF)"
            contactUsBg="#0E0E0E"
            contactUsHover={{ background: "#0E0E0E" }}
            contactUsBorder="none"
          />
        </Container>

        <Gradients
          top={{
            top: 100,
            left: 0,
            right: 0,
            height: "2286px",
            width: "100%",
            background: `url("/assets/landingpage/top-gradient.svg")`,
            backgroundSize: { base: "cover", lg: "100% 100%" },
          }}
          bottom={{
            bottom: -200,
            left: 0,
            right: 0,
            height: "1386px",
            width: "100%",
            background: `url("/assets/landingpage/bottom-gradient.png")`,
            backgroundSize: { base: "cover", lg: "100% 100%" },
          }}
        />
      </Flex>
    </LandingLayout>
  );
};

EngineLanding.pageId = PageId.EngineLanding;

export default EngineLanding;

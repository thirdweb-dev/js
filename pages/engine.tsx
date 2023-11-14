import { Box, Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Heading, Text, TrackedLinkButton } from "tw-components";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import {
  LandingCardWithImage,
  LandingImages,
} from "components/landing-pages/card-with-image";
import LandingCardWithImageBackground from "components/landing-pages/card-with-image-background";
import { LandingSectionHeading } from "components/landing-pages/section-heading";

const TRACKING_CATEGORY = "engine-landing";

const trustedCompanies = [
  {
    title: "Coinbase Wallet",
    height: 74,
    width: 74,
    src: require("public/assets/partners/coinbase.png"),
  },
  {
    title: "Layer3",
    height: 74,
    width: 74,
    src: require("public/assets/partners/layer3.png"),
  },
  {
    title: "Ava Labs",
    height: 74,
    width: 74,
    src: require("public/assets/partners/ava.png"),
  },
  {
    title: "Ex Populus",
    height: 74,
    width: 74,
    src: require("public/assets/partners/ex.png"),
  },
];

const EngineLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Engine: Open-Source Server for Scalable Web3 Apps",
        description:
          "A production-grade HTTP server to generate backend wallets on any EVM blockchain—with smart contracts, auth, gasless transactions, & managed infra. Get started.",
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
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "120px" }}
      >
        <LandingHeroWithSideImage
          titleWithGradient="scalable web3 apps"
          miniTitle="Engine"
          title="The open-source server for"
          subtitle="Production-grade HTTP server to interact with any smart contract on any EVM. Engine lets you create and interact with backend developer wallets, enabling high throughput with automatic nonce and gas management."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/engine"
          ctaText="Get started"
          contactUsTitle="Book a demo"
          gradient="linear(to-r, #9786DF, #9786DF)"
          image={require("public/assets/product-pages/engine/desktop-hero.png")}
          mobileImage={require("public/assets/product-pages/engine/mobile-hero.png")}
          miniImage={require("public/assets/product-icons/engine.png")}
        />
        <LandingGridSection
          desktopColumns={4}
          title={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginBottom={{ base: "35px", md: "55px" }}
            >
              <Box width="full" maxWidth="800px" textAlign="center">
                <LandingSectionHeading
                  title="Scale your app without sacrificing performance or security"
                  blackToWhiteTitle=""
                />
              </Box>
            </Box>
          }
        >
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-1.png")}
            title="Scale to millions"
            description="Production-grade infra that scales. Eliminate gas spikes, stuck transactions and network instability."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-2.svg")}
            title="Go to market faster"
            description="Build web3 apps and games using familiar frameworks. Engine lowers the barrier to entry for developers and gives them the power of web3 with one http call."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-7.png")}
            title="Any EVM support"
            description="Launch your app on any (or many) chains. Unlock ultimate cross-chain flexibility with support for any EVM."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-3.svg")}
            title="Secure and reliable"
            description="Back up private keys to the cloud, leverage secure cloud key management for signing and custody, revoke access to backend wallets, and monitor flow of funds."
          />
        </LandingGridSection>

        <LandingImages
          title={
            <LandingSectionHeading
              title="Trusted by the best"
              blackToWhiteTitle=""
            />
          }
          gap="44px"
          images={trustedCompanies}
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
                title="Solutions for every web3-powered feature"
                blackToWhiteTitle=""
              />
            </Box>
          }
          desktopColumns={4}
        >
          <LandingCardWithImage
            title="Wallets"
            description="Create backend wallets you can programatically use with automatic nonce and gas management. Eliminate gas spikes, stuck transactions and network instability."
            image={require("public/assets/landingpage/account-abstraction-desktop.png")}
            mobileImage={require("public/assets/landingpage/account-abstraction-mobile.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallet"
            direction="horizontal"
          />

          <LandingCardWithImage
            title="Smart Contracts"
            description="Deploy, read, & write to any smart contract across any EVM-compatible blockchain — and build with thirdweb's audited smart contracts."
            image={require("public/assets/landingpage/smart-contract-audits-desktop.png")}
            mobileImage={require("public/assets/landingpage/smart-contract-audits-mobile.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/explore"
          />

          <LandingCardWithImage
            title="Web3 Auth"
            description="Create permissions to enable users' wallets to directly interact with certain endpoints on the thirdweb Engine."
            image={require("public/assets/product-pages/connect/desktop-auth.png")}
            mobileImage={require("public/assets/product-pages/connect/mobile-auth.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/auth"
            colSpan={1}
          />
          <LandingCardWithImage
            title="Account Abstraction"
            description="Create managed smart wallets with shared custody between the backend wallet & a user's EOA wallet."
            image={require("public/assets/landingpage/account-desktop.png")}
            mobileImage={require("public/assets/landingpage/account-mobile.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/account-abstraction"
            direction="horizontal"
          />
          <LandingCardWithImage
            title="Gasless Transactions"
            description="Onboard users in an instant & create seamless web3 UX by sponsoring gas fees — for any & all transactions."
            image={require("public/assets/landingpage/transaction-fee-desktop.png")}
            mobileImage={require("public/assets/landingpage/transaction-fee-mobile.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/sponsored-transactions"
            colSpan={1}
          />
          <LandingCardWithImage
            title="Infrastructure"
            description="Built-in infrastructure so you don't have to worry about RPCs, storage, bundlers or paymasters."
            image={require("public/assets/landingpage/infastructure-desktop.png")}
            mobileImage={require("public/assets/landingpage/infastructure-mobile.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/rpc-edge"
            direction="horizontal"
          />
          <LandingCardWithImage
            title="Self-hosted or Managed"
            description="Set up on your own server for free with minimal configuration or use our managed service."
            image={require("public/assets/landingpage/selfhost.png")}
            mobileImage={require("public/assets/landingpage/selfhost.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/engine"
          />
        </LandingGridSection>

        <LandingCardWithImageBackground
          image={require("public/assets/landingpage/coinbase-event.png")}
        >
          <Flex flexDir="column" gap="27px" maxWidth="600px">
            <Heading fontSize="xx-large" fontWeight="600" color="white">
              Coinbase Brings Onchain Experiences to the Real World
            </Heading>
            <Text fontSize="medium" fontWeight="400" color="white">
              Scalable, fast, & reliable NFT infrastructure to power onchain
              experiences — bringing half of all Mainnet 2023 attendees onchain
              via Coinbase Wallet.
            </Text>
            <TrackedLinkButton
              variant="outline"
              isExternal
              bgColor="#FFF"
              color="#000"
              border="none"
              _hover={{
                opacity: 0.9,
              }}
              py={6}
              category={TRACKING_CATEGORY}
              label="coinbase-case-study"
              href="https://blog.thirdweb.com/case-studies/coinbase-brings-onchain-experiences-to-life"
              maxW="fit-content"
            >
              See the case study
            </TrackedLinkButton>
          </Flex>
        </LandingCardWithImageBackground>

        <LandingEndCTA
          title="Start building with"
          titleWithGradient="thirdweb Engine."
          trackingCategory={TRACKING_CATEGORY}
          ctaText="Get started"
          ctaLink="https://portal.thirdweb.com/engine"
          contactUsTitle="Book a demo"
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
        />
      </Container>
    </LandingLayout>
  );
};

EngineLanding.pageId = PageId.EngineLanding;

export default EngineLanding;

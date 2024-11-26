import { Container, Flex, Spacer } from "@chakra-ui/react";
import Carousel from "components/connect/Carousel";
import CodePlayground from "components/connect/CodePlayground";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { Gradients } from "components/landing-pages/gradients";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingLayout } from "components/landing-pages/layout";
import { MiniPlayground } from "components/wallets/ConnectWalletMiniPlayground/MiniPlayground";
import { SupportedPlatformLink } from "components/wallets/SupportedPlatformLink";
import { getAbsoluteUrl } from "lib/vercel-utils";
import Head from "next/head";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "connect-wallet-landing";

export const metrics = [
  {
    title: "ZTX",
    description:
      "A virtual world that empowers creators and communities — powered by thirdweb Connect.",
    image: require("../../public/assets/product-pages/connect/desktop-ztx.png"),
    mobileImage: require("../../public/assets/product-pages/connect/desktop-ztx.png"),
    items: [
      {
        title: "50,000+",
        description: "Smart accounts created",
        colSpan: 4,
      },
    ],
    href: "https://twitter.com/thirdweb/status/1734307574357389326",
    hoverBackground: "#622AFF",
  },
  {
    title: "Torque Motorsport",
    description:
      "Torque Motorsport is a racing game with in-game items as NFTs from Nissan, Subaru, & Mazda.",
    image: require("../../public/assets/product-pages/connect/desktop-motorsport.png"),
    mobileImage: require("../../public/assets/product-pages/connect/desktop-motorsport.png"),
    items: [
      {
        title: "330,000+",
        description: "Players Onboarded",
        colSpan: 4,
      },
    ],
    href: "https://twitter.com/thirdweb/status/1761054053650542863",
    hoverBackground: "#0053FF",
  },
  {
    title: "Courtyard",
    description:
      "A tokenization and marketplace app for anyone to buy, trade, & own collectibles onchain — with fiat & crypto checkouts.",
    image: require("../../public/assets/landingpage/case-study-courtyard.png"),
    mobileImage: require("../../public/assets/landingpage/case-study-courtyard.png"),
    items: [
      {
        title: "$3.7M+",
        description: "GMV",
      },
      {
        title: "215K+",
        description: "Users",
        colSpan: 2,
      },
      {
        title: "79K+",
        description: "Transactions",
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/courtyard-brings-collectors-onchain-with-fiat-payments/",
    hoverBackground: "#0053FF",
  },
];

const GUIDES = [
  {
    title: "The Quick-Start Guide to thirdweb Connect",
    image: require("../../public/assets/product-pages/connect/get-started.png"),
    link: "https://portal.thirdweb.com/connect",
  },
  {
    title: "Add a Connect Wallet Button to Your App or Website",
    image: require("../../public/assets/product-pages/connect/connect-wallet.png"),
    link: "https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton",
  },
];

const ConnectLanding: ThirdwebNextPage = () => {
  const platforms = [
    {
      platform: "React",
      href: "https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton",
    },
    {
      platform: "React Native",
      href: "https://portal.thirdweb.com/react-native/latest/components/ConnectWallet",
    },
    {
      platform: "Unity",
      href: "https://portal.thirdweb.com/unity/wallets/prefab",
    },
  ] as const;

  return (
    <LandingLayout
      bgColor="#0F0F0F"
      py={0}
      seo={{
        title: "Web3 Onboarding, For Everyone | Connect",
        description:
          "Onboard your users to web3 with a beautiful Connect Wallet modal, customizable auth flows, and sign-in for web2 & web3 — in a few lines of code.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/connect.png`,
              width: 1200,
              height: 630,
              alt: "Web3 Onboarding, For Everyone",
            },
          ],
        },
      }}
    >
      <Head>
        <style>
          {`
          .slider {
            padding: 12px 0 !important;
          }

           .slide:first-child, .slide:nth-child(2) {
            padding-right: 16px !important;
          }

         .slide:nth-child(3) {
            padding-right: 6px !important;
          }

          .slide:nth-child(1) {
            padding-left: 6px !important;
          }
          `}
        </style>
      </Head>

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
            miniTitle="Connect"
            title="Client SDKs to"
            miniImage={require("../../public/assets/product-icons/wallet-sdk.png")}
            titleWithGradient="connect users to web3"
            subtitle="Onboard every user, connect to any wallet, and build apps that anyone can use — with in-app wallets, account abstraction, and fiat & crypto payments."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="https://playground.thirdweb.com/connect/sign-in/button"
            contactUsTitle="Book Demo"
            gradient="linear(to-r, #4490FF, #4490FF)"
            image={require("../../public/assets/product-pages/hero/desktop-hero-connect-wallet.png")}
            mobileImage={require("../../public/assets/product-pages/hero/mobile-hero-connect-wallet.png")}
            contactUsBg="#0E0E0E"
            contactUsHover={{ background: "#0E0E0E" }}
          />

          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap="36px"
          >
            <Heading fontSize={[30, 40]} color="white" textAlign="center">
              The complete web3 frontend toolkit
            </Heading>

            <Carousel TRACKING_CATEGORY={TRACKING_CATEGORY} />
          </Flex>

          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap="24px"
          >
            {/* Title and Description */}
            <Heading fontSize={[30, 40]} color="white" textAlign="center">
              The best way to connect a wallet
            </Heading>

            <Text
              fontSize={[16, 20]}
              textAlign="center"
              color="#fff"
              maxW="743px"
              m="0 auto"
            >
              Create a login experience tailor-made for your app. Add your
              wallets of choice, enable web2 sign-in options and create a modal
              that fits your brand.
            </Text>

            {/* Supported platforms */}
            <Flex alignItems="center" gap={2} justifyContent="center">
              <Text
                mr={2}
                display={["none", "block"]}
                fontSize={12}
                color="#fff"
              >
                Supports
              </Text>
              {platforms.map(({ platform, href }) => (
                <SupportedPlatformLink
                  key={platform}
                  trackingCategory={TRACKING_CATEGORY}
                  platform={platform}
                  href={href}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-foreground text-xs hover:border-link-foreground hover:text-link-foreground"
                />
              ))}
            </Flex>

            <MiniPlayground trackingCategory={TRACKING_CATEGORY} />
          </Flex>

          <LandingHeroWithSideImage
            miniTitle="In-App Wallets"
            miniImage={require("../../public/assets/product-icons/embedded-wallet.png")}
            title="Onboard all of your users,"
            titleWithGradient="instantly"
            subtitle="Onboard anyone with an email or social account in 1 click — with flexible auth options, secure account recovery, and account abstraction integration."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="https://portal.thirdweb.com/connect/in-app-wallet/overview"
            gradient="linear(to-r, #4490FF, #4490FF)"
            image={require("../../public/assets/product-pages/hero/desktop-in-app-wallets-v2.png")}
            mobileImage={require("../../public/assets/product-pages/hero/mobile-in-app-wallets-v2.png")}
            noContactUs
          />

          <LandingHeroWithSideImage
            miniTitle="Account Abstraction"
            miniImage={require("../../public/assets/product-icons/smart-wallet.png")}
            title="Give users the power of"
            titleWithGradient="smart accounts"
            subtitle="The complete toolkit to integrate account abstraction into your app — for signless transactions, custom token spending, & more."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="https://portal.thirdweb.com/connect/account-abstraction/overview"
            gradient="linear(to-r, #4490FF, #4490FF)"
            image={require("../../public/assets/product-pages/hero/desktop-aa.png")}
            mobileImage={require("../../public/assets/product-pages/hero/mobile-aa.png")}
            noContactUs
          />

          <LandingHeroWithSideImage
            miniTitle="Pay"
            miniImage={require("../../public/assets/product-pages/connect/icon-pay.png")}
            title="Fiat & cross-chain crypto payments,"
            titleWithGradient="made easy"
            subtitle="The easiest way for users to transact in your app — with credit card & cross-chain crypto payments."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="https://portal.thirdweb.com/connect/pay/overview"
            gradient="linear(to-r, #4490FF, #4490FF)"
            image={require("../../public/assets/product-pages/hero/desktop-pay.png")}
            mobileImage={require("../../public/assets/product-pages/hero/mobile-pay.png")}
            noContactUs
          />

          <Flex flexDir="column" gap={6}>
            <LandingGridSection
              title={
                <div className="flex items-center justify-center">
                  <Heading
                    size="display.sm"
                    color="white"
                    textAlign="center"
                    maxW="3xl"
                  >
                    Everything you need to build seamless web3 apps
                  </Heading>
                </div>
              }
              desktopColumns={4}
            >
              <LandingCardWithImage
                title="Reliable connectors"
                description="Integrate 350+ web3 wallets — including EOAs, in-app wallets, and smart accounts.​"
                image={require("../../public/assets/product-pages/connect/desktop-rely.png")}
                mobileImage={require("../../public/assets/product-pages/connect/mobile-rely.png")}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                href="https://portal.thirdweb.com/typescript/v5/react/connecting-wallets"
              />
              <LandingCardWithImage
                title="Build on any platform"
                description="Best-in-class SDKs for web, mobile, and Unity."
                image={require("../../public/assets/product-pages/connect/desktop-pixel.png")}
                mobileImage={require("../../public/assets/product-pages/connect/mobile-pixel.png")}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                href="https://portal.thirdweb.com/connect"
              />
            </LandingGridSection>
            <LandingGridSection desktopColumns={4}>
              <LandingCardWithImage
                title="Infinite customizability"
                description="Pre-built UI components to get started quickly — and a powerful SDK to build custom flows."
                image={require("../../public/assets/product-pages/connect/desktop-customizability.png")}
                mobileImage={require("../../public/assets/product-pages/connect/mobile-customizability.png")}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                href="https://portal.thirdweb.com/typescript/v5"
              />
              <LandingCardWithImage
                title="Authenticate any user"
                description={
                  <>
                    Verify a user&apos;s onchain identity with passwordless
                    auth, using the SIWE (Sign-in with Ethereum) standard.
                  </>
                }
                image={require("../../public/assets/product-pages/connect/desktop-authenticate.png")}
                mobileImage={require("../../public/assets/product-pages/connect/mobile-authenticate.png")}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                href="https://portal.thirdweb.com/typescript/v5/auth"
                direction="horizontal"
              />
            </LandingGridSection>
            <LandingGridSection desktopColumns={4}>
              <LandingCardWithImage
                title="In-depth analytics"
                description="Comprehensive insights to understand how users are interacting with your app."
                image={require("../../public/assets/product-pages/connect/desktop-connection.png")}
                mobileImage={require("../../public/assets/product-pages/connect/mobile-connection.png")}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                direction="horizontal"
                href="https://playground.thirdweb.com/connect/sign-in/button"
              />
              <LandingCardWithImage
                title="Production-grade infrastructure"
                description="Built-in RPCs, IPFS storage, and account abstraction infrastructure — including contracts, bundlers, & paymasters."
                image={require("../../public/assets/product-pages/connect/desktop-scale.png")}
                mobileImage={require("../../public/assets/product-pages/connect/mobile-scale.png")}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                href="https://playground.thirdweb.com/connect/sign-in/button"
              />
            </LandingGridSection>
          </Flex>

          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap={6}
          >
            <Heading
              fontSize={[30, 40]}
              color="white"
              textAlign="center"
              maxW="900px"
            >
              Plug smart contracts into your apps
            </Heading>
            <Spacer h={1} />
            <Text
              fontSize={[16, 20]}
              textAlign="center"
              maxW="800px"
              m="0 auto"
            >
              The complete SDK to add any smart contract into your app — and
              call functions for any type of onchain interaction.
            </Text>

            <CodePlayground TRACKING_CATEGORY={TRACKING_CATEGORY} />
          </Flex>

          <LandingCardWithMetrics
            title={
              <div className="flex flex-col items-center justify-center text-center">
                <Heading size="display.sm" color="white">
                  Trusted by the best
                </Heading>

                <Text fontSize={[16, 20]} mt={6}>
                  thirdweb Connect powers the best web3 projects — from
                  marketplaces, to collectibles, to games.
                </Text>
              </div>
            }
            desktopColumns={3}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            metrics={metrics}
          />
          <LandingGuidesShowcase
            title="Get started with thirdweb Connect"
            category={TRACKING_CATEGORY}
            description="See our quick-start guides to add powerful login experiences into your web3 app."
            solution="Connect"
            guides={GUIDES}
          />
          <LandingEndCTA
            title="Integrate in a few lines of code."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="https://playground.thirdweb.com/connect/sign-in/button"
            gradient="linear(to-r, #3385FF, #7BB0FF)"
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

ConnectLanding.pageId = PageId.ConnectLanding;

export default ConnectLanding;

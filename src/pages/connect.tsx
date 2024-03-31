import { Center, Container, Flex, Spacer } from "@chakra-ui/react";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingLayout } from "components/landing-pages/layout";
import { MiniPlayground } from "components/wallets/ConnectWalletMiniPlayground/MiniPlayground";
import { SupportedPlatformLink } from "components/wallets/SupportedPlatformLink";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import connectLottie from "../../public/assets/product-pages/connect/connect-lottie.json";
import checkoutLottie from "../../public/assets/product-pages/checkout/checkout.json";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
import CodePlayground from "components/connect/CodePlayground";
import Carousel from "components/connect/Carousel";
import Head from "next/head";

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
    href: "https://ztx.io",
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
    href: "https://torquemotorsport.io",
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
    image: require("/public/assets/product-pages/connect/get-started.png"),
    link: "https://portal.thirdweb.com/react/latest/components/ConnectWallet",
  },
  {
    title: "Add a Connect Wallet Button to Your App or Website",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/10/How-to-Add-a-Connect-Wallet-Button-to-your-App-or-Website.png",
    link: "https://blog.thirdweb.com/guides/add-connectwallet-to-your-website/",
  },
  {
    title: "Create Your Own Custom Connect Wallet Button",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/10/Create-a-Customizable-Connect-Wallet-Button.png",
    link: "https://blog.thirdweb.com/guides/create-a-custom-connect-wallet-button/",
  },
];

const ConnectLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
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

      <Container
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
          ctaLink="/dashboard/connect/playground"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #4490FF, #4490FF)"
          lottie={connectLottie}
          image={require("../../public/assets/product-pages/hero/desktop-hero-connect-wallet.png")}
          mobileImage={require("../../public/assets/product-pages/hero/mobile-hero-connect-wallet.png")}
        />

        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          gap="24px"
        >
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

          <Text fontSize={[16, 20]} textAlign="center" maxW="743px" m="0 auto">
            Create a login experience tailor-made for your app. Add your wallets
            of choice, enable web2 sign-in options and create a modal that fits
            your brand.
          </Text>

          {/* Supported platforms */}
          <Flex alignItems="center" gap={2} justifyContent={"center"}>
            <Text mr={2} display={["none", "block"]} fontSize={12}>
              Supports
            </Text>
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="React"
              href="https://portal.thirdweb.com/react/latest/components/ConnectWallet"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="React Native"
              href="https://portal.thirdweb.com/react-native/latest/components/ConnectWallet"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="Unity"
              href="https://portal.thirdweb.com/unity/wallets/prefab"
            />
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
          ctaLink="https://portal.thirdweb.com/connect/embedded-wallet/overview"
          gradient="linear(to-r, #4490FF, #4490FF)"
          image={require("../../public/assets/product-pages/hero/desktop-hero-embedded-wallets.png")}
          mobileImage={require("../../public/assets/product-pages/hero/mobile-hero-embedded-wallets.png")}
          noContactUs
        />

        <LandingHeroWithSideImage
          miniTitle="Account Abstraction"
          miniImage={require("../../public/assets/product-icons/smart-wallet.png")}
          title="Give users the power of"
          titleWithGradient="smart accounts"
          subtitle="The complete toolkit to integrate account abstraction into your app — for signless transactions, custom token spending, & more."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/connect/account-abstraction"
          gradient="linear(to-r, #4490FF, #4490FF)"
          image={require("../../public/assets/product-pages/smart-wallet/desktop-hero.png")}
          mobileImage={require("../../public/assets/product-pages/smart-wallet/mobile-hero.png")}
          noContactUs
        />

        <LandingHeroWithSideImage
          miniTitle="Pay"
          miniImage={require("../../public/assets/product-pages/connect/icon-pay.png")}
          title="Fiat & cross-chain crypto payments,"
          titleWithGradient="made easy"
          subtitle="The easiest way for users to transact in your app — with automatic bridging & swapping built in."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/payments"
          gradient="linear(to-r, #4490FF, #4490FF)"
          lottie={checkoutLottie}
          noContactUs
        />

        <Flex flexDir="column" gap={6}>
          <LandingGridSection
            title={
              <Center>
                <Heading
                  size="display.sm"
                  color="white"
                  textAlign="center"
                  maxW="3xl"
                >
                  Everything you need to build seamless web3 apps
                </Heading>
              </Center>
            }
            desktopColumns={4}
          >
            <LandingCardWithImage
              title="Reliable connectors"
              description="Integrate 200+ web3 wallets — including EOAs, in-app wallets, and smart accounts.​"
              image={require("../../public/assets/product-pages/connect/desktop-rely.png")}
              mobileImage={require("../../public/assets/product-pages/connect/mobile-rely.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/dashboard/connect/playground"
            />
            <LandingCardWithImage
              title="Build on any platform"
              description="Best-in-class SDKs for mobile, web, and Unity."
              image={require("../../public/assets/product-pages/connect/desktop-pixel.png")}
              mobileImage={require("../../public/assets/product-pages/connect/mobile-pixel.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/connect/connect/ConnectWallet"
            />
          </LandingGridSection>
          <LandingGridSection desktopColumns={4}>
            <LandingCardWithImage
              title="Infinite customizability"
              description="Custom components with your branding, different modal styles, and everything else to build your app."
              image={require("../../public/assets/product-pages/connect/desktop-customizability.png")}
              mobileImage={require("../../public/assets/product-pages/connect/mobile-customizability.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/react/v4/connecting-wallets/custom-ui"
            />
            <LandingCardWithImage
              title="Authenticate any user"
              description={
                <>
                  Verify a user&apos;s onchain identity with passwordless auth,
                  using the SIWE (Sign-in with Ethereum) standard.
                </>
              }
              image={require("../../public/assets/product-pages/connect/desktop-authenticate.png")}
              mobileImage={require("../../public/assets/product-pages/connect/mobile-authenticate.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/dashboard/connect/playground"
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
              href="/dashboard/connect/playground"
            />
            <LandingCardWithImage
              title="Production-grade infrastructure"
              description="Built-in RPCs, IPFS storage, and account abstraction infrastructure — including contracts, bundlers, & paymasters."
              image={require("../../public/assets/product-pages/connect/desktop-scale.png")}
              mobileImage={require("../../public/assets/product-pages/connect/mobile-scale.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/dashboard/connect/playground"
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
            Plug smart contracts into your apps, seamlessly
          </Heading>
          <Spacer h={1} />
          <Text fontSize={[16, 20]} textAlign="center" maxW="800px" m="0 auto">
            The complete SDK to add any smart contract into your app — and call
            functions for any type of onchain interaction.
          </Text>

          <CodePlayground TRACKING_CATEGORY={TRACKING_CATEGORY} />
        </Flex>

        <LandingCardWithMetrics
          title={
            <Center flexDir="column" textAlign="center">
              <Heading size="display.sm" color="white">
                Trusted by the best
              </Heading>

              <Text fontSize={[16, 20]} mt={6}>
                thirdweb Connect powers the best web3 projects — from
                marketplaces, to collectibles, to games.
              </Text>
            </Center>
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
          title="Integrate in"
          titleWithGradient="a few lines of code."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/connect/playground"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
        />
      </Container>
    </LandingLayout>
  );
};

ConnectLanding.pageId = PageId.ConnectLanding;

export default ConnectLanding;

import { Container, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import { LandingDynamicSelector } from "components/landing-pages/dynamic-selector";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { getAbsoluteUrl } from "lib/vercel-utils";
import type { Metadata } from "next";
import { Heading } from "tw-components";
// images
import analyticsImage from "../../../../public/assets/landingpage/desktop/analytics.png";
import authDesktopImage from "../../../../public/assets/landingpage/desktop/auth.png";
import crossPlatformDesktopImage from "../../../../public/assets/landingpage/desktop/cross-platform.png";
import enterpriseSecurityImage from "../../../../public/assets/landingpage/desktop/enterprise-security.png";
import guestImage from "../../../../public/assets/landingpage/desktop/guest.png";
import magicImage from "../../../../public/assets/landingpage/desktop/magic.png";
import onboardImage from "../../../../public/assets/landingpage/desktop/onboard.png";
import powerfulImage from "../../../../public/assets/landingpage/desktop/powerful.png";
import siweImage from "../../../../public/assets/landingpage/desktop/siwe.png";
import walletImage from "../../../../public/assets/landingpage/desktop/wallet.png";
import analyticsMobileImage from "../../../../public/assets/landingpage/mobile/analytics.png";
import authMobileImage from "../../../../public/assets/landingpage/mobile/auth.png";
import crossPlatformMobileImage from "../../../../public/assets/landingpage/mobile/cross-platform.png";
import enterpriseSecurityMobileImage from "../../../../public/assets/landingpage/mobile/enterprise-security.png";
import guestMobileImage from "../../../../public/assets/landingpage/mobile/guest.png";
import magicMobileImage from "../../../../public/assets/landingpage/mobile/magic.png";
import mobileOnboardImage from "../../../../public/assets/landingpage/mobile/onboard.png";
import powerfulMobileImage from "../../../../public/assets/landingpage/mobile/powerful.png";
import siweMobileImage from "../../../../public/assets/landingpage/mobile/siwe.png";
import walletMobileImage from "../../../../public/assets/landingpage/mobile/wallet.png";
import embeddedWalletIcon from "../../../../public/assets/product-icons/embedded-wallet.png";
import authImage from "../../../../public/assets/product-pages/embedded-wallets/auth.png";
import crossPlatformImage from "../../../../public/assets/product-pages/embedded-wallets/cross-platform.png";
import embeddedWalletImage from "../../../../public/assets/product-pages/embedded-wallets/embedded-wallet.png";
import paperImage from "../../../../public/assets/product-pages/embedded-wallets/paper.png";
import seamlessImage from "../../../../public/assets/product-pages/embedded-wallets/seamless.png";
import desktopHeroEmbeddedWalletsImage from "../../../../public/assets/product-pages/hero/desktop-hero-embedded-wallets.png";
import mobileHeroEmbeddedWalletsImage from "../../../../public/assets/product-pages/hero/mobile-hero-embedded-wallets.png";
import getStartedImage from "../../../../public/assets/product-pages/smart-wallet/get-started.png";

const TRACKING_CATEGORY = "embedded-wallets-landing";

const GUIDES = [
  {
    title: "Docs: In-App Wallets Overview",
    image: embeddedWalletImage,
    link: "https://portal.thirdweb.com/connect/in-app-wallet/overview",
  },
  {
    title: "Live Demo: In-App Wallets",
    image: paperImage,
    link: "https://catattack.thirdweb.com",
  },
  {
    title: "Quick-Start Template: In-App Wallet + Account Abstraction",
    image: getStartedImage,
    link: "https://github.com/thirdweb-example/embedded-smart-wallet",
  },
];

const title = "In-App Wallets: Onboard Everyone to your App";
const description =
  "Onboard anyone with an email or Google account—with 1-click login flows, flexible auth options, & secure account recovery. Learn more.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: `${getAbsoluteUrl()}/assets/og-image/embedded-wallets.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return (
    <Container
      maxW="container.page"
      as={Flex}
      flexDir="column"
      gap={{ base: "80px", md: "240px" }}
    >
      <LandingHeroWithSideImage
        miniTitle="In-App Wallets"
        title="The power of web3, "
        titleWithGradient="with web2 UX"
        subtitle="Onboard anyone with an email or Google account — with 1-click login flows, flexible auth options, and secure account recovery. Free up to 10k users."
        trackingCategory={TRACKING_CATEGORY}
        ctaLink="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        contactUsTitle="Book Demo"
        gradient="linear(to-r, #4490FF, #4490FF)"
        image={desktopHeroEmbeddedWalletsImage}
        mobileImage={mobileHeroEmbeddedWalletsImage}
        miniImage={embeddedWalletIcon}
      />

      <LandingDynamicSelector
        gradient="linear(to-r, #4490FF, #4490FF)"
        titleGradient="linear(to-r, #3385FF, #7BB0FF)"
        titleWithGradient="onboard your way"
        title="Flexible flows so you can"
        blackToWhiteTitle=""
        TRACKING_CATEGORY={TRACKING_CATEGORY}
        margin="40px 0 0 0"
        items={[
          {
            title: "Seamless onboarding with managed auth",
            description:
              "Let users access your app instantly an email address, Google account, or social logins.",
            Component: (
              <ChakraNextImage src={seamlessImage} alt="" borderRadius="lg" />
            ),
          },
          {
            title: "Integrate with your own custom auth",
            description:
              "Spin up in-app wallets for your users with your app or game's existing auth system.",
            Component: (
              <ChakraNextImage src={authImage} alt="" borderRadius="lg" />
            ),
          },
          {
            title: "Cross-platform support",
            description:
              "Enable users to log into their accounts (and access their wallets) from any device, in one click. Support for web, mobile, & Unity.",
            Component: (
              <ChakraNextImage
                src={crossPlatformImage}
                alt=""
                borderRadius="lg"
              />
            ),
          },
        ]}
      />

      <LandingGridSection
        desktopColumns={4}
        title={
          <div className="flex items-center justify-center">
            <Heading size="display.sm" color="white">
              Abstract away complexity for your users
            </Heading>
          </div>
        }
      >
        <LandingCardWithImage
          title="Onboard anyone, instantly"
          description="One-click login with a Google account, two-step verification with email, and custom auth integration for your existing users."
          image={onboardImage}
          mobileImage={mobileOnboardImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          direction="horizontal"
        />

        <LandingCardWithImage
          title="Cross-platform support"
          description="Users can log into their accounts (and access their wallets) from any device, in one click. Support for web, mobile, & Unity."
          image={crossPlatformDesktopImage}
          mobileImage={crossPlatformMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        />

        <LandingCardWithImage
          title="Enterprise-grade wallet security"
          description="Self-custodial wallets with flexible & secure account recovery — powered by MPC."
          image={enterpriseSecurityImage}
          mobileImage={enterpriseSecurityMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-it-works"
          colSpan={1}
        />

        <LandingCardWithImage
          title="User experiences that feel like magic"
          description="Seamless integration with Account Abstraction (ERC-4337) for gas-free, signless onboarding & user experiences."
          image={magicImage}
          mobileImage={magicMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/enable-gasless"
        />

        <LandingCardWithImage
          title="Guest mode"
          description={`Allow anyone to use your app in seconds — with a wallet that's generated automatically when they press "Continue as guest."`}
          image={guestImage}
          mobileImage={guestMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/references/wallets/latest/LocalWallet"
          colSpan={1}
        />

        <LandingCardWithImage
          title="Bring your own auth"
          description="Integrate your authentication system and spin up in-app wallets for your users — new and existing."
          image={authDesktopImage}
          mobileImage={authMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/configuration"
        />

        <LandingCardWithImage
          title="Everything a wallet needs"
          description="Give users the ability to send, receive, & view assets. Transaction history, ENS support,& more out of the box."
          image={walletImage}
          mobileImage={walletMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/connect-users"
          direction="horizontal"
        />

        <LandingCardWithImage
          title="Powerful hooks"
          description="Flexible hooks, functions, and low-level tools for fully custom In-App Wallet experiences."
          image={powerfulImage}
          mobileImage={powerfulMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/build-your-own-ui"
          colSpan={1}
        />

        <LandingCardWithImage
          title="Sign-in with Ethereum"
          description="Verify a user's onchain identity with web3-first authentication, using the SIWE (Sign-in with Ethereum) standard."
          image={siweImage}
          mobileImage={siweMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/wallets/auth"
          direction="horizontal"
        />

        <LandingCardWithImage
          title="Wallet analytics"
          description="Comprehensive wallet insights to understand how users are interacting with your app."
          image={analyticsImage}
          mobileImage={analyticsMobileImage}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          href="/team"
          colSpan={1}
        />
      </LandingGridSection>

      <LandingGuidesShowcase
        title="Get started with In-App Wallets"
        category={TRACKING_CATEGORY}
        description="Read the docs, see the live demo, and use the quick-start template to build with In-App Wallets."
        guides={GUIDES}
        customSolution="See the full In-App Wallet docs"
        customSolutionHref="https://portal.thirdweb.com/wallets/in-app-wallet/overview"
        py={0}
      />

      <LandingEndCTA
        title="Integrate in"
        titleWithGradient="a few lines of code."
        trackingCategory={TRACKING_CATEGORY}
        ctaLink="https://portal.thirdweb.com/wallets/in-app-wallet/overview"
        gradient="linear(to-r, #3385FF, #7BB0FF)"
      />
    </Container>
  );
}

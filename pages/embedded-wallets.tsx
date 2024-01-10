import { Center, Container, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import { LandingDynamicSelector } from "components/landing-pages/dynamic-selector";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "embedded-wallets-landing";

const GUIDES = [
  {
    title: "Docs: Embedded Wallets Overview",
    image: require("/public/assets/product-pages/embedded-wallets/embedded-wallet.png"),
    link: "https://portal.thirdweb.com/wallets/embedded-wallet/overview",
  },
  {
    title: "Live Demo: Embedded Wallets",
    image: require("/public/assets/product-pages/embedded-wallets/paper.png"),
    link: "https://catattack.thirdweb.com",
  },
  {
    title: "Quick-Start Template: Embedded + Smart Wallets",
    image: require("/public/assets/product-pages/smart-wallet/get-started.png"),
    link: "https://github.com/thirdweb-example/embedded-smart-wallet",
  },
];

const EmbeddedWalletsLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Embedded Wallets: Onboard Everyone to your App",
        description:
          "Onboard anyone with an email or Google account—with 1-click login flows, flexible auth options, & secure account recovery. Learn more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/embedded-wallets.png`,
              width: 1200,
              height: 630,
              alt: "Embedded Wallets: Onboard Everyone to your App",
            },
          ],
        },
      }}
    >
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "240px" }}
      >
        <LandingHeroWithSideImage
          miniTitle="Embedded Wallets"
          title="The power of web3, "
          titleWithGradient="with web2 UX"
          subtitle="Onboard anyone with an email or Google account — with 1-click login flows, flexible auth options, and secure account recovery. Free up to 10k users."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/wallets/embedded-wallet/overview"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #4490FF, #4490FF)"
          image={require("public/assets/product-pages/hero/desktop-hero-embedded-wallets.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-embedded-wallets.png")}
          miniImage={require("public/assets/product-icons/embedded-wallet.png")}
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
                <ChakraNextImage
                  src={require("/public/assets/product-pages/embedded-wallets/seamless.png")}
                  alt=""
                  borderRadius="lg"
                />
              ),
            },
            {
              title: "Integrate with your own custom auth",
              description:
                "Spin up embedded wallets for your users with your app or game's existing auth system.",
              Component: (
                <ChakraNextImage
                  src={require("/public/assets/product-pages/embedded-wallets/auth.png")}
                  alt=""
                  borderRadius="lg"
                />
              ),
            },
            {
              title: "Cross-platform support",
              description:
                "Enable users to log into their accounts (and access their wallets) from any device, in one click. Support for web, mobile, & Unity.",
              Component: (
                <ChakraNextImage
                  src={require("/public/assets/product-pages/embedded-wallets/cross-platform.png")}
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
            <Center>
              <Heading size="display.sm" color="white">
                Abstract away complexity for your users
              </Heading>
            </Center>
          }
        >
          <LandingCardWithImage
            title="Onboard anyone, instantly"
            description="One-click login with a Google account, two-step verification with email, and custom auth integration for your existing users."
            image={require("public/assets/landingpage/desktop/onboard.png")}
            mobileImage={require("public/assets/landingpage/mobile/onboard.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/overview"
            direction="horizontal"
          />

          <LandingCardWithImage
            title="Cross-platform support"
            description="Users can log into their accounts (and access their wallets) from any device, in one click. Support for web, mobile, & Unity."
            image={require("public/assets/landingpage/desktop/cross-platform.png")}
            mobileImage={require("public/assets/landingpage/mobile/cross-platform.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/overview"
          />

          <LandingCardWithImage
            title="Enterprise-grade wallet security"
            description="Self-custodial wallets with flexible & secure account recovery — powered by MPC."
            image={require("public/assets/landingpage/desktop/enterprise-security.png")}
            mobileImage={require("public/assets/landingpage/mobile/enterprise-security.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/how-it-works"
            colSpan={1}
          />

          <LandingCardWithImage
            title="User experiences that feel like magic"
            description="Seamless integration with Account Abstraction (ERC-4337) for gas-free, signless onboarding & user experiences."
            image={require("public/assets/landingpage/desktop/magic.png")}
            mobileImage={require("public/assets/landingpage/mobile/magic.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/how-to/enable-gasless"
          />

          <LandingCardWithImage
            title="Guest mode"
            description={`Allow anyone to use your app in seconds — with a wallet that's generated automatically when they press "Continue as guest."`}
            image={require("public/assets/landingpage/desktop/guest.png")}
            mobileImage={require("public/assets/landingpage/mobile/guest.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/references/wallets/latest/LocalWallet"
            colSpan={1}
          />

          <LandingCardWithImage
            title="Bring your own auth"
            description="Integrate your authentication system and spin up embedded wallets for your users — new and existing."
            image={require("public/assets/landingpage/desktop/auth.png")}
            mobileImage={require("public/assets/landingpage/mobile/auth.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/custom-auth/configuration"
          />

          <LandingCardWithImage
            title="Everything a wallet needs"
            description="Give users the ability to send, receive, & view assets. Transaction history, ENS support,& more out of the box."
            image={require("public/assets/landingpage/desktop/wallet.png")}
            mobileImage={require("public/assets/landingpage/mobile/wallet.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/how-to/connect-users"
            direction="horizontal"
          />

          <LandingCardWithImage
            title="Powerful hooks"
            description="Flexible hooks, functions, and low-level tools for fully custom Embedded Wallet experiences."
            image={require("public/assets/landingpage/desktop/powerful.png")}
            mobileImage={require("public/assets/landingpage/mobile/powerful.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/embedded-wallet/how-to/build-your-own-ui"
            colSpan={1}
          />

          <LandingCardWithImage
            title="Sign-in with Ethereum"
            description="Verify a user's onchain identity with web3-first authentication, using the SIWE (Sign-in with Ethereum) standard."
            image={require("public/assets/landingpage/desktop/siwe.png")}
            mobileImage={require("public/assets/landingpage/mobile/siwe.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/wallets/auth"
            direction="horizontal"
          />

          <LandingCardWithImage
            title="Wallet analytics"
            description="Comprehensive wallet insights to understand how users are interacting with your app."
            image={require("public/assets/landingpage/desktop/analytics.png")}
            mobileImage={require("public/assets/landingpage/mobile/analytics.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://thirdweb.com/dashboard/wallets/analytics"
            colSpan={1}
          />
        </LandingGridSection>

        <LandingGuidesShowcase
          title="Get started with Embedded Wallets"
          category={TRACKING_CATEGORY}
          description="Read the docs, see the live demo, and use the quick-start template to build with Embedded Wallets."
          guides={GUIDES}
          customSolution="See the full Embedded Wallet docs"
          customSolutionHref="https://portal.thirdweb.com/wallets/embedded-wallet/overview"
          py={0}
        />

        <LandingEndCTA
          title="Integrate in"
          titleWithGradient="a few lines of code."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/wallets/embedded-wallet/overview"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
        />
      </Container>
    </LandingLayout>
  );
};

EmbeddedWalletsLanding.pageId = PageId.EmbeddedWalletsLanding;

export default EmbeddedWalletsLanding;

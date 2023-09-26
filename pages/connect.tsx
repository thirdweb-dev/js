import { Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "connect-wallet-landing";

const ConnectLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Web3 Onboarding, Built for the Next Billion Users",
        description:
          "Onboard your users to web3 with a beautiful Connect Wallet modal, customizable auth flows, and sign-in for web2 & web3 — in a few lines of code.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/embedded-wallets.png`,
              width: 1200,
              height: 630,
              alt: "Web3 Onboarding, Built for the Next Billion Users",
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
          miniTitle="Connect"
          title="Web3 onboarding,"
          titleWithGradient="for the next billion users"
          subtitle="Onboard everyone to web3 with a customizable Connect Wallet modal, built-in auth, and sign-in options for web2 & web3 — in a few lines of code."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/wallets/connect"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          image={require("public/assets/product-pages/hero/desktop-hero-connect-wallet.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-connect-wallet.png")}
        />

        <LandingGridSection title={<></>}>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/wallets/icon-custom.svg")}
            title="Your Connect Wallet experience"
            description="Build custom onboarding flows with a powerful UI component — with web3 & web2 login options, personalized branding & themes, and everything you need to tailor it to your app."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/wallets/icon-email-signin.svg")}
            title="Instant onboarding for all"
            description="Authenticate & onboard users easily — with just an email, phone, or social account. Generate wallets for your users under the hood, or empower them to create their first self-custodial wallet."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/wallets/icon-simple-click.svg")}
            title="Best-in-class DX"
            description="Integrate with just a few lines of code — with an interactive builder, powerful hooks for full customization, and onchain analytics."
          />
        </LandingGridSection>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-custom.svg")}
              title="An intuitive onboarding experience"
              description="Add the power of web3 to any app with our Connect Wallet UI component — with cross-platform support (Web, Mobile, Unity) and the smoothest user experience for every type of wallet."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-email-signin.svg")}
              title="Web2 login flows"
              description="Instantly onboard any user with just an email, phone number, social login, or passkeys — and automatically generate a wallet for them after they sign up."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-evm.svg")}
              title="Cross-chain compatibility"
              description="Build web3 apps on any (or many) chains with native EVM-compatibility — and the smoothest UX with automatic network switching."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-personalize.svg")}
              title="Personalized user experience"
              description="The Connect Wallet component automatically detects which wallets a user has installed on their browser, recommending them to select the wallet that they can get started with the most easily."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-secure.svg")}
              title="Reliable connectors"
              description="Use our connectors to integrate 170+ wallet providers into any app — including non-custodial wallets (MetaMask, Coinbase Wallet, Wallet Connect), email wallets, local wallets, & native Safe integration."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-guest.svg")}
              title="Guest mode"
              description="Onboard new users to any dApp in seconds, allowing them to 'Continue as guest' — at the press of a button or through a username-and-password flow — and automatically creating a wallet for them under the hood."
            />
          </Card>
        </SimpleGrid>

        <LandingEndCTA
          title="Integrate in"
          titleWithGradient="a few lines of code."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/wallets/connect"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
        />
      </Container>
    </LandingLayout>
  );
};

ConnectLanding.pageId = PageId.ConnectLanding;

export default ConnectLanding;

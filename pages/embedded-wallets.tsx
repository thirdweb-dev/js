import { Container, Flex, SimpleGrid } from "@chakra-ui/react";
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

const TRACKING_CATEGORY = "embedded-wallets-landing";

const GUIDES = [
  {
    title: "Get Started with Embedded Wallets",
    image: require("/public/assets/product-pages/embedded-wallets/embedded-wallet.png"),
    link: "https://docs.withpaper.com/reference/embedded-wallet-service-overview",
  },
  {
    title: "How to Implement Email Wallets",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/How-to-Add-Paper-Wallet-to-your-Connect-Wallet-Button.png",
    link: "https://blog.thirdweb.com/guides/how-to-use-paper-wallet/",
  },
  {
    title: "How to Implement Smart Wallets",
    image: require("/public/assets/product-pages/smart-wallet/get-started.png"),
    link: "https://portal.thirdweb.com/smart-wallet/getting%20started",
  },
];

const EmbeddedWalletsLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Embedded Wallets for Every Web3 App",
        description:
          "Onboard any user with web2 login flows — using just an email, phone, or social account. Choose from non-custodial or custodial in-app wallets.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/embedded-wallets.png`,
              width: 1200,
              height: 630,
              alt: "Embedded Wallets for Every Web3 App",
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
          miniTitle="Embedded Wallets"
          title="The power of web3, "
          titleWithGradient="with web2 UX"
          subtitle="Give any user the keys to web3 with familiar web2 login flows. Choose from non-custodial or custodial solutions & enable users to sign in with an email, phone number, or social account."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/wallets/embedded"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          image={require("public/assets/product-pages/hero/desktop-hero-embedded-wallets.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-embedded-wallets.png")}
        />

        <LandingGridSection title={<></>}>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/wallets/icon-personalize.svg")}
            title="Every way to login"
            description="Choose from the largest selection of embedded wallet solutions & tailor it to your app — with support for email, smart, local, and server wallets."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/wallets/icon-email-signin.svg")}
            title="Login flows for every user"
            description="Auth for the most common web2 login flows — enabling users to onboard with just an email, phone number, social account, or passkeys."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/wallets/icon-secure.svg")}
            title="Complete key management"
            description="Determine how your users should manage their private keys, with non-custodial or custodial wallets. Build the most secure solution for your use case."
          />
        </LandingGridSection>
        <Flex flexDir="column" gap={6}>
          <LandingGridSection title={<></>}>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages-icons/wallets/icon-email-signin.svg")}
                title="Email and social authentication"
                description="Email log-in, social log-in, and bring your own auth."
              />
            </Card>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages-icons/wallets/icon-custom.svg")}
                title="Customizable branding"
                description="Fully customizable, choose your fonts, colors, and logos to make users' wallets indistinguishable from your app."
              />
            </Card>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages-icons/wallets/icon-verified.svg")}
                title="Account recovery"
                description="Users can access their accounts on authenticated devices."
              />
            </Card>
          </LandingGridSection>
          <SimpleGrid columns={{ base: 1, md: 6 }} gap={6}>
            <Card p={8} gridColumnStart={2} gridColumnEnd={4}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages-icons/wallets/icon-save.svg")}
                title="Gasless transactions"
                description="Users can interact with your app without paying for gas fees."
              />
            </Card>
            <Card p={8} gridColumnStart={4} gridColumnEnd={6}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages-icons/wallets/icon-private.svg")}
                title="Non-custodial"
                description="Using Multi-Party Computation (MPC), private key shard across (1) device, (2) emailed recovery password, and (3) login authentication."
              />
            </Card>
          </SimpleGrid>
        </Flex>

        <LandingGridSection
          desktopColumns={4}
          title={
            <LandingSectionHeading
              title="What You Can Build"
              blackToWhiteTitle=""
            />
          }
        >
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-email-signin.svg")}
              title="Web2 login flows"
              description="Enable your users to sign in with just an email, social login, or phone number — even if they've never created a wallet or purchased crypto before."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-efficient.svg")}
              title="Invisible wallet experiences"
              description="Enable gasless and signless transactions with in-app smart wallets (powered by ERC-4337) and remove any friction from your web3 app."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-guest.svg")}
              title="Continue as guest"
              description="Instantly onboard any user onto your app without a login process. Spin up wallets tied to your users' devices, which they can export at a later date or access using the same device."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/wallets/icon-smart-wallet.svg")}
              title="Build your own wallet experiences"
              description="Low-level tools with everything you need to build your own fully-featured wallets, from generating wallets on the backend to managing users' wallets including importing & exporting keys, saving keys to secure storage, and private key recovery."
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="Learn to build with in-app embedded wallets"
          category={TRACKING_CATEGORY}
          description="Tailor your app's onboarding & experience to your users"
          guides={GUIDES}
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/wallets/embedded"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
        />
      </Container>
    </LandingLayout>
  );
};

EmbeddedWalletsLanding.pageId = PageId.EmbeddedWalletsLanding;

export default EmbeddedWalletsLanding;

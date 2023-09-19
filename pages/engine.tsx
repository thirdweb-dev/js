import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Heading, Card } from "tw-components";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingSectionHeading } from "components/landing-pages/section-heading";

const TRACKING_CATEGORY = "engine-landing";

const EngineLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title:
          "The Blockchain API for Production-Grade Web3 Apps | thirdweb Engine",
        description:
          "Connect any app to the blockchain via API — with auth, smart contracts, wallets, gasless transactions, & managed infrastructure. Learn more.",
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
          miniTitle="thirdweb Engine"
          title="All-in-one API"
          titleWithGradient="for enterprise-grade Web3 apps"
          subtitle="Power your Web3 app with production-grade APIs, including auth, smart contracts, backend wallets, gasless transactions, and managed infrastructure."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://share.hsforms.com/1b5uu_0bSQ3GX5NCQyrIeGAea58c"
          ctaText="Get beta access"
          noContactUs={true}
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
          image={require("public/assets/product-pages/engine/desktop-hero.png")}
          mobileImage={require("public/assets/product-pages/engine/desktop-hero.png")}
        />
        <LandingGridSection
          desktopColumns={4}
          title={
            <Heading size="label.2xl" color="white">
              <Box
                bgGradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
                bgClip="text"
              >
                Connect your app to web3,
              </Box>{" "}
              without the complexity
            </Heading>
          }
        >
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-1.png")}
            title="Go to market faster"
            description="Save months of development time with solutions that work out-of-the-box and abstract away all of the blockchain complexity for you."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-2.png")}
            title="Cross-chain EVM support"
            description="Launch your web3 app on any (or many) chains. Don't lock your users into one network — unlock ultimate cross-chain flexibility with support for any EVM."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-7.png")}
            title="Scale to billions"
            description="Nonce, key and fund management handled for you. Scale your app without sacrificing performance or security."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/loyalty/icon-3.png")}
            title="Secure and reliable"
            description="Best-in-class security for your users and 99.9% infrastructure uptime."
          />
        </LandingGridSection>

        <Flex flexDir="column" gap={6}>
          <LandingGridSection
            title={
              <LandingSectionHeading
                title="Solutions for every web3-powered feature in your app"
                blackToWhiteTitle=""
              />
            }
          >
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages/engine/wallet-management.png")}
                title="Wallet Management"
                description="Create backend wallets, store keys securely, sign & send transactions, and move funds at scale with nonce management."
              />
            </Card>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages/engine/account-abstraction.png")}
                title="Account Abstraction"
                description="Create managed smart wallets with shared custody between the backend wallet & a user's EOA wallet."
              />
            </Card>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages/engine/smart-contracts.png")}
                title="Smart Contracts"
                description="Deploy, read, & write to any smart contract across any EVM-compatible blockchain — and build with thirdweb's audited smart contracts."
              />
            </Card>
          </LandingGridSection>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages/engine/web3-auth.png")}
                title="Web3 Auth"
                description="Create permissions to enable users' wallets to directly interact with certain endpoints on the thirdweb Engine."
              />
            </Card>
            <Card p={8}>
              <LandingIconSectionItem
                icon={require("public/assets/product-pages/engine/gasless-transactions.png")}
                title="Gasless Transactions"
                description="Onboard users in an instant & create seamless web3 UX by sponsoring gas fees — for any & all transactions."
              />
            </Card>
          </SimpleGrid>
        </Flex>

        <LandingEndCTA
          title="Start building with"
          titleWithGradient="thirdweb Engine."
          trackingCategory={TRACKING_CATEGORY}
          ctaText="Get beta access"
          ctaLink="https://share.hsforms.com/1b5uu_0bSQ3GX5NCQyrIeGAea58c"
          noContactUs={true}
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
        />
      </Container>
    </LandingLayout>
  );
};

EngineLanding.pageId = PageId.EngineLanding;

export default EngineLanding;

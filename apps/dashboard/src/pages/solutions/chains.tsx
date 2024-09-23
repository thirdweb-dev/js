import { Box, Container, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { Gradients } from "components/landing-pages/gradients";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingPlan } from "components/landing-pages/plan";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Text, TrackedLink, TrackedLinkButton } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "chains-landing";

const SolutionsChains: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Instant Devtools & Infrastructure on your Chain",
        description:
          "The easiest way for developers to build apps on your EVM chain — with the complete web3 development stack: wallets, contracts, payments, & infra.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/chains-solutions.png`,
              width: 1200,
              height: 630,
              alt: "Developer Tools & Infrastructure on your Chain",
            },
          ],
        },
      }}
      py={0}
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
          gap={{ base: "60px", md: "180px" }}
        >
          <LandingHeroWithSideImage
            miniTitle="Chains"
            miniImage={require("../../../public/assets/solutions-pages/chains/mini-icon.png")}
            title="Bring developers & apps"
            titleWithGradient="to your chain"
            subtitle="Full-stack web3 development tools, production-grade infrastructure, and thirdweb's resources — so that developers can build on your chain, from day one."
            trackingCategory={TRACKING_CATEGORY}
            ctaLink="/contact-us"
            noContactUs
            gradient="linear(to-r,  #F856C8, #F856C8)"
            ctaText="Contact Us"
            image={require("../../../public/assets/product-pages/hero/desktop-hero-chains.png")}
            mobileImage={require("../../../public/assets/product-pages/hero/mobile-hero-chains.png")}
          />

          <Flex position="relative" width="full" flexDir="column" gap="80px">
            <LandingSectionHeading
              title="Accelerate your L2, L3, or appchain"
              blackToWhiteTitle=""
            />

            <Box zIndex={1} position="relative">
              <LandingGridSection>
                <LandingIconSectionItem
                  icon={require("../../../public/assets/solutions-pages/chains/stack.svg")}
                  bg="rgba(15, 12, 22, 0.80)"
                  title="Grow your ecosystem from day one"
                  description="Empower developers on your chain with frontend, backend, and onchain tools for full-stack web3 apps — from day one."
                  descriptionColor="white"
                />
                <LandingIconSectionItem
                  icon={require("../../../public/assets/solutions-pages/chains/rocket.svg")}
                  bg="rgba(15, 12, 22, 0.80)"
                  title="Let us handle your infrastructure"
                  description="Get account abstraction infrastructure, fiat & crypto payments, RPCs with high limits, and more — from one platform."
                  descriptionColor="white"
                />
                <LandingIconSectionItem
                  icon={require("../../../public/assets/solutions-pages/chains/pencil.svg")}
                  bg="rgba(15, 12, 22, 0.80)"
                  title="Tap into our resources & expertise"
                  description="Get featured placements on our Chainlist, custom technical documentation, and priority support with 24-hour SLAs."
                  descriptionColor="white"
                />
              </LandingGridSection>
            </Box>
          </Flex>

          <Flex width="full" flexDir="column" gap="80px">
            <LandingSectionHeading
              title="Unlock your chain's full potential"
              blackToWhiteTitle=""
            />

            <LandingGridSection desktopColumns={2}>
              <LandingPlan
                title="Open-Source Developer Tools"
                description="Support for thirdweb products with public infrastructure."
                list={[
                  {
                    id: "smart-contract",
                    description: "Smart Contract Deployment",
                  },
                  {
                    id: "cross-platform",
                    description: "Cross-Platform Connect Integration",
                  },
                  {
                    id: "in-app",
                    description: "In-App Wallets: Email, Social, Phone",
                  },
                  {
                    id: "engine",
                    description:
                      "thirdweb Engine: Backend Wallets & Nonce Management",
                  },
                  {
                    id: "chainlist",
                    description: (
                      <Text key="chainlist" size="body.lg" color="#B1B1B1">
                        Added to
                        <TrackedLink
                          href="/chainlist"
                          isExternal
                          category={TRACKING_CATEGORY}
                          label="thirdweb_chainlist"
                          textDecoration="underline"
                        >
                          thirdweb Chainlist
                        </TrackedLink>
                      </Text>
                    ),
                  },
                ]}
                trackingCategory={TRACKING_CATEGORY}
              />

              <LandingPlan
                active
                title="Managed Ecosystem Services"
                description="Full-stack development tools & production-ready infra."
                listTitle="Everything in the Open-Source tier, plus:"
                list={[
                  {
                    id: "aa",
                    description:
                      "Account Abstraction Infrastructure: Smart Accounts, Bundler, Paymaster",
                  },
                  {
                    id: "scale",
                    description:
                      "Point-of-sale tools for fiat & crypto payments with onramp, swapping, & bridging",
                  },
                  {
                    id: "uptime",
                    description: "99.9% Infrastructure uptime SLAs",
                  },
                  { id: "sla", description: "24 hour customer support SLAs" },
                  {
                    id: "channel",
                    description: "Dedicated Slack support channel",
                  },
                  {
                    id: "premium",
                    description: "Premium placements for your chain",
                  },
                  {
                    id: "indexer",
                    description: "thirdweb Indexer (Coming in Q2)",
                  },
                ]}
                btnTitle="Contact us"
                btnHref="https://share.hsforms.com/19M7W6QqDTGacrTRBC3Me_Aea58c"
                trackingCategory={TRACKING_CATEGORY}
              />
            </LandingGridSection>
          </Flex>

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
                  title="Your chain's application layer, solved"
                  blackToWhiteTitle=""
                />
              </Box>
            }
            desktopColumns={4}
          >
            <LandingCardWithImage
              title="Connect"
              description="The complete web3 wallet toolkit — with Connect Wallet UI components, embedded wallets, auth, and account abstraction out of the box.​"
              image={require("../../../public/assets/landingpage/account-abstraction-desktop.png")}
              mobileImage={require("../../../public/assets/landingpage/account-abstraction-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/connect"
              cardBg="#131418"
              direction="horizontal"
            />

            <LandingCardWithImage
              title="Smart Contracts"
              description="Deploy, read, & write to any smart contract across any EVM-compatible blockchain — and build with thirdweb's audited smart contracts."
              image={require("../../../public/assets/landingpage/smart-contract-audits-desktop.png")}
              mobileImage={require("../../../public/assets/landingpage/smart-contract-audits-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/contracts"
              cardBg="#131418"
            />

            <LandingCardWithImage
              title="Payments"
              description="Point-of-sale tools for fiat & crypto payments — with onramp, swapping, & bridging."
              image={require("../../../public/assets/landingpage/fee-desktop.png")}
              mobileImage={require("../../../public/assets/landingpage/fee-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/connect/pay/buy-with-crypto"
              cardBg="#131418"
              colSpan={1}
            />
            <LandingCardWithImage
              title="Infrastructure"
              description="Built-in infrastructure so you don't have to worry about RPCs, storage, bundlers or paymasters — or bring your own providers."
              image={require("../../../public/assets/landingpage/infastructure-desktop.png")}
              mobileImage={require("../../../public/assets/landingpage/infastructure-mobile.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="/engine"
              cardBg="#131418"
              direction="horizontal"
            />
            <LandingCardWithImage
              title="Account Abstraction"
              description="Smart accounts for gasless transactions and managed infrastructure with bundler & paymaster."
              image={require("../../../public/assets/landingpage/aa-desktop.png")}
              mobileImage={require("../../../public/assets/landingpage/aa-desktop.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/connect/account-abstraction/overview"
              cardBg="#131418"
              colSpan={1}
            />
          </LandingGridSection>

          <Flex width="full" flexDir="column" gap="80px">
            <LandingSectionHeading
              title="thirdweb drives transactions"
              blackToWhiteTitle=""
            />
            <ChakraNextImage
              src={require("../../../public/assets/landingpage/transactions.png")}
              alt="test"
            />
          </Flex>

          <Flex flexDirection="column" alignItems="center">
            <LandingEndCTA
              title="More developers, more users"
              description="Grow your ecosystem with full-stack tools for developers, production-grade infrastructure, and thirdweb's resources & expertise — from day one."
              titleWithGradient=""
              colorDescription="#fff"
              containerMaxW="900px"
              trackingCategory={TRACKING_CATEGORY}
              ctaLink="https://portal.thirdweb.com/unity"
              gradient="linear(to-r, #F213A4, #F97CCE)"
              noCta
              noContactUs
              customEndCta={
                <Flex alignItems="center" justifyContent="center">
                  <TrackedLinkButton
                    width="full"
                    maxW="244px"
                    colorScheme="primary"
                    category={TRACKING_CATEGORY}
                    label="contact_us_end_cta"
                    href="https://share.hsforms.com/19M7W6QqDTGacrTRBC3Me_Aea58c"
                    borderRadius="lg"
                    py={6}
                    px={6}
                    bgColor="white"
                    _hover={{
                      bgColor: "white",
                      opacity: 0.8,
                    }}
                    size="md"
                    color="black"
                  >
                    Contact Us
                  </TrackedLinkButton>
                </Flex>
              }
            />
          </Flex>
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

SolutionsChains.pageId = PageId.SolutionsChains;

export default SolutionsChains;

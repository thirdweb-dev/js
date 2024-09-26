import { Container, Flex, Icon } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { ContractInteractionSection } from "components/contracts/ContractInteractionSection";
import LandingCaseStudyStaticSection from "components/contracts/LandingCaseStudyStaticSection";
import Stats from "components/contracts/Stats";
import { LandingCardWithImage } from "components/landing-pages/card-with-image";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { Heading, Text, TrackedLinkButton } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "contracts";

const caseStudies = [
  {
    title: "Build an NFT drop",
    description:
      "Build a drop where users can claim NFTs. Determine who and when can claim the drop and configure advanced features such as delayed reveal.",
    image: require("../../public/assets/contracts/build-nft-drop.png"),
    label: "build-nft",
    href: "/explore/nft",
  },
  {
    title: "Build a marketplace",
    description:
      "Build an NFT marketplace where users can buy, sell or trade digital assets with crypto or fiat currency.",
    image: require("../../public/assets/contracts/build-marketplace.png"),
    label: "build-marketplace",
    href: "/explore/marketplace",
  },
  {
    title: "Build a token airdrop",
    description: "Let users claim an allocation of ERC20 tokens.",
    image: require("../../public/assets/contracts/build-token-airdrop.png"),
    label: "token-airdrop",
    href: "/explore/airdrop",
  },
  {
    title: "Build a loyalty program with evolving NFTs",
    description:
      "Give your loyal customers an NFT that evolves based on other asset holdings in user's wallet. Create an NFT that dynamically updates through different membership tiers.",
    image: require("../../public/assets/contracts/build-loyalty-program.png"),
    label: "build-loyalty",
    href: "/thirdweb.eth/LoyaltyCard",
  },
];

export const metrics = [
  {
    title: "Onchain Summer",
    description:
      "Powering an onchain festival to celebrate the launch of Base Mainnet – with daily mints in collaboration with 50+ of the world's leading brands, creators, & artists.",
    image: require("../../public/assets/landingpage/case-study-onchain-summer.png"),
    mobileImage: require("../../public/assets/landingpage/case-study-onchain-summer.png"),
    items: [
      {
        title: "$2.4M+",
        description: "For Creators",
      },
      {
        title: "25%",
        description: "Active Wallets on Base",
        colSpan: 2,
      },
      {
        title: "1M+",
        description: "Transactions",
      },
    ],
    href: "https://twitter.com/thirdweb/status/1719736720865001723",
    hoverBackground: "#0053FF",
  },
  {
    title: "Pixels",
    description:
      "Building a thriving in-game economy with VIP memberships, in-game tokens, and digital assets that users own — all onchain.",
    image: require("../../public/assets/landingpage/pixels.png"),
    mobileImage: require("../../public/assets/landingpage/mobile-pixels.png"),
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
    href: "https://blog.thirdweb.com/case-studies/pixels-builds-an-onchain-ecosystem-for-its-web3-game",
    hoverBackground: "#622AFF",
  },
  {
    title: "Layer3",
    description:
      "Creating the most engaging way to explore crypto — with gamified experiences, immersive quests, and NFT rewards.",
    image: require("../../public/assets/landingpage/case-study-layer3.png"),
    mobileImage: require("../../public/assets/landingpage/case-study-layer3.png"),
    items: [
      {
        title: "16.7M+",
        description: "Transactions",
      },
      {
        title: "685K+",
        description: "Total Users",
        colSpan: 2,
      },
      {
        title: "20+",
        description: "Chains",
      },
    ],
    href: "https://blog.thirdweb.com/case-studies/layer3-powers-web3-adoption-through-gamified-experiences-nft-rewards/",
    hoverBackground: "#FEA421",
  },
];

const Contracts: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "A Complete Toolkit for Smart Contract Development",
        description:
          "Everything you need to build, deploy, & integrate smart contracts into your app. Browse audited, modular contracts & deploy to any EVM chain.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/contracts.png`,
              width: 1200,
              height: 630,
              alt: "thirdweb Smart Contracts",
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
          titleWithGradient="for smart contract development"
          miniTitle="Contracts"
          title="End-to-end tools"
          subtitle="Trusted and modular smart contracts that can be deployed securely on any EVM chain."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/explore"
          ctaText="Get started"
          contactUsTitle="Book a demo"
          gradient="linear(to-r, #F97CCE, #F213A4)"
          image={require("../../public/assets/product-pages/contracts/desktop-hero.png")}
          mobileImage={require("../../public/assets/product-pages/contracts/mobile-hero.png")}
          miniImage={require("../../public/assets/product-icons/contracts.png")}
        />

        <Stats
          stats={[
            { title: "2M+", description: "smart contracts deployed" },
            { title: "1M+", description: "monthly transactions" },
            { title: "1,000+", description: "EVM chains" },
          ]}
        />

        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          gap="27px"
        >
          <Heading fontSize={[30, 40]} color="white" textAlign="center">
            Any smart contract, on any EVM chain
          </Heading>

          <Text fontSize={[16, 20]} textAlign="center" maxW="720px">
            Explore & extend our library of audited, modular smart contracts —
            and deploy to any EVM chain in seconds.
          </Text>

          <ChakraNextImage
            src={require("../../public/assets/contracts/mobile-any-smart-contract.png")}
            display={{ base: "flex", md: "none" }}
            mt="32px"
            alt=""
          />

          <Flex
            flexDir="column"
            alignItems="center"
            position="relative"
            gap="68px"
            mt="48px"
            display={{ base: "none", md: "flex" }}
          >
            <ChakraNextImage
              src={require("../../public/assets/contracts/contracts-scroll.png")}
              alt=""
            />

            <ChakraNextImage
              src={require("../../public/assets/contracts/icons-scroll.png")}
              alt=""
            />
          </Flex>

          <TrackedLinkButton
            leftIcon={<Icon as={BsFillLightningChargeFill} boxSize={4} />}
            py={6}
            px={8}
            bgColor="white"
            _hover={{
              bgColor: "white",
              opacity: 0.8,
            }}
            mt={{ base: 2, md: 16 }}
            color="black"
            href="/explore"
            category={TRACKING_CATEGORY}
            label="explore"
            fontWeight="bold"
          >
            Explore contracts
          </TrackedLinkButton>
        </Flex>

        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          gap="27px"
        >
          <Heading fontSize={[30, 40]} color="white" textAlign="center">
            Build with a powerful Solidity SDK
          </Heading>

          <Text fontSize={[16, 20]} textAlign="center" maxW="720px">
            The complete Solidity toolkit to build custom smart contracts, with
            a set of pre-built base contracts and extensions.
          </Text>

          <ContractInteractionSection />
          <ChakraNextImage
            src={require("../../public/assets/contracts/mobile-complete-solidity.png")}
            priority
            alt=""
            display={{ base: "inline", md: "none" }}
          />
        </Flex>

        <LandingGridSection desktopColumns={4}>
          <LandingCardWithImage
            title="Integrate contracts into your app"
            description="The complete toolkit to add any smart contract into your app — and call functions for any type of onchain interaction."
            image={require("../../public/assets/contracts/integrate-contracts.png")}
            mobileImage={require("../../public/assets/contracts/mobile-integrate-contracts.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/contracts"
          />
          <LandingCardWithImage
            title="Contracts for every use case"
            description="Browse contracts from the world's leading web3 developers — for NFTs, marketplaces, smart accounts, staking, & more."
            image={require("../../public/assets/contracts/discover-idea.png")}
            mobileImage={require("../../public/assets/contracts/mobile-discover-idea.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/explore"
          />
          <LandingCardWithImage
            title="Ship onchain faster"
            description="Reduce development time with pre-built contracts — or use our SDK to build custom contracts with advanced features."
            image={require("../../public/assets/contracts/ship-faster.png")}
            mobileImage={require("../../public/assets/contracts/mobile-ship-faster.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="https://portal.thirdweb.com/contracts"
            colSpan={1}
          />

          <LandingCardWithImage
            title="Deploy with peace of mind"
            description="Deploy securely from our dashboard: No need to share private keys, copy-paste ABIs, or deal with insecure & unfunded private keys required with local deploys."
            image={require("../../public/assets/contracts/full-chargeback-protection.png")}
            mobileImage={require("../../public/assets/contracts/mobile-full-chargeback-protection.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/contracts/deploy"
            colSpan={2}
          />
          <LandingCardWithImage
            title="Onchain insights"
            description="Get onchain data & understand activity on your smart contracts with an easy-to-use analytics dashboard."
            image={require("../../public/assets/contracts/onchain-insights.png")}
            mobileImage={require("../../public/assets/contracts/mobile-onchain-insights.png")}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            href="/dashboard/contracts/deploy"
            colSpan={1}
          />
        </LandingGridSection>

        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          gap="27px"
        >
          <LandingCaseStudyStaticSection
            TRACKING_CATEGORY={TRACKING_CATEGORY}
            studies={caseStudies}
          />
        </Flex>

        <LandingCardWithMetrics
          title={
            <div className="flex flex-col items-center justify-center text-center">
              <Heading size="display.sm" color="white">
                Trusted by the best
              </Heading>

              <Text fontSize={[16, 20]} mt={6}>
                Powering web3 apps across verticals — from onchain games to
                creator platforms.
              </Text>
            </div>
          }
          desktopColumns={3}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          metrics={metrics}
        />
        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/contracts/deploy/overview"
          gradient="linear(to-r, #F213A4, #F97CCE)"
        />
      </Container>
    </LandingLayout>
  );
};

Contracts.pageId = PageId.ContractsLanding;

export default Contracts;

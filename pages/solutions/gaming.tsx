import { Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHero } from "components/landing-pages/hero";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingOptionSelector } from "components/landing-pages/option-selector";
import { ImageCard } from "components/product-pages/common/ImageCard";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card, Heading, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "gaming_kit";

const CASE_STUDIES = [
  {
    title:
      "Heroic Story Uses Dynamic NFTs to Build a Web3, Free-to-Own MMORPG Fantasy Game",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/Heroic-Story-thumbnail-2.png",
    link: "https://blog.thirdweb.com/case-studies/heroic-story-uses-dynamic-nfts-to-build-a-web3-free-to-own-mmorpg-fantasy-game/",
  },
  {
    title: "Pixels Builds an On-Chain Ecosystem for its Open-World Web3 Game",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/04/Pixels-Builds-an-Onchain-Ecosystem-for-its-Web3-Game-thirdweb-Case-Study.png",
    link: "https://blog.thirdweb.com/case-studies/pixels-builds-an-onchain-ecosystem-for-its-web3-game/",
  },
  {
    title:
      "Fractal, web3 Gaming Platform and Marketplace for the Best Blockchain Games, Expands to EVM Chains",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/Fractal.png",
    link: "https://blog.thirdweb.com/case-studies/fractal-web3-gaming-platform-and-marketplace-for-blockchain-games-expands-to-evm-chains/",
  },
];

const SELECTOR_ITEMS = [
  {
    title: "Frictionless onboarding experience",
    description:
      "Get users onboarded quickly with familiar email and social log-ins— we create game wallets on behalf of users.  Purchases can be made via credit card, Apple/Google Pay.",
    steps: [
      "User sign-in to app with their email or social log-in",
      "Wallet is created on behalf of the user abstracting away crypto entirely",
      "User interacts with app seamlessly— without disruptive transaction pop-ups",
    ],
    products: ["connect", "embedded-wallets", "smart-wallet", "nft-checkout"],
  },
  {
    title: "Uninterrupted game play",
    description:
      "Give users uninterrupted game play by removing disruptive transaction pop-ups.  Generate on-chain transactions reliably and at scale on behalf of users.",
    steps: [
      "User completes a level in game and is rewarded with an in-game digital asset",
      "Developer sponsors the transaction so that user does not have to pay for gas fees",
      "User receives in-game asset without any interruption to game play",
    ],
    products: [
      "embedded-wallets",
      "smart-wallet",
      "sponsored-transactions",
      "engine",
    ],
  },
  {
    title: "Subscription and All Access passes",
    description:
      "Create digital loyalty passes that provide access to early gameplay content, exclusive NFT drops, and in-game boosts",
    steps: [
      "User selects a digital loyalty pass NFT when they login",
      "Loyalty pass is used to unlock in-game experiences",
      "User collects rewards to upgrade their loyalty pass",
    ],
    products: ["explore", "interact", "nft-checkout"],
  },
  /* {
    title: "Add web3 to web2 game",
    description: "Easily integrate new web3 features into your existing application infrastructure using reusable UI components, SDK's and minting API's.",
    steps: ["", "", ""],
    products: ["connect", "auth", "interact", "engine", "sponsored-transactions", "nft-checkout"],
  }, */
  {
    title: "Interoperable game ecosystems",
    description:
      "Give a unified interface to users to login across your gaming ecosystem with the flexibility to import/export their digital assets",
    steps: [
      "User logs in using existing game login",
      "Game links User's gaming wallet to game issued Smart Wallet",
      "User selects assets they want to import and gives game scoped access to use assets for duration of game play",
    ],
    products: ["auth", "smart-wallet", "engine"],
  },
  {
    title: "Game appchain",
    description:
      "Connect seamlessly to any EVM compatible L1, L2 blockchains as well as build your game on your own app chain.",
    steps: [
      "Game devs can add their app chain to thirdweb Dashboard and SDK's",
      "An app chain landing page is generated with links to SDKs, contract deployment and infrastructure for their app chain",
      "Developers can easily deploy contracts to their app chain in just a few clicks and get code snippets to integrate contracts into their games",
    ],
    products: ["rpc-edge", "explore", "interact", "engine"],
  },
  {
    title: "Marketplace for digital assets",
    description:
      "Generate revenue through the launch of your own on-chain marketplace",
    steps: [
      "Deploy marketplace contract",
      "Set % platform fee (% collected by game dev on every in-game asset sale, e.g. when buyer buys tokens from listing)",
      "Players can list and trade NFTs for sale at a fixed price",
    ],
    products: ["explore", "interact", "nft-checkout", "engine", "storage"],
  },
];

const SolutionsGaming: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Build blockchain games on any platform",
        description:
          "Add web3 features to your game on all platforms, including: Native, Mobile, Console, Browser and VR.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/gaming-solutions.png`,
              width: 1200,
              height: 630,
              alt: "thirdweb gaming",
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
        <LandingHero
          title="Build blockchain games"
          titleWithGradient="on any platform"
          subtitle="Add web3 features to your game on all platforms, including: Native, Mobile, Console, Browser and VR."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/gamingkit"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          image={require("public/assets/product-pages/hero/desktop-hero-gaming.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-gaming.png")}
          contactUsTitle="Book Demo"
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-fee.svg")}
            title="Unlock new revenue streams"
            description="Primary sales and royalty fees from secondary sales for in-game assets represented as NFTs."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-scale.svg")}
            title="Increase user retention"
            description="Reward your players with in game currency and digital assets."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-guest.svg")}
            title="Engage with your community"
            description="Enable access to other games within the studio seamlessly by creating an immersive ecosystem."
          />
        </LandingGridSection>
        <Flex alignItems="center" flexDirection="column">
          <Heading
            as="h2"
            size="display.sm"
            textAlign="center"
            mb={12}
            maxW={800}
          >
            Create new gaming universes
          </Heading>
          <SimpleGrid
            justifyContent="flex-start"
            w={{ base: "100%", md: "60%" }}
            columns={{ base: 1, md: 2 }}
            gap={{ base: 12, md: 6 }}
          >
            <ImageCard
              title="Cat Attack Mobile"
              image={require("/public/assets/solutions-pages/gaming/catattack-square.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://catattack.thirdweb.com"
            >
              Viral web3 mobile game Cat Attack built in just 2 days using
              thirdweb.
            </ImageCard>
            <ImageCard
              title="Web3 Warriors"
              image={require("/public/assets/solutions-pages/gaming/web3warriors.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://web3warriors.thirdweb.com"
            >
              An Onchain Survival Game. Escape the dungeon by battling
              terrifying bosses.
            </ImageCard>
          </SimpleGrid>
        </Flex>
        <LandingOptionSelector
          items={SELECTOR_ITEMS}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          blackToWhiteTitle=""
          title="What You Can Build"
        />

        <LandingGridSection>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-tool.svg")}
              title="APIs"
              description="Unity and Unreal SDK support."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-smart-wallet.svg")}
              title="Connect"
              description="Onboard all of your users with a beautiful Connect Wallet modal, flexible sign-in options for web2 & web3, and powerful hooks for full customizability."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-email-signin.svg")}
              title="Embedded Wallet"
              description="Give any user the keys to web3 with familiar web2 login flows. Choose from non-custodial or custodial solutions & enable users to sign in with an email, phone number, or social account."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-verified.svg")}
              title="Smart Wallet"
              description="Transform your app's user experience with signless transactions, multi-signature security, account recovery and more."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-credit.svg")}
              title="NFT Checkout"
              description="Let users buy digital assets with a credit card, via a one-click checkout flow. Onboard anyone, even if they've never create a wallet or bought crypto before."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-fee.svg")}
              title="Sponsored Transactions"
              description="Create seamless web3 UX by sponsoring users' gas fees — for any & all transactions. No more disruptive transaction popups or bridging & swapping funds."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-build.svg")}
              title="Engine"
              description={
                <>
                  Power your Web3 app with production-grade APIs, including
                  auth, smart contracts, backend wallets, gasless transactions,
                  and managed infrastructure.{" "}
                  <TrackedLink
                    category={TRACKING_CATEGORY}
                    href="https://share.hsforms.com/1b5uu_0bSQ3GX5NCQyrIeGAea58c"
                    color="primary.500"
                  >
                    Get beta access
                  </TrackedLink>
                  .
                </>
              }
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-verified-user.svg")}
              title="Auth"
              description="Easy auth for the most popular web3 wallets and web2 login flows — so you can verify your users' identities & prove wallet ownership to off-chain systems."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-tool.svg")}
              title="Interact"
              description="The complete toolkit to add any smart contract into your apps — and call functions for any type of onchain interaction."
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="The best web3 apps use thirdweb's smart contract tools"
          category={TRACKING_CATEGORY}
          description="Seamlessly integrate your smart contracts into any app so you can focus on building a great user experience."
          guides={CASE_STUDIES}
          caseStudies
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/gamingkit"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          contactUsTitle="Book Demo"
        />
      </Container>
    </LandingLayout>
  );
};

SolutionsGaming.pageId = PageId.SolutionsGaming;

export default SolutionsGaming;

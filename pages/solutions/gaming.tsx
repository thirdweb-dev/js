import { Center, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import LandingCardWithMetrics from "components/landing-pages/card-with-metrics";
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
import { ReactNode } from "react";
import { Card, CardProps, Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "gaming_kit";

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

export const metrics = [
  {
    title: "Pixels",
    description:
      "Creating an open-world web3 game with a thriving ecosystem — with in-game tokens, VIP memberships, and digital assets that users own onchain.",
    image: require("public/assets/landingpage/pixels.png"),
    mobileImage: require("public/assets/landingpage/mobile-pixels.png"),
    items: [],
    href: "https://blog.thirdweb.com/case-studies/pixels-builds-an-onchain-ecosystem-for-its-web3-game",
    hoverBackground: "#622AFF",
  },
  {
    title: "Gala Games",
    description:
      "Partnering with DreamWorks to integrate their brand IP into the VOXverse — and bringing fans onchain with interoperable digital collectibles.",
    image: require("/public/assets/solutions-pages/gaming/case-study-gala.png"),
    mobileImage: require("/public/assets/solutions-pages/gaming/mobile-case-study-gala.png"),
    items: [],
    href: "https://blog.thirdweb.com/case-studies/dreamworks-launches-nft-avatars-for-web3-games-with-gala-and-the-sims-creators-voxverse/",
    hoverBackground: "#0053FF",
  },
  {
    title: "Paima Studios",
    description:
      "Bringing onchain games to all players — with instant onboarding, an `invisible` wallet experience, and the smoothest gameplay with signless & gasless UX.",
    image: require("/public/assets/solutions-pages/gaming/case-study-ztx.png"),
    mobileImage: require("/public/assets/solutions-pages/gaming/mobile-case-study-ztx.png"),
    items: [],
    href: "https://paimastudios.com",
    hoverBackground: "#00B477",
  },
];

const SolutionsGamingCard = ({
  children,
  href,
  label,
  ...rest
}: { children: ReactNode; href: string; label: string } & CardProps) => {
  return (
    <TrackedLink
      category={TRACKING_CATEGORY}
      href={href}
      label={label}
      isExternal
      color="blue.400"
      _hover={{ textDecor: "none" }}
      role="group"
      h="full"
      textDecoration="none"
    >
      <Card
        p={8}
        transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
        _hover={{
          borderColor: "blue.500",
          boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
          transform: "scale(1.01)",
        }}
        cursor="pointer"
        h="full"
        {...rest}
      >
        {children}
      </Card>
    </TrackedLink>
  );
};

const SolutionsGaming: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "The complete stack for scalable web3 games",
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
          title="The complete stack for"
          titleWithGradient="scalable web3 games"
          subtitle="Everything you need to build seamless onchain games with web3-powered features — on Unity, Unreal Engine, & any platform."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/gaming"
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
            Build games on any platform
          </Heading>
          <SimpleGrid
            justifyContent="flex-start"
            columns={{ base: 1, md: 3 }}
            gap={{ base: 12, md: 6 }}
          >
            <ImageCard
              title="Unity"
              image={require("/public/assets/solutions-pages/gaming/gaming-unity.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/unity"
              linkTitle="Read the Unity SDK docs"
              label="unity"
            />
            <ImageCard
              title="Unreal Engine"
              image={require("/public/assets/solutions-pages/gaming/gaming-unreal.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/gaming/unreal-engine"
              linkTitle="Read the Unreal Engine docs"
              label="unreal"
            />
            <ImageCard
              title="Mobile"
              image={require("/public/assets/solutions-pages/gaming/gaming-phone.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              linkTitle="Read the React Native docs"
              href="https://portal.thirdweb.com/react-native"
              label="mobile"
            />
          </SimpleGrid>
        </Flex>

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
            columns={{ base: 1, md: 3 }}
            gap={{ base: 12, md: 6 }}
          >
            <ImageCard
              title="Web3 Warriors"
              image={require("/public/assets/solutions-pages/gaming/web3warriors.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://web3warriors.thirdweb.com"
              category="Unity"
              linkTitle="Play Web3 Warriors"
              label="web3warriors"
            >
              A full-scale action RPG — built in 3 weeks using thirdweb&apos;s
              Unity SDK.
            </ImageCard>

            <ImageCard
              title="Cat Attack"
              image={require("/public/assets/solutions-pages/gaming/catattack-square.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://catattack.thirdweb.com"
              category="Mobile"
              linkTitle="Play Cat Attack"
              label="cat-attack"
            >
              A simple web3 mobile game — gone viral & built in 2 days using
              thirdweb.
            </ImageCard>

            <ImageCard
              title="Play Speed Racer"
              image={require("/public/assets/solutions-pages/gaming/gaming-speed-racer.png")}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/gaming/unreal-engine"
              category="Unreal Engine"
              linkTitle="Play Speed Racer"
              label="speed-racer"
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

        <LandingGridSection
          title={
            <Center flexDir="column" textAlign="center">
              <Heading size="display.sm" color="white">
                The complete stack for web3 games
              </Heading>

              <Text size="body.lg" mt={6}>
                Everything you need to build full-featured onchain games.
              </Text>
            </Center>
          }
        >
          <SolutionsGamingCard
            p={8}
            label="unreal"
            href="https://portal.thirdweb.com/gaming"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-tool.svg")}
              title="SDKs & APIs"
              description="Integrate web3-powered features into your game with best-in-class SDKs and APIs for any platform — including Unity & Unreal Engine."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="connect-wallet"
            href="https://thirdweb.com/connect"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-smart-wallet.svg")}
              title="Connect"
              description="Onboard all of your users with a beautiful Connect Wallet modal, flexible sign-in options for web2 & web3, and powerful hooks for full customizability."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="embedded-wallet"
            href="https://thirdweb.com/embedded-wallets"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-email-signin.svg")}
              title="Embedded Wallet"
              description="Give any user the keys to web3 with familiar web2 login flows. Choose from non-custodial or custodial solutions & enable users to sign in with an email, phone number, or social account."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="smart-wallet"
            href="https://thirdweb.com/account-abstraction"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-verified.svg")}
              title="Smart Wallet"
              description="Transform your app's user experience with signless transactions, multi-signature security, account recovery and more."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="unreal"
            href="https://thirdweb.com/checkout"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-credit.svg")}
              title="NFT Checkout"
              description="Let users buy digital assets with a credit card, via a one-click checkout flow. Onboard anyone, even if they've never create a wallet or bought crypto before."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="sponsored-transaction"
            href="https://thirdweb.com/sponsored-transactions"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-fee.svg")}
              title="Sponsored Transactions"
              description="Create seamless web3 UX by sponsoring users' gas fees — for any & all transactions. No more disruptive transaction popups or bridging & swapping funds."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="api"
            href="https://thirdweb.com/engine"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-build.svg")}
              title="Engine"
              description="Power your Web3 app with production-grade APIs, including
              auth, smart contracts, backend wallets, gasless transactions,
              and managed infrastructure."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="web3-wallets"
            href="https://thirdweb.com/connect"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-verified-user.svg")}
              title="Auth"
              description="Easy auth for the most popular web3 wallets and web2 login flows — so you can verify your users' identities & prove wallet ownership to off-chain systems."
            />
          </SolutionsGamingCard>
          <SolutionsGamingCard
            p={8}
            label="smart-contract"
            href="https://thirdweb.com/explore"
          >
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-tool.svg")}
              title="Interact"
              description="The complete toolkit to add any smart contract into your apps — and call functions for any type of onchain interaction."
            />
          </SolutionsGamingCard>
        </LandingGridSection>

        <LandingCardWithMetrics
          title={
            <Center flexDir="column" textAlign="center">
              <Heading size="display.sm" color="white">
                Trusted by the best
              </Heading>

              <Text size="body.lg" mt={6}>
                Powering web3 apps across verticals — from onchain games to
                creator platforms.
              </Text>
            </Center>
          }
          desktopColumns={3}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          metrics={metrics}
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/gaming"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          contactUsTitle="Book Demo"
        />
      </Container>
    </LandingLayout>
  );
};

SolutionsGaming.pageId = PageId.SolutionsGaming;

export default SolutionsGaming;

import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHero } from "components/landing-pages/hero";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingOptionSelector } from "components/landing-pages/option-selector";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "web2-onboarding-landing";

const GUIDES = [
  {
    title: "Set Up Gasless Transactions with OpenZeppelin Defender",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Learn-how-to--set-up-gasless-transactions-2.png",
    link: "https://blog.thirdweb.com/guides/setup-gasless-transactions/",
  },
  {
    title: "How to accept credit card payments for your NFT drop",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-3.png",
    link: "https://blog.thirdweb.com/guides/accept-credit-card-payments/",
  },
];

const SELECTOR_ITEMS = [
  {
    title: "Fiat on and off ramp",
    description:
      "Enable users to easily purchase NFTs and tokens with their credit card.",
    steps: [
      "Developer registers the contract to make it payment-enabled.",
      "Developer has the option of creating either a shareable checkout link, one-time checkout link, or build their own flow using checkout elements.",
      "Users can make purchases using fiat currency (e.g., USD, EUR) directly with their credit card or bank account.",
    ],
    products: ["nft-checkout"],
  },
  {
    title: "Email log-ins that abstract away crypto",
    description:
      "Give any user the keys to web3 with familiar web2 login flows. Choose from non-custodial or custodial solutions & enable users to sign in with an email, phone number, or social account (without having to see or deal with complex key management).",
    steps: [
      "Dev uses the SDK to enable email and social based authentication in their web3 apps using Embedded or Smart Wallets.",
      "User authenticates using just their email address and one-time passcode, or their Google account.",
      "A wallet is created on the user behalf without the user having to see or deal with complex key management.",
    ],
    products: ["smart-wallet", "embedded-wallets"],
  },
  {
    title: "Gasless transactions",
    description:
      "Create seamless web3 UX by sponsoring users' gas fees — for any & all transactions. No more disruptive transaction popups or bridging & swapping funds.",
    steps: [
      "Developer can either opt to use thirdweb managed service to cover gas fees and be billed monthly, or set up their own relayer or paymaster.",
      "User interacts with app seamlessly without worrying about gas costs or any other crypto-related barriers.",
    ],
    products: ["embedded-wallets", "smart-wallet", "sponsored-transactions"],
  },
  {
    title: "Custom transaction signing",
    description:
      "Transaction signing with your own custom messaging or remove entirely.",
    steps: [
      "Dev deploys either an NFT contract for primary sales or Marketplace contract for secondary sales.",
      "Implement Smart Wallets, setting your app's backend wallet as an Admin.",
      "When a transaction occurs, the signing occurs with the backend Admin wallet, so you can choose to surface any of the transaction's details to the end user.",
    ],
    products: ["smart-wallet"],
  },
  {
    title: "Fully white-labelled UI components",
    description:
      "Fully customizable UI components to match seamlessly with your brand.",
    steps: [
      "Install the thirdweb SDK.",
      "Import the desired UI components.",
      "Customize using built-in parameters of styling overrides.",
    ],
    products: ["connect", "embedded-wallets", "interact"],
  },
  {
    title: "Bring your own Auth",
    description:
      "Connect existing auth systems so that users don't need to authenticate twice.",
    steps: [
      "A Developer implements any authentication system, to handle user identities.",
      "After authentication, create a wallet for the user using Smart or Embedded Wallets",
      "Associate the newly created wallet with the user's profile.",
    ],
    products: ["smart-wallet", "embedded-wallets"],
  },
  {
    title: "Continue as Guest Upgrade Path",
    description:
      "Our “Continue as Guest” local wallet feature spins up a wallet that is stored locally in user's browser. However, users will not be able to access this wallet if they try to login from a different device. Allow users to convert their local wallet to an MPC wallet.",
    steps: [
      "Developer integrates local wallet into a game so that user can enjoy uninterrupted game play.",
      "User onboards onto app without being aware that local wallet is created on backend.",
      "After reaching a level playing game, the user has acquired enough in-game assets to justify exporting wallet. Developer displays a pop-up outlining what a local wallet is and how the Player can upgrade wallet into an embedded wallet.",
    ],
    products: ["smart-wallet", "embedded-wallets"],
  },
];

const SolutionsWeb2Onboarding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Seamless Web3 onboarding for everyone",
        description:
          "Make web3 apps accessible to all users with onboarding experiences that completely abstract away web3 complexity.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/appchain-api-solutions.png`,
              width: 1200,
              height: 630,
              alt: "Seamless Web3 onboarding for everyone",
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
          title="Seamless Web3 onboarding"
          titleWithGradient="for everyone"
          subtitle="Make web3 apps accessible to all users with onboarding experiences that completely abstract away web3 complexity."
          trackingCategory={TRACKING_CATEGORY}
          gradient="linear(to-r, #4830A4, #9786DF)"
          image={require("public/assets/product-pages/hero/desktop-hero-web2-onboarding.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-web2-onboarding.png")}
          ctaLink="https://portal.thirdweb.com/embedded-wallet"
          contactUsTitle="Book Demo"
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-simple-click.svg")}
            title="Best-in-class developer experience"
            description="Integrate with just a few lines of code — with an interactive builder, powerful hooks for full customization, and onchain analytics."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-efficient.svg")}
            title="Instant onboarding for all"
            description="Onboard users with just an email, phone, or social account. Generate wallets for your users under the hood, or empower them to create their first self-custodial wallet."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-custom.svg")}
            title="Fully customizable"
            description="Build custom onboarding flows with a powerful UI component — with web3 & web2 login options, personalized branding & themes, and everything you need to tailor it to your app."
          />
        </LandingGridSection>

        <LandingOptionSelector
          items={SELECTOR_ITEMS}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          blackToWhiteTitle=""
          title="What You Can Build"
        />

        <LandingGridSection desktopColumns={4}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-email-signin.svg")}
              title="Embedded Wallets"
              description="Give any user the keys to web3 with familiar web2 login flows. Choose from non-custodial or custodial solutions & enable users to sign in with an email, phone number, or social account."
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
              icon={require("public/assets/solutions-pages/icons/icon-credit.svg")}
              title="Checkout"
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
        </LandingGridSection>

        <LandingGuidesShowcase
          title="Learn how to build"
          description="Onboard new users"
          category={TRACKING_CATEGORY}
          guides={GUIDES}
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/embedded-wallet"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #4830A4, #9786DF)"
        />
      </Container>
    </LandingLayout>
  );
};

SolutionsWeb2Onboarding.pageId = PageId.SolutionsWeb2Onboarding;

export default SolutionsWeb2Onboarding;

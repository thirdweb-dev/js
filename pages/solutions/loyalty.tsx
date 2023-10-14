import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHero } from "components/landing-pages/hero";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingOptionSelector } from "components/landing-pages/option-selector";
import { LandingShowcaseImage } from "components/landing-pages/showcase-image";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "loyalty";

const CASE_STUDIES = [
  {
    title:
      "EVEN Empowers Fans to Support Their Favorite Music Artists — and Get Rewarded for It",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/EVEN-Empowers-Fans-to-Support-their-Favorite-Music-Artists-through-NFTs.png",
    link: "https://blog.thirdweb.com/case-studies/even-empowers-fans-to-support-their-favorite-music-artists-through-nfts/",
  },
  {
    title:
      "Mirror Empowers Creators to Build Engaged Audiences with Subscriber NFTs",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/02/Mirror-case-study.png",
    link: "https://blog.thirdweb.com/case-studies/mirror-creators-build-loyal-audiences-with-subscriber-nfts/",
  },
  {
    title:
      "Layer3 Powers Web3 Adoption through Gamified Experiences & NFT Rewards",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/Layer3--2-.png",
    link: "https://blog.thirdweb.com/case-studies/layer3-powers-web3-adoption-through-gamified-experiences-nft-rewards/",
  },
];

const GUIDES = [
  {
    title: "Build a Loyalty Program using the Loyalty Card Contract",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/09/Build-a-Loyalty-Program-using-the-Loyalty-Card-Contract--1-.png",
    link: "https://blog.thirdweb.com/guides/loyalty-card-contract/",
  },
  {
    title: "How to accept credit card payments for your NFT drop",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-3.png",
    link: "https://blog.thirdweb.com/guides/accept-credit-card-payments/",
  },
  {
    title: "Getting Started with Paper Wallet",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/How-to-Add-Paper-Wallet-to-your-Connect-Wallet-Button.png",
    link: "https://blog.thirdweb.com/guides/how-to-use-paper-wallet/",
  },
];

const SELECTOR_ITEMS = [
  {
    title: "Frictionless onboarding experience",
    description:
      "Get users onboarded quickly with familiar email and social log-ins— we create wallets on behalf of users. Non-custodial wallets to give users a better authentication experience with more security and privacy.",
    steps: [
      "User sign-in to app with their email or social log-in",
      "Wallet is created on behalf of the user abstracting away crypto entirely",
      "User interacts with app seamlessly— without disruptive transaction pop-ups",
    ],
    products: [
      "connect",
      "embedded-wallets",
      "sponsored-transactions",
      "smart-wallet",
    ],
    image: require("public/assets/solutions-pages/loyalty/frictionless-onboarding-experience-desktop.png"),
    mobileImage: require("public/assets/solutions-pages/loyalty/frictionless-onboarding-experience-mobile.png"),
  },
  {
    title: "Cross-brand Collaborations",
    description:
      "Acquire new high-value customers through cross-brand collaborations. Tap into other brands' communities by inviting other brands’ token holders to join your brand and vice versa. Unlock the power of communities.",
    steps: [
      "Brand A partners with Brand Bt",
      "Brand A whitelists Brand B's loyalty token holders to airdrop them Brand A loyalty tokens (and vice versa)",
      "Brand A & B acquires new customers from each other's communities",
    ],
    products: [
      "explore",
      "smart-wallet",
      "connect",
      "interact",
      "engine",
      "nft-checkout",
    ],
    image: require("public/assets/solutions-pages/loyalty/cross-brand-activations-desktop.png"),
    mobileImage: require("public/assets/solutions-pages/loyalty/cross-brand-activations-mobile.png"),
  },
  {
    title: "Personalized loyalty programs",
    description:
      "Airdrop digital rewards directly to users. Give users a sense of digital ownership of your brand. Token-gate exclusive products to reward your most loyal customers.",
    steps: [
      "Airdrop Loyalty NFTs to registered users",
      "Reward Loyalty NFT holders with token-gated exclusive products / premium features",
      "Airdrop Reward NFT which dynamically updates Loyalty Membership NFT",
    ],
    products: [
      "auth",
      "smart-wallet",
      "embedded-wallets",
      "connect",
      "interact",
      "engine",
      "storage",
      "nft-checkout",
      "sponsored-transactions",
    ],
  },
  {
    title: "Gamified reward-based quests",
    description:
      "Leverage game design elements to motivate your customers to earn their way to rewards— both online and in the physical world.",
    steps: [
      "Launch gamified quests and allow users to earn their way through rewards, e.g. 100 loyalty points for in-store visit",
      "Distribute Reward NFTs after users completes quests",
      "Users receives Rewards NFTs in their wallet",
    ],
    products: [
      "auth",
      "smart-wallet",
      "embedded-wallets",
      "connect",
      "interact",
      "engine",
      "nft-checkout",
      "sponsored-transactions",
    ],
  },
  {
    title: "Subscription membership passes",
    description:
      "Unlock new recurring revenue streams by offering monthly member subscription passes in exchange for special brand offers.",
    steps: [
      "Create a membership program that offers special offers to monthly subscribers, e.g 10% discount code on all purchases if you have a monthly subscription pass",
      "Users pay for monthly subscription pass",
      "User receives on-chain discount code can be redeemed",
    ],
    products: ["auth", "smart-wallet", "embedded-wallets", "connect", "engine"],
  },
  {
    title: "Sell digital assets",
    description: "Sell NFT digital assets to complement physical assets.",
    steps: [
      "Developers use Interact or Engine to upload and manage NFT digital assets",
      "Users interested in purchasing digital assets access the platform can use Connect for easy onboarding with just their email address",
      "Users purchases NFT with credit card using Checkout",
    ],
    products: [
      "auth",
      "smart-wallet",
      "embedded-wallets",
      "interact",
      "engine",
      "nft-checkout",
      "connect",
      "storage",
      "rpc-edge",
    ],
  },
  {
    title: "Multi-alliance loyalty marketplaces",
    description:
      "Give your users more flexible and control- allow them to trade loyalty points and membership accounts on secondary marketplaces. Collect royalty fees on traded loyalty points and accounts.",
    steps: [
      "Developer deploys a marketplace using the prebuilt contract found in Explore",
      "Sellers use the marketplace to list their loyalty points or membership accounts, set their desired trade terms, and manage transactions",
      "Buyers can smoothly complete their purchases using their credit card with Checkout",
    ],
    products: [
      "auth",
      "explore",
      "smart-wallet",
      "embedded-wallets",
      "interact",
      "engine",
      "nft-checkout",
      "connect",
      "sponsored-transactions",
      "rpc-edge",
    ],
  },
  {
    title: "Customer Analytics",
    description:
      "Gather insightful data on customer behaviors— unique wallet addresses interacting with contract, user engagement with contract, and more.",
    steps: [
      "Developer deploys contract from Explore",
      "Onchain activity is tracked every time user interacts with contract (e.g. receives a Reward NFT everytime they spend $100)",
      "Developer views Dashboard analytics per contract: Unique Wallets, Total Transactions, Total Events, and more.",
    ],
    products: ["interact"],
  },
];

const SolutionsGaming: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Web3 Loyalty Program: Engage, Reward, & Delight Customers",
        description:
          "Build brand loyalty programs that turn customers into champions — with digital collectibles, tradable points, & more. Try thirdweb, it's free.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/loyalty-solutions.png`,
              width: 1200,
              height: 630,
              alt: "Web3 Loyalty Programs",
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
          title="10x customer retention with"
          titleWithGradient="next-gen loyalty"
          subtitle="Supercharge loyalty throughout the customer journey— from activation to advocating for your brand. Turn your customers into superfan communities by giving them digital ownership."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://blog.thirdweb.com/guides/loyalty-card-contract/"
          gradient="linear(to-r, #4830A4, #9786DF)"
          image={require("public/assets/product-pages/hero/desktop-hero-loyalty.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-loyalty.png")}
          contactUsTitle="Book Demo"
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-grow.svg")}
            title="Grow your customer base"
            description="Allow new customers to discover your brand by enabling customers to earn and redeem points from any company within your icons alliance ecosystem."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-scale.svg")}
            title="Increase customer lifetime value"
            description="Create communities and turn your customers into your biggest advocates by sending digital collectibles that they can own, trade, and redeem."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-fee.svg")}
            title="Unlock new revenue streams"
            description="Generate recurring revenue from membership subscriptions, sell digital assets from your storefront, and collect royalty fees from traded loyalty points."
          />
        </LandingGridSection>
        <LandingOptionSelector
          items={SELECTOR_ITEMS}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          blackToWhiteTitle=""
          title="What You Can Build"
        />

        <LandingShowcaseImage
          miniTitle=""
          titleWithGradient="Evolving NFTs"
          title=""
          gradient="linear(to-r, #4830A4, #9786DF)"
          description="Give your loyal customers an NFT that evolves based on other asset holdings in user's wallet. This enables you to create a tiered membership NFT that dynamically updates through different membership tiers (e.g. bronze, silver, gold) as the user receives on-chain loyalty points."
          image={require("public/assets/solutions-pages/loyalty/evolving-loyalty-contract-desktop.png")}
        />

        <LandingShowcaseImage
          miniTitle=""
          titleWithGradient="Token Bound Account"
          title=""
          gradient="linear(to-r, #4830A4, #9786DF)"
          description="Convert NFTs into a smart contract wallet. This enables the NFT to hold other on-chain assets and enable bundled easy transfer of loyalty accounts and points. This  enables the Multi-Alliance Loyalty Program use case where entire membership accounts can be traded."
          image={require("public/assets/solutions-pages/loyalty/token-bound-acc-desktop.png")}
          imagePosition="left"
        />

        <LandingShowcaseImage
          miniTitle=""
          titleWithGradient="Commerce SDK"
          title=""
          gradient="linear(to-r, #4830A4, #9786DF)"
          description="An intuitive developer-first SDK that makes it easier for you to distribute loyalty tokens to a wallet address, distribute membership NFTs, generate on-chain discount codes, and enable token-gated access to exclusive products."
          image={require("public/assets/solutions-pages/loyalty/commerce-sdk-desktop.png")}
        />

        <LandingGuidesShowcase
          title="Learn how to build"
          description="Start Building Next-Gen Loyalty"
          solution="Loyalty"
          category={TRACKING_CATEGORY}
          guides={GUIDES}
        />

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
          ctaLink="https://blog.thirdweb.com/guides/loyalty-card-contract/"
          gradient="linear(to-r, #4830A4, #9786DF)"
          contactUsTitle="Book Demo"
        />
      </Container>
    </LandingLayout>
  );
};

SolutionsGaming.pageId = PageId.SolutionsGaming;

export default SolutionsGaming;

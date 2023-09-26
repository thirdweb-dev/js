import { Container, Flex } from "@chakra-ui/react";
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

const TRACKING_CATEGORY = "sponsored-transactions-landing";

const GUIDES = [
  {
    title: "Setup Gasless Transactions In Your Unity Game",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Set-Up-Gasless-Transactions-in-Unity-2.png",
    link: "https://blog.thirdweb.com/guides/setup-gasless-transactions-in-your-unity-game/",
  },
  {
    title: "Set Up Gasless Transactions with OpenZeppelin Defender",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Learn-how-to--set-up-gasless-transactions-2.png",
    link: "https://blog.thirdweb.com/guides/setup-gasless-transactions/",
  },
  {
    title: "Create an NFT Drop with Gasless Transactions using Biconomy",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Create-a-gasless-NFT-Drop--using-Biconomy-2.png",
    link: "https://blog.thirdweb.com/guides/biconomy-gasless-guide/",
  },
];

const SponsoredTransactionsLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Gasless Transactions for the Smoothest Web3 UX",
        description:
          "Create seamless web3 UX by sponsoring users' gas fees — for any & all transactions. No more disruptive transaction popups or bridging & swapping funds.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/sponsored-transactions.png`,
              width: 1200,
              height: 630,
              alt: "Gasless Transactions for the Smoothest Web3 UX",
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
          miniTitle="Sponsored Transactions"
          title="Remove all friction with"
          titleWithGradient="invisible transactions"
          subtitle="Create seamless web3 UX by sponsoring users' gas fees — for any & all transactions. No more disruptive transaction popups or bridging & swapping funds."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/glossary/gasless-transactions"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #00A876, #75FFD6)"
          image={require("public/assets/product-pages/hero/desktop-hero-sponsored-transactions.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-sponsored-transactions.png")}
        />

        <LandingGridSection title={<></>}>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/payments/icon-efficient.svg")}
            title="Abstract away the blockchain"
            description="Remove disruptive transaction popups, the need to bridge & swap funds, and other obstacles that prevent users from using your dApp."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/payments/icon-gasless.svg")}
            title="Flexible relayer options"
            description="Choose Biconomy or OpenZeppelin Defender as your gasless transaction provider — giving you maximum scalability & ultimate peace of mind."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/payments/icon-simple-click.svg")}
            title="Seamless web3 UX"
            description="Combine gasless & signless transactions to give your users the best user experience — for apps & games that require frequent transactions, on any EVM chain."
          />
        </LandingGridSection>
        <LandingGridSection title={<></>} desktopColumns={2}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-gasless.svg")}
              title="Gasless Relayer"
              description="Our SDK integrates seamlessly with Biconomy and OpenZeppelin Defender, two popular gasless transaction providers."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-private.svg")}
              title="Paymaster"
              description="thirdweb Smart Wallet paymaster allows gasless transactions to happen in a non-custodial way."
            />
          </Card>
        </LandingGridSection>

        <LandingGridSection
          title={
            <LandingSectionHeading
              title="What You Can Build"
              blackToWhiteTitle=""
            />
          }
        >
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-email-signin.svg")}
              title="Web2 user login flows"
              description="Onboard anyone in an instant with an embedded & smart wallet combo — enabling signless transactions and covering gas fees so that users can start using your dApp in seconds & get the smoothest experience without needing to bridge or swap funds."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-marketplace.svg")}
              title="Brand activations"
              description="Launch mass-scale digital marketing campaigns where any user can claim exclusive digital assets (even if they've never created a wallet or purchased crypto before) and turn your customers into loyal brand advocates by bringing them closer with low-cost digital goods."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/payments/icon-smart-wallet.svg")}
              title="Custom in-app experiences"
              description="Pair gasless transactions with smart wallets to enable anyone to use your app or game without getting transaction popups, signature requests, or switching back & forth with their wallet apps."
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="Learn how to build with sponsored transactions"
          description="Create smooth, gasless experiences for your users"
          category={TRACKING_CATEGORY}
          guides={GUIDES}
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/glossary/gasless-transactions"
          gradient="linear(to-r, #00A876, #75FFD6)"
        />
      </Container>
    </LandingLayout>
  );
};

SponsoredTransactionsLanding.pageId = PageId.SponsoredTransactionsLanding;

export default SponsoredTransactionsLanding;

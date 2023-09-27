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

const TRACKING_CATEGORY = "deploy-landing";

const GUIDES = [
  {
    title: "How to Deploy Any Smart Contract Using the thirdweb CLI",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/This-is-the-one-10.png",
    link: "https://blog.thirdweb.com/guides/how-to-deploy-any-smart-contract-using-thirdweb-cli/",
  },
  {
    title: "How to deploy an NFT Marketplace",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/09/How-to-Create-an-NFT-Marketplace---Step-by-Step-Tutorial-Guide.png",
    link: "https://blog.thirdweb.com/guides/how-to-create-an-nft-marketplace/",
  },
  {
    title: "How to build a Token Bound Account (ERC 6551)",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/06/How-to-Create-Token-Bound-Accounts--ERC-6551-.png",
    link: "https://blog.thirdweb.com/guides/create-token-bound-accounts-erc6551/",
  },
];

const CASE_STUDIES = [
  {
    title:
      "Base Launches its First Builder Quest & Brings New Developers Onchain",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/Base-Launches-its-First-Builder-Quest-and-Brings-New-Developers-Onchain---thirdweb-Case-Study-1.png",
    link: "https://blog.thirdweb.com/case-studies/base-builder-quest-brings-developers-onchain/",
  },
  {
    title: "Pixels Builds an On-Chain Ecosystem for its Open-World Web3 Game",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/04/Pixels-Builds-an-Onchain-Ecosystem-for-its-Web3-Game-thirdweb-Case-Study.png",
    link: "https://blog.thirdweb.com/case-studies/pixels-builds-an-onchain-ecosystem-for-its-web3-game/",
  },
  {
    title:
      "Layer3 Powers Web3 Adoption through Gamified Experiences & NFT Rewards",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/Layer3--2-.png",
    link: "https://blog.thirdweb.com/case-studies/layer3-powers-web3-adoption-through-gamified-experiences-nft-rewards/",
  },
];

const DeployLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Deploy Smart Contracts on Any EVM Chain",
        description:
          "Deploy smart contracts to any EVM network securely, using a single command or a few clicks from our dashboard. Learn more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/deploy.png`,
              width: 1200,
              height: 630,
              alt: "Deploy Smart Contracts on Any EVM Chain",
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
          miniTitle="Deploy"
          title="Launch smart contracts"
          titleWithGradient="on any EVM chain securely"
          subtitle="Deploy smart contracts to any EVM network, using a single command or a few clicks from our dashboard. No more copying ABIs or sharing private keys."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/deploy"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          image={require("public/assets/product-pages/hero/desktop-hero-deploy.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-deploy.png")}
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-simple-click.svg")}
            title="Simplify your workflow"
            description="Decrease your go-to-market time by deploying smart contracts with one command line or with a few clicks on our dashboard. A simplified workflow for developers, with no more copying ABIs or generating bindings."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-secure.svg")}
            title="Deploy securely"
            description="Eliminate any risk from your workflow. No need to share private keys as deployment is managed via our dashboard. No need to deal with insecure and unfunded private keys required with local deploys."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-build.svg")}
            title="Build on any contract"
            description="Unlock a full Web3 development stack for any smart contract. Access powerful tooling that allows you to easily build apps on top of your contracts, including Wallets, SDKs, Payments and Infrastructure. "
          />
        </LandingGridSection>
        <LandingGridSection desktopColumns={4}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-share.svg")}
              title="CLI"
              description="1-line command for deploying contracts."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-dashboard.svg")}
              title="Dashboard user interface"
              description="For deploying contracts, no need to share private keys."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-storage-management.svg")}
              title="Managed infrastructure"
              description="No need to set RPC URL and automatically upload and pin contract metadata to IPFS."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-verified.svg")}
              title="Automatic verification"
              description="Contracts are automatically verified on Sourcify."
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
          desktopColumns={4}
        >
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-digital-collectible.svg")}
              title="Digital Collectibles"
              description="Deploy ERC-721 or ERC-1155 NFT smart contracts with lazy minting to let your audience claim or purchase digital collectibles."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-marketplace.svg")}
              title="Marketplaces"
              description="Build your own fully-customizable marketplace — where you can sell directly to your audiences, create auctions that users can bid on, and enable anyone to trade digital assets."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-smart-wallet.svg")}
              title="Smart Wallets"
              description="Deploy smart wallet factories for your app — using account abstraction to give your users powerful features such as wallet recovery, multi-signature security, & batch transactions."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-game.svg")}
              title="Web3 Games"
              description="Build blockchain-based games with collectible in-game items and in-game economies using NFTs, native tokens and more. "
            />
          </Card>
        </LandingGridSection>

        <LandingGuidesShowcase
          title="Deploy smart contracts for any web3 app"
          description="Learn how to deploy smart contracts to any EVM chain in seconds"
          solution="Deploy"
          category={TRACKING_CATEGORY}
          guides={GUIDES}
        />

        <LandingGuidesShowcase
          title="The best web3 apps use thirdweb's smart contract tools"
          category={TRACKING_CATEGORY}
          description="Seamlessly deploy smart contracts on any EVM chain so you can focus on building a great app."
          guides={CASE_STUDIES}
          caseStudies
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/deploy"
          gradient="linear(to-r, #F213A4, #F97CCE)"
        />
      </Container>
    </LandingLayout>
  );
};

DeployLanding.pageId = PageId.DeployLanding;

export default DeployLanding;

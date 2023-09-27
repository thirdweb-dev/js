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

const TRACKING_CATEGORY = "interact-landing";

const CASE_STUDIES = [
  {
    title:
      "Base Launches its First Builder Quest & Brings New Developers Onchain",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/Base-Launches-its-First-Builder-Quest-and-Brings-New-Developers-Onchain---thirdweb-Case-Study-1.png",
    link: "https://blog.thirdweb.com/case-studies/base-builder-quest-brings-developers-onchain/",
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

const InteractLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Integrate smart contracts into your apps",
        description:
          "The complete toolkit to add any smart contract into your apps — and call functions for any type of onchain interaction. Learn more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/interact.png`,
              width: 1200,
              height: 630,
              alt: "Integrate smart contracts into your apps",
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
          miniTitle="Interact"
          title="Seamlessly integrate smart contracts"
          titleWithGradient="into your apps"
          subtitle="The complete toolkit to add any smart contract into your apps — and call functions for any type of onchain interaction."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/sdk"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          image={require("public/assets/product-pages/hero/desktop-hero-interact.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-interact.png")}
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-contract-action.svg")}
            title="An intuitive DX"
            description="Integrate smart contracts into any app with SDKs that detect contract extensions and handle any kind of onchain interaction."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-monitor-contract.svg")}
            title="Fine-grained control"
            description="Manage, read & write, and monitor any smart contract — with quick access to custom contract configurations like royalty fees, signature-based minting, & more."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/contracts/icon-analytics.svg")}
            title="Onchain insights"
            description="Get onchain data & understand activity on your smart contracts with an easy-to-use analytics dashboard."
          />
        </LandingGridSection>
        <LandingGridSection>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-contract-action.svg")}
              title="Manage contracts"
              description="Manage all of your smart contracts from the dashboard. Configure your contract settings, view contract events, and check source code of your contract — all tailored to the contract's detected extensions & industry standards."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-marketplace-1.svg")}
              title="Read & write to contracts"
              description="Integrate smart contracts into your app, call any & all functions, and have code snippets auto-generated based on your contract's supported extensions — for React, React Native, TypeScript, Python, Unity, and Go — on any chain."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-monitor-contract.svg")}
              title="Monitor contracts"
              description="View historical and real-time contract activity, including: unique wallet addresses that have sent transactions, total transaction count, total events, function breakdown, and events breakdown by contract."
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
              icon={require("public/assets/product-pages-icons/contracts/icon-digital-collectible.svg")}
              title="NFT & token mints"
              description="Deploy any smart contract, add custom extensions for advanced functionality, & instantly add it to any app — with an auto-generated mint embed so that your users can claim & mint NFTs directly from within it."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-analytics.svg")}
              title="App clients & analytics"
              description="Plug any existing smart contract into your app via our SDK to read from & write to it — so that you can build anything from app clients to insights aggregators, complete with intuitive data feeds for onchain analytics."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/contracts/icon-marketplace.svg")}
              title="Web3 apps, games & marketplaces"
              description="Build blockchain-powered games & marketplaces using all of the smart contracts you need —  with functions for token minting & redemption, buying & selling, burning, and everything else you need to build full-stack web3 apps."
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
          ctaLink="https://portal.thirdweb.com/sdk"
          gradient="linear(to-r, #F213A4, #F97CCE)"
        />
      </Container>
    </LandingLayout>
  );
};

InteractLanding.pageId = PageId.InteractLanding;

export default InteractLanding;

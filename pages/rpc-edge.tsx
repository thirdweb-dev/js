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

const TRACKING_CATEGORY = "rpc-edge-landing";

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

const RPCEdgeLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Enterprise-Grade RPCs on Any EVM Chain, For Free",
        description:
          "Free RPCs with high data reliability, throughput, and uptime — so that you can build production-grade web3 apps that scale. Learn more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/rpc-edge.png`,
              width: 1200,
              height: 630,
              alt: "Enterprise-Grade RPCs on Any EVM Chain, For Free",
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
          miniTitle="RPC Edge"
          title="Enterprise-grade RPCs,"
          titleWithGradient="for free"
          subtitle="Free RPCs with high data reliability, throughput, and uptime — so that you can build production-grade web3 apps that scale."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/infrastructure/rpc-edge"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
          image={require("public/assets/product-pages/hero/desktop-hero-rpc-edge.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-rpc-edge.png")}
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/infra/icon-efficient.svg")}
            title="Build production-grade web3 apps"
            description="The fastest & most robust RPC provider with global edge for low latency"
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/infra/icon-scale.svg")}
            title="Scale to millions of users, securely"
            description="High data reliability, throughput, and uptime for production-grade web3 apps"
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/infra/icon-evm.svg")}
            title="Support for all EVM-compatible chains"
            description="Build on any (or many) chains with full EVM-compatibility — with support for Layer 2 networks, appchains, & more"
          />
        </LandingGridSection>
        <LandingGridSection desktopColumns={5}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-verified.svg")}
              title="High data reliability"
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-automatic-file-upload.svg")}
              title="High request-per-second throughput"
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-efficient.svg")}
              title="High uptime (99.9% infrastructure SLAs)"
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-global.svg")}
              title="Intelligent routing with global edge"
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-evm.svg")}
              title="Any EVM Chain"
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
              icon={require("public/assets/product-pages-icons/infra/icon-game.svg")}
              title="Massively-Multiplayer Games"
              description="Scale to millions of users across the world with global RPC edge caching."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-protocol.svg")}
              title="DeFi Protocols"
              description="Build decentralized finance platforms with maximum security — such as onchain exchanges, lending protocols, and staking platforms."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-marketplace.svg")}
              title="Brand Activations"
              description="Execute mass-scale digital campaigns with NFT drops — with high data reliability, throughput, and uptime."
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
          ctaLink="/dashboard/infrastructure/rpc-edge"
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
        />
      </Container>
    </LandingLayout>
  );
};

RPCEdgeLanding.pageId = PageId.RPCEdgeLanding;

export default RPCEdgeLanding;

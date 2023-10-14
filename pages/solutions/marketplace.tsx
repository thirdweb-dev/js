import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingHero } from "components/landing-pages/hero";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingOptionSelector } from "components/landing-pages/option-selector";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "marketplace-landing";

const SELECTOR_ITEMS = [
  {
    title: "Primary sales",
    description:
      "Allow your users to list, buy, and sell items, e.g. digital assets or loyalty memberships.",
    steps: [
      "Deploy Marketplace contract from Explore to any EVM chain (900+ supported)",
      "Create an ecosystem for collectors to Configure Marketplace contract, e.g. % platform fee collected on any sale",
      "Integrate Marketplace contract into your apps and games using SDK in multiple languages.",
    ],
    products: ["explore", "interact"],
  },
  {
    title: "Secondary marketplaces",
    description:
      "Sell NFTs on your own marketplace with flexible listing options, e.g. fixed price, auctions, and best offer.",
    steps: [
      "Deploy Marketplace contract from Explore to any EVM chain (900+ supported)",
      "Configure Marketplace contract, e.g. % platform fee collected on any sale",
      "Integrate Marketplace contract into your apps and games using SDK in multiple languages.",
    ],
    products: ["explore", "interact"],
  },
];

const SolutionsMarketplace: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Add marketplaces to any app or game",
        description:
          "Deploy marketplace contract to any EVM chain. Multi-platform supported including desktop, mobile, and game engines.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/marketplace-solutions.png`,
              width: 1200,
              height: 630,
              alt: "Add marketplaces to any app or game",
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
          title="Add marketplaces"
          titleWithGradient="to any app or game"
          subtitle="Deploy marketplace contract to any EVM chain. Multi-platform supported including desktop, mobile, and game engines."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/pre-built-contracts/marketplace"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          image={require("public/assets/product-pages/hero/desktop-hero-marketplace.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-marketplace.png")}
          contactUsTitle="Book Demo"
        />

        <LandingGridSection>
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-game.svg")}
            title="Any Platform"
            description="Multi-platform support including desktop, mobile and game engines."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-marketplace.svg")}
            title="Flexible configuration"
            description="Sell NFTs on your own marketplace with flexible listing options, e.g. fixed price, auctions, best offer. Create a secondary marketplace for your users to trade digital assets and collect % royalty fees."
          />
          <LandingIconSectionItem
            icon={require("public/assets/solutions-pages/icons/icon-simple-click.svg")}
            title="Best-in-class DX"
            description="Integrate with just a few lines of code — with an interactive builder, powerful hooks for full customization, and onchain analytics."
          />
        </LandingGridSection>

        <LandingGridSection>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-contract.svg")}
              title="Marketplace Contract"
              description="thirdweb's marketplace contract is a dynamic contract that allows the marketplace to be upgraded over time with new functionality."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-tool.svg")}
              title="Interact"
              description="The complete toolkit to add any smart contract into your apps — and call functions for any type of onchain interaction."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/solutions-pages/icons/icon-library.svg")}
              title="Explore"
              description="Browse smart contracts from the world's best engineers & protocols, for every use case — and deploy them to any EVM chain."
            />
          </Card>
        </LandingGridSection>

        <LandingOptionSelector
          items={SELECTOR_ITEMS}
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          blackToWhiteTitle=""
          title="What You Can Build"
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="https://portal.thirdweb.com/pre-built-contracts/marketplace"
          gradient="linear(to-r, #F213A4, #F97CCE)"
          contactUsTitle="Book Demo"
        />
      </Container>
    </LandingLayout>
  );
};

SolutionsMarketplace.pageId = PageId.SolutionsMarketplace;

export default SolutionsMarketplace;

import { SimpleGrid } from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { SolutionsTextImage } from "components/product-pages/common/SolutionsTextImage";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const CONTRACTS_GUIDES = [
  {
    title: "Build an NFT Subscription using Unlock",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/subscribe_with_unlock-1.png",
    link: "https://blog.thirdweb.com/guides/build-a-subscription-with-unlock/",
  },
  {
    title: "Build An ERC721A NFT Collection using Solidity",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-19.png",
    link: "https://blog.thirdweb.com/guides/get-started-with-the-contracts-sdk/",
  },
  {
    title: "Build A Mutant Ape Yacht Club (MAYC) NFT Collection Clone",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/09/This-is-the-one-4.png",
    link: "https://blog.thirdweb.com/guides/create-an-mayc-collection-clone/",
  },
];

const TRACKING_CATEGORY = "smart_contracts";

const PreBuiltContracts: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Discover and deploy contracts in 1-click",
        description:
          "The best place for web3 developers to explore smart contracts from world-class web3 protocols & engineers — all deployable with one click.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/product-pages/pre-builts/solution.png`,
              width: 1200,
              height: 630,
              alt: "thirdweb Explore",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Explore"
        title="Discover and deploy contracts in 1-click"
        description="The best place for web3 developers to explore smart contracts from world-class web3 protocols & engineers — all deployable with one click."
        buttonText="Get started"
        buttonLink="/explore"
        image={require("public/assets/product-pages/pre-builts/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #AB2E2E 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="1-click deploy"
            icon={require("/public/assets/product-pages/pre-builts/hero-icon-1.png")}
          >
            Deploy to any supported chain with a single click. No need for
            private keys or scripts.
          </ProductCard>
          <ProductCard
            title="Unlock powerful tooling"
            icon={require("/public/assets/product-pages/pre-builts/hero-icon-2.png")}
          >
            When you deploy a contract from Explore, you unlock access to our
            tools that makes building and managing your web3 apps seamless.
          </ProductCard>
          <ProductCard
            title="Designed to be discovered"
            icon={require("/public/assets/product-pages/pre-builts/hero-icon-3.png")}
          >
            Get inspired with our curated library of contracts- organized and
            categorized by the most common builds and use cases.
          </ProductCard>
        </SimpleGrid>
      </Hero>

      <SolutionsTextImage
        image={require("/public/assets/product-pages/pre-builts/solution-cut.png")}
        title="Discover contracts that inspire you to build web3 apps and games"
      />

      <ProductSection py={{ base: 12, md: 24 }}>
        <Heading
          as="h2"
          size="display.sm"
          fontWeight={700}
          textAlign="center"
          mb={{ base: 16, lg: 24 }}
        >
          Contracts for every use case
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 12, md: 6 }}>
          <ProductLearnMoreCard
            title="Gaming"
            category={TRACKING_CATEGORY}
            description="Integrate marketplace contracts directly in-game to enforce royalty fees. Staking contracts for play-to-earn blockchain games."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="/explore/gaming"
          />
          <ProductLearnMoreCard
            title="Commerce"
            category={TRACKING_CATEGORY}
            description="NFTs contracts that enable you to reward loyal customers, sell digital collectibles as a new product category, and create token-gated storefronts."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
            href="/explore/commerce"
          />
          <ProductLearnMoreCard
            title="NFTs"
            category={TRACKING_CATEGORY}
            description="NFT Collections, Editions, Drops and everything else NFT-related."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="/explore/nft"
          />
        </SimpleGrid>
      </ProductSection>

      <GuidesShowcase
        title="Learn how to build"
        category={TRACKING_CATEGORY}
        description="Check out our guides to learn how to build with contracts on Explore."
        solution="Contracts"
        guides={CONTRACTS_GUIDES}
      />
    </ProductPage>
  );
};

PreBuiltContracts.pageId = PageId.PreBuiltContractsLanding;

export default PreBuiltContracts;

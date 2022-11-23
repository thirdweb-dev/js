import { ThirdwebNextPage } from "./_app";
import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";

const PreBuiltContracts: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Smart Contracts",
        description: "Ready-to-go contracts for your needs.",
      }}
    >
      <Hero
        name="Smart Contracts"
        title="Ready-to-go contracts for your needs."
        description="Deploy contracts written by the best web3 developers in a single click."
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
            title="A contract for your use-case"
            icon={require("/public/assets/product-pages/pre-builts/hero-icon-1.png")}
          >
            Whether you need NFTs, Tokens, Marketplaces, or something else,
            we&apos;ve got you covered with contracts for the most common
            use-cases.
          </ProductCard>
          <ProductCard
            title="Powerful tooling to build apps"
            icon={require("/public/assets/product-pages/pre-builts/hero-icon-2.png")}
          >
            When you deploy a contract, you automatically get custom tools that
            make building and managing your web3 app seamless.
          </ProductCard>
          <ProductCard
            title="One-click deploy"
            icon={require("/public/assets/product-pages/pre-builts/hero-icon-3.png")}
          >
            Deploy to any supported chain with a single click.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

PreBuiltContracts.pageId = PageId.PreBuiltContractsLanding;

export default PreBuiltContracts;

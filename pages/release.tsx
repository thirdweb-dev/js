import { ThirdwebNextPage } from "./_app";
import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";
import { Text } from "tw-components";

const Release: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Release",
        description: "The on-chain registry for Smart Contracts.",
      }}
    >
      <Hero
        name="Release"
        title="The on-chain registry for Smart Contracts."
        description="Publish your contracts to the registry to enable everyone to easily deploy them in 1-click."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/release"
        image={require("public/assets/product-pages/release/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #FBFF5C 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="On-chain and trustless"
            icon={require("/public/assets/product-pages/release/hero-icon-1.png")}
          >
            Releasing your contract adds it to the on-chain registry. Every
            version is signed by your wallet, so you retain full control.
          </ProductCard>
          <ProductCard
            title="Generated Release Page"
            icon={require("/public/assets/product-pages/release/hero-icon-2.png")}
          >
            Every released contract gets its own generated release page that
            enables users to learn more about its functionality.
          </ProductCard>
          <ProductCard
            title="Easy one-click deployment"
            icon={require("/public/assets/product-pages/release/hero-icon-3.png")}
          >
            Releases come with one-click deploy, allowing users to easily deploy
            your contract with their wallet.{" "}
            <Text color="white" as="span">
              No private keys.
            </Text>
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

Release.pageId = PageId.ReleaseLanding;

export default Release;

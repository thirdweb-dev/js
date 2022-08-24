import { ThirdwebNextPage } from "./_app";
import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";

const Web3SDK: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "SDKs",
        description: "Everything you need to build web3 apps.",
      }}
    >
      <Hero
        name="SDKs"
        title="Everything you need to build web3 apps."
        description="Build applications on top of your smart contracts. Seamlessly integrate them into your apps."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/web3-sdk"
        image={require("public/assets/product-pages/sdk/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #5BFF40 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Interact with the blockchain"
            icon={require("/public/assets/product-pages/sdk/hero-icon-1.png")}
          >
            We take care of everything between your applications and the
            blockchain. Read and write data from your smart contracts, listen
            for events, query logs and more.
          </ProductCard>
          <ProductCard
            title="Hooks and components"
            icon={require("/public/assets/product-pages/sdk/hero-icon-2.png")}
          >
            We provide frontend components like wallet connection and contract
            buttons, as well as easy-to-use hooks to speed up your app
            development.
          </ProductCard>
          <ProductCard
            title="Built for all developers"
            icon={require("/public/assets/product-pages/sdk/hero-icon-3.png")}
          >
            We provide SDKs in many languages, including JavaScript, TypeScript,
            Python, and Go so you can build with whatever tools you are most
            comfortable using.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

Web3SDK.pageId = PageId.Web3SDKLanding;

export default Web3SDK;

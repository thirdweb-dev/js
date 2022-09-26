import { ThirdwebNextPage } from "./_app";
import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";

const ContractExtensions: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Extensions",
        description: "Contract development made simple.",
      }}
    >
      <Hero
        name="Extensions"
        title="Contract development made simple."
        description="Fast-track your contract development pipeline with our plug-and-play base contracts and extensions."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/extensions"
        image={require("public/assets/product-pages/extensions/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #D45CFF 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Base contracts for your needs"
            icon={require("/public/assets/product-pages/extensions/hero-icon-1.png")}
          >
            Start building with one of our base contracts designed with best
            practices for the most common uses like NFTs, Marketplaces, DAOs,
            etc..
          </ProductCard>
          <ProductCard
            title="Extensions to add functionality"
            icon={require("/public/assets/product-pages/extensions/hero-icon-2.png")}
          >
            Add common features like Royalties and Permissions to you contracts
            with a single-line of code using our contract extensions.
          </ProductCard>
          <ProductCard
            title="Out-of-the-box tooling"
            icon={require("/public/assets/product-pages/extensions/hero-icon-3.png")}
          >
            Get auto-generated SDKs and dashboards to build apps on top of your
            contracts and easily manage them.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

ContractExtensions.pageId = PageId.ContractExtensionsLanding;

export default ContractExtensions;

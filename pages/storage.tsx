import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const Storage: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Storage",
        description: "Fast, reliable, decentralized storage",
      }}
    >
      <Hero
        trackingCategory="storage"
        name="Storage"
        title="Fast, reliable, decentralized storage"
        description="A blazing fast API for all your decentralized storage needs"
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/storage"
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #FFAE63 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Industry leading performance"
            icon={require("/public/assets/product-pages/storage/hero-icon-1.png")}
          >
            Experience the fastest upload and download times of any
            decentralized storage solution, enabled by industry leading
            infrastructure.
          </ProductCard>
          <ProductCard
            title="Guaranteed availability"
            icon={require("/public/assets/product-pages/storage/hero-icon-2.png")}
          >
            Upload and forget - we ensure that you&apos;re files are stored in
            decentralized, redundant, and permanent way and are always
            accessible.
          </ProductCard>
          <ProductCard
            title="Transparent pricing"
            icon={require("/public/assets/product-pages/storage/hero-icon-3.png")}
          >
            No need to worry about spending protocol specific tokens,
            negotiationg storage deals, or pinning files - pay as you go and
            we&apos;ll take care of the rest.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

Storage.pageId = PageId.StorageLanding;

export default Storage;

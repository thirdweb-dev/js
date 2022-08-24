import { ThirdwebNextPage } from "./_app";
import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";
import { Text } from "tw-components";

const Deploy: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Deploy",
        description: "The next-gen contract deployment flow.",
      }}
    >
      <Hero
        name="Deploy"
        title="The next-gen contract deployment flow."
        description="Deploy any smart contract with a single command. Get all the tools you need to get to success."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/deploy"
        image={require("public/assets/product-pages/deploy/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #5CFFE1 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="One-line contract deployment"
            icon={require("/public/assets/product-pages/deploy/hero-icon-1.png")}
          >
            Compile and deploy any smart contract with the{" "}
            <Text as="span" size="body.lg" fontWeight="medium" color="white">
              npx thirdweb deploy
            </Text>{" "}
            command. No more copying ABIs or generating bindings.
          </ProductCard>
          <ProductCard
            title="Deploy directly from your wallet"
            icon={require("/public/assets/product-pages/deploy/hero-icon-2.png")}
          >
            Stop using insecure and unfunded private keys for local deploys.
            Deploy from your wallet on the browser.
          </ProductCard>
          <ProductCard
            title="Auto-generated tooling"
            icon={require("/public/assets/product-pages/deploy/hero-icon-3.png")}
          >
            Get auto-generated SDKs and Dashboards to interact with and manage
            your contracts.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

Deploy.pageId = PageId.DeployLanding;

export default Deploy;

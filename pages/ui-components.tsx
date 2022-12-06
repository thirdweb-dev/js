import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const UIComponents: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "UI Components",
        description: "Plug-and-play frontend components",
      }}
    >
      <Hero
        trackingCategory="ui_components"
        name="UI Components"
        title="Plug-and-play frontend components"
        description="A collection of plug-and-play UI components that let you easily add web3 functionality to your apps."
        buttonText="Start building"
        buttonLink="https://portal.thirdweb.com/sdk/ui-components"
        image={require("public/assets/product-pages/ui-components/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 16.94%, #40FFAF 86.73%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Out-of-the-box functionality"
            icon={require("/public/assets/product-pages/ui-components/hero-icon-1.png")}
          >
            No need to worry about handling network mismatches, displaying and
            disconnected wallets, handling file-types, and other details. We
            handle everything for you so you can focus on building.
          </ProductCard>
          <ProductCard
            title="Integrate with the ecosystem"
            icon={require("/public/assets/product-pages/ui-components/hero-icon-2.png")}
          >
            Our components have native integrations with all of the most popular
            networks and wallets.
          </ProductCard>
          <ProductCard
            title="Add your personal touch"
            icon={require("/public/assets/product-pages/ui-components/hero-icon-3.png")}
          >
            All our UI components are fully customizable, allowing you to
            seamlessly integrate them into your apps.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

UIComponents.pageId = PageId.UIComponentsLanding;

export default UIComponents;

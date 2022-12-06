import { ThirdwebNextPage } from "./_app";
import { SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { PageId } from "page-id";

const Dashboard: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Dashboards",
        description: "Dashboards to manage your web3 apps.",
      }}
    >
      <Hero
        trackingCategory="dashboards"
        name="Dashboards"
        title="Dashboards to manage your web3 apps."
        description="Everything you need to analyze and manage your web3 applications."
        buttonText="Get started"
        buttonLink="/dashboard"
        image={require("public/assets/product-pages/dashboard/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #B4F1FF 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Your contracts, at your fingertips"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
          >
            Easily keep track of your contracts, read on-chain data, view logs,
            send transactions, and more..
          </ProductCard>
          <ProductCard
            title="Built with teams in mind"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
          >
            Integrate your team or organization on-chain, delegate permissions,
            and manage your treasury.
          </ProductCard>
          <ProductCard
            title="Complete analytics and reports"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
          >
            All your on-chain analytics in one place. Auto-generated reports to
            gather insights.
          </ProductCard>
        </SimpleGrid>
      </Hero>
    </ProductPage>
  );
};

Dashboard.pageId = PageId.DashboardLanding;

export default Dashboard;

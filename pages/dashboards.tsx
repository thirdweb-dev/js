import { GuidesShowcase } from "../components/product-pages/common/GuideShowcase";
import { ProductSection } from "../components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "../components/video-embed/YoutubeEmbed";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const GUIDES = [
  {
    title: "How to verify a Custom Contract on Etherscan using the dashboard",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/verification.png",
    link: "https://blog.thirdweb.com/guides/how-to-verify-a-custom-contract-on-etherscan/",
  },
  {
    title: "How to Add Permissions to Your Smart Contract in Solidity",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/This-is-the-one--13-.png",
    link: "https://blog.thirdweb.com/guides/how-to-add-permissions-to-your-smart-contract-contractkit/",
  },
];

const TRACKING_CATEGORY = "dashboards";

const Dashboard: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Dashboards",
        description: "Dashboards to manage your web3 apps.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/dashboards.png`,
              width: 2334,
              height: 1260,
              alt: "thirdweb Dashboards",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Dashboards"
        title="Dashboards to manage your web3 apps."
        description="Manage, analyze, and interact with all of your deployed contracts conveniently from a single place."
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
          py={{ base: 12, lg: 24 }}
        >
          <ProductCard
            title="Monitor contract activity"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
          >
            Get fast insights into your contract activity. Unlock features in
            Dashboard for each extension implemented in your contract. (e.g.
            view all NFTs that have been minted so far)
          </ProductCard>
          <ProductCard
            title="Interact with contracts"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
          >
            Fine-tune contract behavior with quick access to contract
            configurations (e.g. royalty, primary sale fee, etc.)
          </ProductCard>
          <ProductCard
            title="Collaborate with team"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
          >
            Share contract management access with your team members. Control
            team access to contracts with permissions. Safe is supported.
          </ProductCard>
        </SimpleGrid>
        <ProductSection py={{ base: 12, lg: 24 }}>
          <Flex alignItems="center" flexDirection="column">
            <Heading
              as="h2"
              size="display.sm"
              textAlign="center"
              mb={12}
              maxW={800}
            >
              Build contracts for your web3 apps and games
            </Heading>
            <YoutubeEmbed
              maxWidth={680}
              videoId="oH8v7YJ51Ho"
              aspectRatio={16 / 9}
              title="How to Verify a Custom Contract on Etherscan using a Dashboard"
            />
          </Flex>
        </ProductSection>

        {/* Guides */}
        <GuidesShowcase
          title="Learn how to build"
          category={TRACKING_CATEGORY}
          description="Check out our guides to learn how to use Dashboard"
          guides={GUIDES}
        />
      </Hero>
    </ProductPage>
  );
};

Dashboard.pageId = PageId.DashboardLanding;

export default Dashboard;

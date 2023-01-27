import { Flex, SimpleGrid } from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "components/video-embed/YoutubeEmbed";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "deploy";

const GUIDES = [
  {
    title: "Deploy Smart Contracts From A Gnosis Safe",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/11/This-is-the-one--20-.png",
    link: "https://blog.thirdweb.com/guides/how-to-deploy-smart-contract-using-gnosis-safe/",
  },
  {
    title: "How to Deploy Any Smart Contract Using the thirdweb CLI",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/10/This-is-the-one-10.png",
    link: "https://blog.thirdweb.com/guides/how-to-deploy-any-smart-contract-using-thirdweb-cli/",
  },
  {
    title: "Introducing thirdweb Deploy",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/09/Blog-thumbnail_tw-deploy.png",
    link: "https://blog.thirdweb.com/thirdweb-deploy/",
  },
];

const Deploy: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Deploy",
        description: "Simple contract deployment workflow for teams",
      }}
    >
      {/* hero */}
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Deploy"
        title="Simple contract deployment workflow for teams"
        description="Deploy contracts on-chain with a simple deployment workflow designed for team collaboration."
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
            title="1-line contract deployment"
            icon={require("/public/assets/product-pages/deploy/hero-icon-1.png")}
          >
            {/* span required for inline-context */}
            <span>
              Compile and deploy any smart contract with the CLI{" "}
              <Text as="span" size="body.lg" fontWeight="medium" color="white">
                npx thirdweb deploy
              </Text>{" "}
              command. No more copying ABIs or generating bindings.
            </span>
          </ProductCard>
          <ProductCard
            title="Deploy from your wallet"
            icon={require("/public/assets/product-pages/deploy/hero-icon-2.png")}
          >
            Enable non-technical team members to deploy contracts without
            relying on engineers. Deploy directly from your browser. No need to
            deal with insecure and unfunded private keys or scripts required
            with local deploys.
          </ProductCard>
          <ProductCard
            title="Unlock powerful tooling"
            icon={require("/public/assets/product-pages/deploy/hero-icon-3.png")}
          >
            Unlock access to powerful tooling that allow you to easily build
            apps on top of your contracts, including SDKs and Dashboard.
          </ProductCard>
        </SimpleGrid>
      </Hero>

      {/* Video Embed section*/}
      <ProductSection py={{ base: 12, lg: 24 }}>
        <Flex alignItems="center" flexDirection="column">
          <Heading
            as="h2"
            size="display.sm"
            textAlign="center"
            mb={12}
            maxW={850}
          >
            Deploy contracts to unlock powerful SDKs and Dashboard
          </Heading>
          <YoutubeEmbed
            maxWidth={680}
            title="Deploy contracts to unlock powerful SDKs and Dashboard"
            aspectRatio={16 / 10}
            videoId="6EqumMCa-E8"
          />
        </Flex>
      </ProductSection>

      {/* Guides */}
      <GuidesShowcase
        title="Learn how to build"
        category={TRACKING_CATEGORY}
        description="Check out our guides to learn how to build with Deploy"
        solution="Deploy"
        guides={GUIDES}
      />
    </ProductPage>
  );
};

Deploy.pageId = PageId.DeployLanding;

export default Deploy;

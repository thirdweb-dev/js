import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { SDKSection } from "components/homepage/sections/SDKSection";
import { LOGO_OPTIONS } from "components/product-pages/common/CodeOptionButton";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const SDK_GUIDES = [
  {
    title: "Interact with Any Smart Contract in the SDK using ABIs",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/how-to-use-any-contract-3.png",
    link: "https://blog.thirdweb.com/guides/how-to-use-any-smart-contract-with-thirdweb-sdk-using-abi/",
  },
  {
    title: "How to Render NFT Metadata In a React App",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/This-is-the-one--18-.png",
    link: "https://blog.thirdweb.com/guides/how-to-render-nft-metadata-in-a-react-app-using-thirdwebnftmedia/",
  },
  {
    title: "Get Started with the Unity SDK",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/12/This-is-the-one--36-.png",
    link: "https://blog.thirdweb.com/guides/get-started-with-thirdwebs-unity-sdk/",
  },
];

const Web3SDK: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "SDKs",
        description: "Everything you need to build web3 apps",
      }}
    >
      <Hero
        trackingCategory="sdks"
        name="SDKs"
        title="Everything you need to build web3 apps"
        description="Build web3 applications that can interact with your smart contracts using our powerful SDKs and CLI."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/sdk"
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
            title="Speaks your language"
            icon={require("/public/assets/product-pages/sdk/hero-icon-1.png")}
          >
            Use SDKs in programming languages that you are most comfortable
            with.
            <Flex
              h="full"
              justifyContent="flex-end"
              alignItems="flex-end"
              gap={3}
            >
              {Object.keys(LOGO_OPTIONS).map((key) => (
                <Icon
                  boxSize={6}
                  key={key}
                  as={LOGO_OPTIONS[key as keyof typeof LOGO_OPTIONS].icon}
                  fill={LOGO_OPTIONS[key as keyof typeof LOGO_OPTIONS].fill}
                />
              ))}
            </Flex>
          </ProductCard>
          <ProductCard
            title="Accelerate time-to-market"
            icon={require("/public/assets/product-pages/sdk/hero-icon-2.png")}
          >
            Utilities for common use cases so that you do not have to reinvent
            the wheel every time and have shorter development cycles.
          </ProductCard>
          <ProductCard
            title="Simplifying web3 complexity"
            icon={require("/public/assets/product-pages/sdk/hero-icon-3.png")}
          >
            Build apps and games that interact with contracts easily. Thorough
            developer documentation on following best practices. No need to
            configure manually for each partner provider.
          </ProductCard>
        </SimpleGrid>
      </Hero>
      <ProductSection pb={{ base: 12, lg: 24 }}>
        <SDKSection />
      </ProductSection>

      <ProductSection>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, md: 24 }}
        >
          <ProductLearnMoreCard
            title="Frontend applications"
            description="Build the frontend of your apps and games using our SDKs. This is best suited for when you need users to connect their wallets to interact with contracts."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/sdk/set-up-the-sdk/frontend"
          />
          <ProductLearnMoreCard
            title="Backend applications"
            description="Build the backend of your apps and games using our SDKs. Backend apps are best suited for when you need to perform actions from your wallet or simply need to read data."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="https://portal.thirdweb.com/sdk/set-up-the-sdk/backend"
          />
        </SimpleGrid>
      </ProductSection>

      <GuidesShowcase
        title="Learn how to build"
        description="Check out our guides to starty building with our SDKs."
        solution="SDK"
        guides={SDK_GUIDES}
      />
    </ProductPage>
  );
};

Web3SDK.pageId = PageId.Web3SDKLanding;

export default Web3SDK;

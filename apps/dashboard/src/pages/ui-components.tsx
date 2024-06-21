import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { GuidesShowcase } from "../components/product-pages/common/GuideShowcase";
import { ProductLearnMoreCard } from "../components/product-pages/common/ProductLearnMoreCard";
import { ProductSection } from "../components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "../components/video-embed/YoutubeEmbed";

const TRACKING_CATEGORY = "ui_components";

const GUIDES = [
  {
    title: "Add a Connect Wallet Button to Your Website",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-4.png",
    link: "https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton",
  },
  {
    title: "Seamless Onchain Payments with thirdweb Pay",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2024/05/Introducing-thirdweb-Pay-1.png",
    link: "https://blog.thirdweb.com/introducing-thirdweb-pay/",
  },
];

const UIComponents: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "UI Components",
        description: "Plug-and-play frontend components",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/ui-components.png`,
              width: 2334,
              height: 1260,
              alt: "thirdweb UI Components",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="UI Components"
        title="Plug-and-play frontend components"
        description="Integrate plug-and-play UI components into your web3 apps easily."
        buttonText="Start building"
        buttonLink="https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton"
        image={require("../../public/assets/product-pages/ui-components/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 16.94%, #40FFAF 86.73%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, lg: 24 }}
        >
          <ProductCard
            title="Accelerate time-to-market"
            icon={require("/public/assets/product-pages/ui-components/hero-icon-1.png")}
          >
            Utilities for common web3 frontend use cases, e.g. enable connect
            wallet, render NFTs metadata, and more. Faster development cycles
            because you do not have to reinvent the wheel every time.
          </ProductCard>
          <ProductCard
            title="Simplifying web3 complexity"
            icon={require("/public/assets/product-pages/ui-components/hero-icon-2.png")}
          >
            We have thorough developer documentation on following best
            practices. No need to worry about configuring for each partner
            provider, handling file-type inconsistencies, etc.
          </ProductCard>
          <ProductCard
            title="Customizable UI components"
            icon={require("/public/assets/product-pages/ui-components/hero-icon-3.png")}
          >
            All of our UI components are fully customizable which you can
            fine-tune for your specific use case.
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
              Build the Best Web3 Onboarding
            </Heading>
            {/* https://www.youtube.com/watch?v=GOxcsEZzy6g  */}
            <YoutubeEmbed
              maxWidth={680}
              videoId="GOxcsEZzy6g"
              aspectRatio={16 / 9}
              title="How to Add a Connect Wallet Button to your Web3 App (NFT Collections, Marketplaces, DAOs)"
            />
          </Flex>
        </ProductSection>

        <ProductSection py={{ base: 12, lg: 24 }}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={14}>
            <ProductLearnMoreCard
              icon={require("/public/assets/product-pages/authentication/sign-in.png")}
              category={TRACKING_CATEGORY}
              title="Connect Wallet"
              description="Easily allow users to sign in using their crypto wallets with multiple wallet options (e.g. Coinbase, Metamask, WalletConnect, and more)."
              href="https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton"
            />
            <ProductLearnMoreCard
              icon={require("../../public/assets/product-pages/connect/icon-pay.png")}
              category={TRACKING_CATEGORY}
              title="Pay Embed"
              description="Pay allows your users to purchase cryptocurrencies and execute transactions with their credit card or debit card, or with any token"
              href="https://portal.thirdweb.com/connect/pay/overview"
            />
            <ProductLearnMoreCard
              icon={require("../../public/assets/product-icons/contracts.png")}
              category={TRACKING_CATEGORY}
              title="Transaction Button"
              description="Enables calling any function on any smart contract with one click."
              href="https://portal.thirdweb.com/typescript/v5/react/components/TransactionButton"
            />
            <ProductLearnMoreCard
              icon={require("../../public/assets/product-icons/storage.png")}
              category={TRACKING_CATEGORY}
              title="IPFS Metadata Renderer"
              description="Consistent display of media assets of NFTs with metadata stored on IPFS for all file types (image or video)."
              href="https://portal.thirdweb.com/typescript/v5/react/components/MediaRenderer"
            />
          </SimpleGrid>
        </ProductSection>

        <GuidesShowcase
          title="Learn how to build"
          category={TRACKING_CATEGORY}
          description="Check out our guides to learn how to build with UI components"
          solution="UI Components"
          guides={GUIDES}
        />
      </Hero>
    </ProductPage>
  );
};

UIComponents.pageId = PageId.UIComponentsLanding;

export default UIComponents;

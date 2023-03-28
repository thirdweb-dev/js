import { Flex, SimpleGrid } from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "components/video-embed/YoutubeEmbed";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const GUIDES = [
  {
    title: "Build An ERC721A NFT Collection using Solidity",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/08/thumbnail-19.png",
    link: "https://blog.thirdweb.com/guides/get-started-with-the-contracts-sdk/",
  },
  {
    title: "Create A Generative Art NFT Collection Using Solidity & JavaScript",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/08/This-is-the-one--8-.png",
    link: "https://blog.thirdweb.com/guides/create-a-generative-art-nft-collection-using-solidity-javascript/",
  },
  {
    title: "Build a Blockchain Game using ContractKit",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/Group-625858--1-.png",
    link: "https://blog.thirdweb.com/guides/build-a-blockchain-game-using-contractkit/",
  },
];

const TRACKING_CATEGORY = "contract_kit";

const ContractExtensions: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "ContractKit",
        description: "Build your own contract easily",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/contractkit.png`,
              width: 2334,
              height: 1260,
              alt: "thirdweb ContractKit",
            },
          ],
        },
      }}
    >
      {/* hero section */}
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="ContractKit"
        title="Build your own contract easily"
        description="Build your own contracts easily using ContractKit. Base contracts that can be configured with extensions to meet your specific use case."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/solidity"
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
            Fully featured base contracts (ERC721, ERC1155, ERC20) that are
            extendable. Build contracts for all types of web3 apps and games.
          </ProductCard>
          <ProductCard
            title="Extensions to add functionality"
            icon={require("/public/assets/product-pages/extensions/hero-icon-2.png")}
          >
            Use extensions to override or add functionality to fine-tune
            contract behavior, e.g. Royalties, Permissions, Staking, etc.
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

      {/* Video Embed section*/}
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
            videoId="G3IHeKhVtpQ"
            aspectRatio={16 / 9}
            title="Introducing ContractKit: The Web3 Tool for Base Contracts, Basic Contracts, and Extensions"
          />
        </Flex>
      </ProductSection>

      {/* Learn More section */}
      <ProductSection py={{ base: 12, lg: 24 }}>
        <Heading
          as="h2"
          size="display.sm"
          fontWeight={700}
          textAlign="center"
          mb={{ base: 16, lg: 24 }}
        >
          Contracts for every use case
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={14}>
          <ProductLearnMoreCard
            title="Base Contracts"
            category={TRACKING_CATEGORY}
            description="Fully featured base contracts, including ERC721, ERC1155 & ERC20. This provides capability to mint NFTs to sell on a marketplace, signature-based minting, batch lazy mint NFTs, delayed reveal and claim conditions to define how your NFTs can be claimed."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="https://portal.thirdweb.com/solidity/base-contracts"
          />
          <ProductLearnMoreCard
            title="Extensions"
            category={TRACKING_CATEGORY}
            description="Each extension that you implement in your smart contract unlocks corresponding functionality for you to utilize in the SDK."
            icon={require("/public/assets/product-pages/deploy/hero-icon-2.png")}
            href="https://portal.thirdweb.com/solidity/extensions"
          />
        </SimpleGrid>
      </ProductSection>

      {/* Guides */}
      <GuidesShowcase
        title="Learn how to build"
        category={TRACKING_CATEGORY}
        description="Check out our guides to learn how to build with ContractKit"
        solution="ContractKit"
        guides={GUIDES}
      />
    </ProductPage>
  );
};

ContractExtensions.pageId = PageId.ContractExtensionsLanding;

export default ContractExtensions;

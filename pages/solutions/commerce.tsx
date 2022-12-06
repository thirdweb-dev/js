import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { SolutionsTextImage } from "components/product-pages/common/SolutionsTextImage";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { Heading } from "tw-components";

const SHOPIFY_GUIDES = [
  {
    title: "How to Create a Token Gated Website on Shopify using thirdweb",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/create-token-gated-website-with-shopify-storefront-and-thirdweb.png",
    link: "https://blog.thirdweb.com/guides/token-nft-gated-shopify-website-thirdweb/",
  },
  {
    title: "Generate Shopify Discount Codes For NFT Holders",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/This-is-the-one--10-.png",
    link: "https://blog.thirdweb.com/guides/generate-shopify-discount-codes-for-nft-holders/",
  },
  {
    title: "Distribute NFTs on a Shopify Store",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/This-is-the-one--11-.png",
    link: "https://blog.thirdweb.com/guides/shopify-selling-an-nft-as-a-digital-asset-on-shopify-store/",
  },
];

const Commerce: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Commerce | Solutions",
        description:
          "Create web3 e-commerce apps, build token-gated websites, and sell NFTs to your audience—all with thirdweb's Shopify integration. Start here.",
        openGraph: {
          images: [
            {
              url: "https://thirdweb.com/thirdwebxshopify.png",
              width: 1200,
              height: 630,
              alt: "thirdweb x shopify",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory="commerce_kit"
        name="CommerceKit"
        title="Build Web3 Commerce apps easily"
        description="With thirdweb you can now add powerful web3 features to your Shopify storefront enabling tokengated commerce, NFT loyalty programs, digital collectible sales, and more."
        buttonText="Get started"
        buttonLink="https://blog.thirdweb.com/tag/shopify/"
        gradient="linear-gradient(147.15deg, #9BC055 30.17%, #7629E7 100.01%)"
        image={require("public/assets/solutions-pages/commerce/hero.png")}
        type="Solutions"
        underGetStarted={
          <Flex gap={2} justifyContent="center" alignItems="center">
            <Heading size="subtitle.xs" as="span" mt={1}>
              In partnership with
            </Heading>
            <ChakraNextImage
              src={require("public/assets/solutions-pages/commerce/shopify.png")}
              width="80px"
              alt="Shopify"
            />
          </Flex>
        }
        secondaryButton={{
          text: "Request demo",
          link: "https://thirdweb.typeform.com/tw-solutions",
        }}
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Recognize loyal customers with NFTs "
            icon={require("/public/assets/product-pages/extensions/hero-icon-1.png")}
          >
            Distribute NFTs to your most loyal customers and create new customer
            segments for future campaigns.
          </ProductCard>
          <ProductCard
            title="Reward customers with exclusive access"
            icon={require("/public/assets/product-pages/extensions/hero-icon-3.png")}
          >
            Reward your customers and collab with other brands by tokengating
            your storefront. Give token holders exclusive access to products,
            discounts, and more when they connect their wallet to your store.
          </ProductCard>
          <ProductCard
            title="Grow your revenue with NFT sales"
            icon={require("/public/assets/product-pages/extensions/hero-icon-2.png")}
          >
            Create additional revenue streams with NFT sales. Sell NFTs directly
            through your storefront as a new product category or bundle with a
            physical product.
          </ProductCard>
        </SimpleGrid>
      </Hero>

      <SolutionsTextImage
        image={require("public/assets/solutions-pages/commerce/reimagine.png")}
        title="Reimagine customer experiences with web3 technologies"
      />

      <ProductSection>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, md: 24 }}
        >
          <ProductLearnMoreCard
            title="Build"
            description="Prebuilt contracts or build your own with ContractKit to
                distribute NFTs through your commerce app."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="https://portal.thirdweb.com/contractkit"
          />
          <ProductLearnMoreCard
            title="Launch"
            description="Powerful SDKs enables you to build commerce apps that connects
            to users' wallets. Easily bootstrap projects with a single
            command."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
            href="https://portal.thirdweb.com/sdk"
          />
          <ProductLearnMoreCard
            title="Manage"
            description="View and interact with your Shopify store smart contracts
            directly from a user interface, e.g. view all the NFTs that have
            been minted to your most loyal customers."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/dashboard"
          />
        </SimpleGrid>
      </ProductSection>

      <GuidesShowcase
        title="Start building web3 apps on Shopify"
        description="Check out our comprehensive guides to get you started building on
            Shopify with thirdweb"
        solution="Shopify"
        guides={SHOPIFY_GUIDES}
      />

      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />
      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />
      <NewsletterSection />
    </ProductPage>
  );
};

Commerce.pageId = PageId.SolutionsCommerce;

export default Commerce;

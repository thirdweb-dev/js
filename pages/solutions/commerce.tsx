import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { SolutionsTextImage } from "components/product-pages/common/SolutionsTextImage";
import { PageId } from "page-id";
import { Heading, Link, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "commerce_kit";

const SHOPIFY_GUIDES = [
  {
    title: "Create a Shopify theme with thirdweb",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/02/This-is-the-one--1-.png",
    link: "https://blog.thirdweb.com/guides/create-a-shopify-theme-with-thirdweb/",
  },
  {
    title: "How to Create a Token Gated Website on Shopify using thirdweb",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/create-token-gated-website-with-shopify-storefront-and-thirdweb.png",
    link: "https://blog.thirdweb.com/guides/token-nft-gated-shopify-website-thirdweb/",
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
        title: "CommerceKit: The #1 Shopify SDK for Web3 eCommerce",
        description:
          "Build web3 eCommerce apps with token-gated websites, NFT loyalty programs, & digital collectibles on the blockchain. Try CommerceKit — it's free.",
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
        trackingCategory={TRACKING_CATEGORY}
        name="CommerceKit"
        title="Build Web3 Commerce apps easily"
        description="With thirdweb you can now add powerful web3 features to your Shopify storefront enabling tokengated commerce, NFT loyalty programs, digital collectible sales, and more."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/commercekit"
        gradient="linear-gradient(147.15deg, #9BC055 30.17%, #7629E7 100.01%)"
        image={require("public/assets/solutions-pages/commerce/hero.png")}
        type="Solutions"
        underGetStarted={
          <Flex gap={2} justifyContent="center" alignItems="center">
            <Heading size="subtitle.xs" as="span" mt={1}>
              In partnership with
            </Heading>
            <TrackedLink
              href="https://blockchain.shopify.dev/"
              isExternal
              category={TRACKING_CATEGORY}
              label="shopify"
            >
              <ChakraNextImage
                src={require("public/assets/solutions-pages/commerce/shopify.png")}
                width="80px"
                alt="Shopify"
              />
            </TrackedLink>
          </Flex>
        }
        secondaryButton={{
          text: "Get In Touch",
          link: "/contact-us",
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
            category={TRACKING_CATEGORY}
            description="Prebuilt contracts or build your own with the Solidity SDK to
                distribute NFTs through your commerce app."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="/explore/commerce"
          />
          <ProductLearnMoreCard
            title="Launch"
            category={TRACKING_CATEGORY}
            description="Powerful SDKs enables you to build commerce apps that connects
            to users' wallets. Easily bootstrap projects with a single
            command."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
            href="https://portal.thirdweb.com/sdk"
          />
          <ProductLearnMoreCard
            title="Manage"
            category={TRACKING_CATEGORY}
            description="View and interact with your Shopify store smart contracts
            directly from a user interface, e.g. view all the NFTs that have
            been minted to your most loyal customers."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/dashboard"
          />
        </SimpleGrid>
      </ProductSection>

      <ProductSection overflow="hidden">
        <Flex flexDir="column" py={24} align="center" gap={12}>
          <Heading as="h2" size="display.sm" textAlign="center" mb={12}>
            Build web3 commerce apps with CommerceKit across multiple use cases
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            <ProductCard
              title="Launch customer loyalty reward programs"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-1.png")}
            >
              <Text size="body.lg">
                Distribute membership passes with contracts from{" "}
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  color="white"
                  fontWeight="medium"
                  href="/explore"
                  label="use-case-explore"
                >
                  Explore
                </TrackedLink>{" "}
                or using{" "}
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  isExternal
                  color="white"
                  fontWeight="medium"
                  href={"https://portal.thirdweb.com/solidity"}
                  label="use-case-contractkit"
                >
                  Solidity SDK
                </TrackedLink>
                . Reward your customers at different stages of their journey,
                from initial free “drops” to claiming rewards at checkout.
              </Text>
            </ProductCard>
            <ProductCard
              title="Sell digital collectibles"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-2.png")}
            >
              <Text size="body.lg">
                Merchants can sell digital collectibles direct from e-commerce
                store and collect royalties from secondary sales. (e.g.
                One-of-One’s, Open Editions, Trading packs)
              </Text>
            </ProductCard>
            <ProductCard
              title="Unlock both virtual and real world experiences"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-3.png")}
            >
              <Text size="body.lg">
                Sell digital tickets with exclusive access to online and offline
                events. Enable customers to redeem virtual items for real world
                items.
              </Text>
            </ProductCard>
            <ProductCard
              title="Add web3 data to your customer funnel"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-4.png")}
            >
              <Text size="body.lg">
                Authenticate web3 users using{" "}
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  isExternal
                  color="white"
                  fontWeight="medium"
                  href={"/auth"}
                  label="use-case-auth"
                >
                  Auth
                </TrackedLink>
                . Merge data into existing CRM data stores. Get metrics and
                analytics around transactions and owners of digital assets and
                collections.
              </Text>
            </ProductCard>
          </SimpleGrid>
        </Flex>
      </ProductSection>

      <GuidesShowcase
        title="Start building web3 apps on Shopify"
        category={TRACKING_CATEGORY}
        description="Check out our comprehensive guides to get you started building on
            Shopify with thirdweb"
        solution="Shopify"
        guides={SHOPIFY_GUIDES}
      />
      <ProductSection>
        <Flex flexDir="column" gap={8} py={12} px={{ md: 12 }}>
          <Text size="body.xl" as="blockquote" align="center">
            <i>
              &quot;On platforms like Shopify, thirdweb has made building web3
              e-commerce features and apps extremely simple and quick. We can
              now worry less about the development nuances of web3 and focus
              more on what merchants/users want and find valuable.&quot;
            </i>
            <br />
            <br />- <b>Zain</b>,{" "}
            <Link
              color="blue.500"
              href="https://www.lazertechnologies.com/blog/how-to-create-a-token-gated-experience-on-shopify-using-thirdweb"
              isExternal
            >
              Lazer Technologies
            </Link>
            .
          </Text>
        </Flex>
      </ProductSection>
      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />
    </ProductPage>
  );
};

Commerce.pageId = PageId.SolutionsCommerce;

export default Commerce;

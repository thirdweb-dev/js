import {
  AspectRatio,
  Box,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { GuideCard } from "components/product-pages/common/GuideCard";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { PageId } from "page-id";
import { NewsLetterSection } from "pages";
import { ThirdwebNextPage } from "pages/_app";
import { FiArrowRight } from "react-icons/fi";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";

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
        name="Commerce"
        title="Build Web3 Commerce apps easily"
        description="With thirdweb you can now add powerful web3 features to your Shopify storefront enabling tokengated commerce, NFT loyalty programs, digital collectible sales, and more."
        buttonText="Get started"
        buttonLink="https://blog.thirdweb.com/tag/shopify/"
        gradient="linear-gradient(147.15deg, #9BC055 30.17%, #7629E7 100.01%)"
        image={require("public/assets/solutions-pages/commerce/reimagine.png")}
        type="Solutions"
        underGetStarted={
          <Flex gap={3} justifyContent="center" alignItems="center" mt={4}>
            <Heading size="subtitle.xs" as="span">
              In partnership with
            </Heading>
            <ChakraNextImage
              src={require("public/assets/solutions-pages/commerce/shopify.png")}
              width="80px"
              alt="Shopify"
            />
          </Flex>
        }
        largeImage
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

      <ProductSection>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 12, md: 12 }}
          alignItems="center"
          py={{ base: 12, md: 24 }}
        >
          <Box flex="1">
            <AspectRatio
              ratio={1}
              w="100%"
              maxW="600px"
              mx="auto"
              borderRadius="lg"
              overflow="hidden"
            >
              <ChakraNextImage
                src={require("public/assets/solutions-pages/commerce/hero.png")}
                layout="fill"
                objectFit="cover"
                alt=""
              />
            </AspectRatio>
          </Box>
          <Box flex="1">
            <Heading as="h2" size="display.sm" mb={4}>
              Reimagine customer experiences with web3 technologies
            </Heading>
          </Box>
        </Stack>
      </ProductSection>

      <ProductSection>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, md: 24 }}
        >
          <Flex direction="column" justifyContent="space-between">
            <Flex direction="column">
              <Flex alignItems="center" gap={2}>
                <ChakraNextImage
                  src={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
                  placeholder="empty"
                  alt=""
                  w={8}
                />
                <Heading size="title.sm" as="h3">
                  Build
                </Heading>
              </Flex>
              <Text size="body.lg" mt="16px">
                Prebuilt contracts or build your own with ContractKit to
                distribute NFTs through your commerce app.
              </Text>
            </Flex>
            <Box>
              <LinkButton
                href="https://portal.thirdweb.com/contractkit"
                isExternal
                color="white"
                mt={6}
              >
                Learn more
              </LinkButton>
            </Box>
          </Flex>
          <Flex direction="column" justifyContent="space-between">
            <Flex direction="column">
              <Flex alignItems="center" gap={2}>
                <ChakraNextImage
                  src={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
                  placeholder="empty"
                  alt=""
                  w={8}
                />
                <Heading size="title.sm" as="h3">
                  Launch
                </Heading>
              </Flex>
              <Text size="body.lg" mt="16px">
                Powerful SDKs enables you to build commerce apps that connects
                to users&apos; wallets. Easily bootstrap projects with a single
                command.
              </Text>
            </Flex>
            <Box>
              <LinkButton
                href="https://portal.thirdweb.com/sdk"
                isExternal
                color="white"
                mt={6}
              >
                Learn more
              </LinkButton>
            </Box>
          </Flex>
          <Flex direction="column" justifyContent="space-between">
            <Flex direction="column">
              <Flex alignItems="center" gap={2}>
                <ChakraNextImage
                  src={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
                  placeholder="empty"
                  alt=""
                  w={8}
                />
                <Heading size="title.sm" as="h3">
                  Manage
                </Heading>
              </Flex>
              <Text size="body.lg" mt="16px">
                View and interact with your Shopify store smart contracts
                directly from a user interface, e.g. view all the NFTs that have
                been minted to your most loyal customers.
              </Text>
            </Flex>
            <Box>
              <LinkButton
                href="https://portal.thirdweb.com/dashboard"
                isExternal
                color="white"
                mt={6}
              >
                Learn more
              </LinkButton>
            </Box>
          </Flex>
        </SimpleGrid>
      </ProductSection>

      <ProductSection>
        <Flex
          flexDir="column"
          py={{ base: 24, lg: 36 }}
          align="center"
          gap={{ base: 6, lg: 8 }}
        >
          <Heading
            as="h2"
            size="display.sm"
            fontWeight={700}
            textAlign="center"
          >
            Start building web3 apps on Shopify
          </Heading>
          <Heading
            as="h3"
            maxW="820px"
            textAlign="center"
            color="whiteAlpha.600"
            size="subtitle.md"
          >
            Check out our comprehensive guides to get you started building on
            Shopify with thirdweb
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {SHOPIFY_GUIDES.map(({ title, image, link }) => (
              <GuideCard key={title} image={image} title={title} link={link} />
            ))}
          </SimpleGrid>
          <TrackedLink
            href="https://blog.thirdweb.com/tag/shopify/"
            category="shopify"
            label="see-all-guides"
            isExternal
          >
            <HStack>
              <Heading
                fontSize="20px"
                fontWeight="medium"
                as="p"
                lineHeight={{ base: 1.5, md: undefined }}
              >
                See all of our Shopify guides
              </Heading>
              <Icon as={FiArrowRight} />
            </HStack>
          </TrackedLink>
        </Flex>
      </ProductSection>

      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />

      {/*       <Box w="100%" as="section" zIndex={2} position="relative" bg="#030A1A">
        <Flex
          flexDir="column"
          pt={{ base: 24, md: 36 }}
          pb={{ base: 20, md: 32 }}
          px={"20px"}
          align="center"
          gap={6}
        >
          <Heading
            size="title.lg"
            maxWidth="820px"
            color="gray.200"
            textAlign="center"
            as="h3"
          >
            Working with thirdweb has been super easy, we did in a couple weeks
            what it would have taken us months to do. We are very happy with the
            results.
          </Heading>
          <Text fontSize="20px" color="white">
            - Zain Manji, Lazer Technologies Co-Founder
          </Text>
        </Flex>
      </Box> */}

      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />
      <NewsLetterSection />
    </ProductPage>
  );
};

Commerce.pageId = PageId.SolutionsCommerce;

export default Commerce;

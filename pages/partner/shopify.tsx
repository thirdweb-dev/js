import {
  AspectRatio,
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { GuideCard } from "components/product-pages/common/GuideCard";
import { ProductButton } from "components/product-pages/common/ProductButton";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { DashboardCard } from "components/product-pages/homepage/DashboardCard";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { FiArrowRight } from "react-icons/fi";
import { Heading, Text, TrackedLink } from "tw-components";

const SHOPIFY_GUIDES = [
  {
    title: "Generate Shopify Discount Codes For NFT Holders",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/This-is-the-one--10-.png",
    link: "https://blog.thirdweb.com/guides/generate-shopify-discount-codes-for-nft-holders/",
  },
  {
    title: "Sell NFTs on a Shopify Store",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/10/This-is-the-one--11-.png",
    link: "https://blog.thirdweb.com/guides/shopify-selling-an-nft-as-a-digital-asset-on-shopify-store/",
  },
];

const Shopify: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Shopify | Partners & Integrations",
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
      <Center
        w="100%"
        as="section"
        flexDirection="column"
        bg="#030A1A"
        padding={{ base: 0, md: "64px" }}
      >
        <SimpleGrid
          as={Container}
          maxW="container.page"
          borderRadius={{ base: 0, md: 24 }}
          columns={{ base: 1, md: 9 }}
          padding={0}
          margin={{ base: "0px", md: "40px" }}
          mb={0}
          minHeight="578px"
        >
          <Flex
            gridColumnEnd={{ base: undefined, md: "span 6" }}
            padding={{ base: "24px", md: "48px" }}
            pt={{ base: "36px", md: undefined }}
            borderLeftRadius={{ base: 0, md: 24 }}
            flexDir="column"
            gap={{ base: 6, md: "32px" }}
            align={{ base: "initial", md: "start" }}
            justify={{ base: "start", md: "center" }}
          >
            <Flex gap={4}>
              <AspectRatio
                display={{ base: "block", md: "none" }}
                ratio={1}
                flexShrink={0}
                w="48px"
              >
                <ChakraNextImage
                  alt=""
                  src={require("public/assets/partner-pages/shopify/hero.png")}
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </AspectRatio>
              <Heading
                as="h2"
                size="title.xl"
                textAlign={{ base: "left", md: "left" }}
              >
                Build web3 ecommerce apps with thirdweb and Shopify
              </Heading>
            </Flex>
            <Heading
              as="h3"
              size="subtitle.md"
              fontSize={{ base: "18px", md: "24px" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Build web3 ecommerce apps easily. Add powerful web3 functionality
              to your ecommerce store with token-gated commerce, NFT loyalty
              programs, and more. We have simplified the development workflow so
              that you can focus on creating value for your users and leave all
              the complexity to us.
            </Heading>
            <Stack
              spacing={5}
              direction={{ base: "column", lg: "row" }}
              align={"center"}
              mt="24px"
            >
              <ProductButton
                maxW="260px"
                title="Start building"
                href="/programs"
                color="blackAlpha.900"
                bg="white"
              />
            </Stack>
          </Flex>

          <Center
            display={{ base: "none", md: "block" }}
            gridColumnEnd={{ base: undefined, md: "span 3" }}
          >
            <Flex justifyContent={{ base: "center", md: "flex-end" }} w="100%">
              <AspectRatio ratio={1} w="100%">
                <ChakraNextImage
                  alt=""
                  src={require("public/assets/partner-pages/shopify/hero.png")}
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </AspectRatio>
            </Flex>
          </Center>
        </SimpleGrid>
      </Center>

      <ProductSection>
        <Flex
          flexDir="column"
          py={{ base: 24, lg: 36 }}
          align="center"
          gap={{ base: 12, lg: 24 }}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <DashboardCard
              title={"Unlock new value for merchants and customers"}
              subtitle={`
                Explore web3 ecommerce use cases, including: token-gated storefronts, rewarding customer loyalty with NFTs. 
                This is made possible with thirdweb SDKs which you can use to listen to your Shopify store’s purchase events.
              `}
              rightImage={require("public/assets/landingpage/thirdweb-teams.png")}
              gradientBGs={{
                topGradient: "#8752F3",
                bottomGradient: "#28E0B9",
                rightGradient: "#9945FF",
                leftGradient: "#19FB9B",
              }}
            />
            <DashboardCard
              title={"Intuitive dashboards to interact with contracts"}
              subtitle={`
                Monitor, configure, and interact with all your Shopify store smart contracts directly from Dashboard.
                For instance, you can view all the NFTs that have been minted to your most loyal customers.
              `}
              rightImage={require("public/assets/landingpage/contracts.png")}
              gradientBGs={{
                rightGradient: "#8752F3",
                leftGradient: "#28E0B9",
                bottomGradient: "#9945FF",
                topGradient: "#19FB9B",
              }}
            />
            <DashboardCard
              title={"Learn how to build web3 ecommerce apps"}
              subtitle={`
                We have everything you need to learn how to build web3 ecommerce apps from scratch, including: guides, templates, and case studies 
              `}
              rightImage={require("public/assets/landingpage/analytics.png")}
              gradientBGs={{
                bottomGradient: "#8752F3",
                topGradient: "#28E0B9",
                leftGradient: "#9945FF",
                rightGradient: "#19FB9B",
              }}
            />
          </SimpleGrid>
        </Flex>
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
            Learn how to build with web3 on Shopify
          </Heading>
          <Heading
            as="h3"
            maxW="820px"
            textAlign="center"
            color="whiteAlpha.600"
            size="subtitle.md"
          >
            Check out our comprehensive guides to get you started building on
            Shopify with thirdweb.
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

      <Box w="100%" as="section" zIndex={2} position="relative" bg="#030A1A">
        <Flex
          flexDir="column"
          pt={{ base: 24, md: 36 }}
          pb={{ base: 20, md: 32 }}
          px={"20px"}
          align="center"
        >
          <Text
            fontSize="20px"
            maxWidth="820px"
            color="white"
            textAlign="center"
          >
            &quot;The shift to [web3] infrastructure is already underway, and
            thirdweb has built an incredible platform that will accelerate that
            shift. [...] This strategic investment and collaboration with
            thirdweb will simplify the development of blockchain enabled
            applications and help ensure the Shopify developer ecosystem has the
            tools they need to effectively build on web3.&quot;
            <br />
            <br />
          </Text>
          <Text fontSize="20px" color="white">
            - Brandon Chu, VP of Product Acceleration
          </Text>
          <AspectRatio ratio={1} w="320px" height="180px">
            <ChakraNextImage
              alt=""
              src={require("public/assets/partner-pages/shopify/shopify-logo.png")}
              layout="fill"
              objectFit="contain"
              priority
            />
          </AspectRatio>
        </Flex>
      </Box>

      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />

      <Box w="100%" as="section" zIndex={2} position="relative" bg="#030A1A">
        <Flex
          flexDir="column"
          pb={{ base: 24, md: 36 }}
          pt={{ base: 20, md: 32 }}
          align="center"
          gap={{ base: 6, md: 8 }}
        >
          <Stack align="center" spacing={12}>
            <Heading
              as="h2"
              size="display.sm"
              maxW="820px"
              fontWeight={700}
              textAlign="center"
            >
              Build web3 ecommerce experiences with thirdweb and Shopify
            </Heading>
            <HStack spacing={5}>
              <ProductButton
                maxW="260px"
                title="Start building"
                href="https://blog.thirdweb.com/tag/shopify/"
                color="blackAlpha.900"
                bg="white"
              />
            </HStack>
          </Stack>
        </Flex>
      </Box>
    </ProductPage>
  );
};

Shopify.pageId = PageId.PartnerShopify;

export default Shopify;

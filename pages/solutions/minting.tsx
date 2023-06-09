import { Box, Flex, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { DeployAndAirdrop } from "components/homepage/DeployAndAirdrop";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { PageId } from "page-id";
import { Heading, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "minting_kit";

const CASE_STUDIES = [
  {
    title: "Paper",
    description:
      "Used thirdweb's embedded minting SDK to launch their Quickstart product allowing non-crypto customers to launch an NFT collection in two steps.",
    image: require("public/assets/solutions-pages/minting/paper-minting.png"),
    link: "https://blog.withpaper.com/deploy-thirdweb-nft-contracts-using-paper/",
  },
  {
    title: "Polygon 0xmint",
    description:
      "Integrated thirdweb's minting solution into the 0xmint minting API to allow developers to launch new NFT collections.",
    image: require("public/assets/solutions-pages/minting/polygon-0xmint.png"),
    link: "https://0xmint.io/",
  },
];

const Minting: ThirdwebNextPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <ProductPage
      seo={{
        title: "Minting | Solutions",
        description:
          "Enable your users to mint, deploy and distribute NFTS through your app with only a few lines of code.",
        // @TODO
        // openGraph: {
        //   images: [
        //     {
        //       url: "https://thirdweb.com/thirdwebxshopify.png",
        //       width: 1200,
        //       height: 630,
        //       alt: "thirdweb x shopify",
        //     },
        //   ],
        // },
      }}
    >
      <Hero
        name="Minting"
        title="Mint and distribute NFTs easily"
        description="Enable your users to mint, deploy and distribute NFTS through your app with only a few lines of code."
        trackingCategory={TRACKING_CATEGORY}
        buttonText="Get started"
        type="Solutions"
        buttonLink="https://portal.thirdweb.com/minting/getting-started/deploying-smart-contract"
        gradient="linear-gradient(145.96deg, rgb(142 14 255) 5.07%, #16bdf0 100%)"
        image={require("public/assets/solutions-pages/minting/hero.png")}
        secondaryButton={{
          text: "Get In Touch",
          link: "https://thirdweb.typeform.com/to/fMIj602T#hubspot_utk=xxxxx&hubspot_page_name=xxxxx&hubspot_page_url=xxxxx",
        }}
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Go-to-market faster"
            icon={require("/public/assets/product-pages/extensions/hero-icon-1.png")}
          >
            <Box as="span">
              A Web3 API that allows you to easily interact with contracts and
              integrate with your existing web2 systems. Simplify the
              development process by consolidating multiple libraries, vendors,
              and contract interactions into a single SDK.
            </Box>
          </ProductCard>
          <ProductCard
            title="Flexible Configuration"
            icon={require("/public/assets/product-pages/extensions/hero-icon-2.png")}
          >
            Build your own minting solution with embeddable SDKs, self-hosted
            minting API or use thirdweb managed service minting API.
          </ProductCard>
          <ProductCard
            title="Owned by you"
            icon={require("/public/assets/product-pages/extensions/hero-icon-3.png")}
          >
            Non-custodial ownership model. Apps and contracts built with our
            tools are completely owned by you. No other parties have control
            over your apps and contracts.
          </ProductCard>
        </SimpleGrid>
      </Hero>

      <ProductSection p={0}>
        <Flex flexDir="column" gap={4} pt={{ base: 12, md: 24 }}>
          <Heading as="h2" size="display.sm" textAlign="center">
            Create and transfer NFTs easily
          </Heading>
          <DeployAndAirdrop />
        </Flex>
      </ProductSection>

      <ProductSection>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, md: 24 }}
        >
          <ProductLearnMoreCard
            title="Build"
            category={TRACKING_CATEGORY}
            description={
              <>
                A broad set of options for{" "}
                <TrackedLink
                  href="https://portal.thirdweb.com/typescript/extensions"
                  isExternal
                  category={TRACKING_CATEGORY}
                  label="distributing_nfts"
                  color="primary.500"
                >
                  distributing NFTs
                </TrackedLink>{" "}
                including claimable drops, private/public sales, airdrops, open
                editions, delayed reveals as well as free/gasless mints using a
                Gasless Relayer.
              </>
            }
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
          />
          <ProductLearnMoreCard
            title="Launch"
            category={TRACKING_CATEGORY}
            description={
              <>
                Integrate minting into applications using a variety of web3 API
                configurations including as an{" "}
                <TrackedLink
                  href="https://portal.thirdweb.com/"
                  isExternal
                  category={TRACKING_CATEGORY}
                  label="embedded_sdk"
                  color="primary.500"
                >
                  embedded SDK
                </TrackedLink>
                , self-hosted via a web3 REST API or as a managed service.
              </>
            }
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
            href="https://portal.thirdweb.com/deploy"
          />
          <ProductLearnMoreCard
            title="Manage"
            category={TRACKING_CATEGORY}
            description={
              <>
                Analytics via a{" "}
                <TrackedLink
                  href="/dashboard"
                  category={TRACKING_CATEGORY}
                  label="dashboard"
                  color="primary.500"
                >
                  Dashboard
                </TrackedLink>{" "}
                and API for balances, gas spent, transactions and owners.
              </>
            }
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/dashboard"
          />
        </SimpleGrid>
      </ProductSection>

      {/* Use cases */}
      <ProductSection overflow="hidden">
        <Flex flexDir="column" py={24} align="center" gap={{ base: 8, md: 4 }}>
          <Heading as="h2" size="display.sm" textAlign="center">
            Build complete NFT experiences with our Minting solution
          </Heading>
          <ChakraNextImage
            src={
              isMobile
                ? require("/public/assets/solutions-pages/minting/what-can-you-build-mobile.png")
                : require("/public/assets/solutions-pages/minting/what-can-you-build.png")
            }
            alt="What can you build with our minting solution"
          />
        </Flex>
      </ProductSection>

      <GuidesShowcase
        title="Powering top web3 projects"
        description="Learn how other web3 projects are using our minting solution."
        category={TRACKING_CATEGORY}
        guides={CASE_STUDIES}
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
    </ProductPage>
  );
};

Minting.pageId = PageId.SolutionsMinting;

export default Minting;

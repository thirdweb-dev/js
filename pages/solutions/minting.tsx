import {
  Box,
  Flex,
  Icon,
  ListItem,
  SimpleGrid,
  UnorderedList,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { DeployAndAirdrop } from "components/homepage/DeployAndAirdrop";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { PageId } from "page-id";
import { FiArrowRight } from "react-icons/fi";
import { Heading, Text, TrackedLink } from "tw-components";
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
        <Flex flexDir="column" py={24} align="center" gap={{ base: 8, md: 12 }}>
          <Heading as="h2" size="display.sm" textAlign="center">
            Build complete NFT experiences with our Minting solution
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            <ProductCard
              title="For Cloud & Web Services"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-1.png")}
            >
              <Text size="body.lg">
                A minting API that is easily integrated into your existing web2
                systems. Enable developers to quickly build and deploy web3
                applications
              </Text>
              <UnorderedList>
                <ListItem>
                  <Text size="body.lg" my={4}>
                    Launch minting and web3 API based managed services
                  </Text>
                </ListItem>
                <ListItem>
                  <Text size="body.lg">
                    Enhance existing content and creator platforms with digital
                    assets{" "}
                  </Text>
                </ListItem>
              </UnorderedList>
            </ProductCard>
            <ProductCard
              title="For Chains & Platforms"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-4.png")}
            >
              <Flex
                justifyContent="space-between"
                flexDir="column"
                gap={4}
                h="full"
              >
                <Box h="full">
                  <Text size="body.lg">
                    Supercharge on-boarding for brands, apps and developers to
                    your chain
                  </Text>
                  <UnorderedList>
                    <ListItem>
                      <Text size="body.lg" mt={4}>
                        NFT Launchpad makes it easy for users to easily launch
                        new smart contracts and incorporate minting to smart
                        contracts using API call
                      </Text>
                    </ListItem>
                  </UnorderedList>
                </Box>
                <TrackedLink
                  width="auto"
                  href="https://portal.thirdweb.com/minting/getting-started/selecting-smart-contract"
                  category={TRACKING_CATEGORY}
                  label="learn_more_chains"
                  isExternal
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  role="group"
                >
                  <span>Learn more</span>{" "}
                  <Icon
                    as={FiArrowRight}
                    transform="rotate(-45deg)"
                    transition="transform 0.2s"
                    _groupHover={{
                      transform: "rotate(-45deg) translateX(2px)",
                    }}
                  />
                </TrackedLink>
              </Flex>
            </ProductCard>
            <ProductCard
              title="For Creators"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-3.png")}
            >
              <Flex
                justifyContent="space-between"
                flexDir="column"
                gap={4}
                h="full"
              >
                <Box h="full">
                  <Text size="body.lg">
                    Enable NFT minting for your users with familiar web2-like
                    user experience
                  </Text>
                  <UnorderedList>
                    <ListItem>
                      <Text my={4} size="body.lg">
                        Quests where users are rewarded with digital
                        collectibles for engagement
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text size="body.lg">
                        Music & video digital collectibles with royalty sharing
                        mechanism.
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text mt={4} size="body.lg">
                        Access-based digital collectibles for IRL ticketing &
                        events.
                      </Text>
                    </ListItem>
                  </UnorderedList>
                  <TrackedLink
                    mt={6}
                    width="auto"
                    href="https://portal.thirdweb.com/digital-collectibles"
                    category={TRACKING_CATEGORY}
                    label="learn_more_digital_collectibles"
                    isExternal
                    color="white"
                    display="flex"
                    alignItems="center"
                    gap={1}
                    role="group"
                  >
                    <span>Learn more</span>{" "}
                    <Icon
                      as={FiArrowRight}
                      transform="rotate(-45deg)"
                      transition="transform 0.2s"
                      _groupHover={{
                        transform: "rotate(-45deg) translateX(2px)",
                      }}
                    />
                  </TrackedLink>
                </Box>
              </Flex>
            </ProductCard>
            <ProductCard
              title="For Games"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-2.png")}
            >
              <Flex
                justifyContent="space-between"
                flexDir="column"
                gap={4}
                h="full"
              >
                <Box h="full">
                  <Text size="body.lg">
                    Easily connect game engines via an API to minting and
                    blockchain infrastructure
                  </Text>
                  <UnorderedList>
                    <ListItem>
                      <Text my={4} size="body.lg">
                        In-game asset digital collectibles
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text size="body.lg">Digital trading cards</Text>
                    </ListItem>
                    <ListItem>
                      <Text mt={4} size="body.lg">
                        White-label marketplaces to trade in-asset games
                      </Text>
                    </ListItem>
                  </UnorderedList>
                </Box>
                <TrackedLink
                  width="auto"
                  href="https://portal.thirdweb.com/gamingkit/quickstart"
                  category={TRACKING_CATEGORY}
                  label="learn_more_digital_games"
                  isExternal
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  role="group"
                >
                  <span>Learn more</span>{" "}
                  <Icon
                    as={FiArrowRight}
                    transform="rotate(-45deg)"
                    transition="transform 0.2s"
                    _groupHover={{
                      transform: "rotate(-45deg) translateX(2px)",
                    }}
                  />
                </TrackedLink>
              </Flex>
            </ProductCard>
          </SimpleGrid>
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

import {
  Box,
  Flex,
  Icon,
  Image,
  ListItem,
  SimpleGrid,
  UnorderedList,
} from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "components/video-embed/YoutubeEmbed";
import { replaceIpfsUrl } from "lib/sdk";
import { PageId } from "page-id";
import { FiArrowRight } from "react-icons/fi";
import {
  Card,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";
import { ThirdwebNextPage } from "utils/types";

interface NFTContractInfo {
  name: string;
  description: string;
  img: string;
  link: string;
}

const TRACKING_CATEGORY = "minting_kit";

const exploreNFTContracts: NFTContractInfo[] = [
  {
    name: "Multiwrap",
    description:
      "Bundle multiple ERC721/ERC1155/ERC20 tokens into a single ERC721.",
    img: replaceIpfsUrl(
      "ipfs://QmQm3UytP51wWMMwmDYdDHH4vCdokPqt52bUtBQoLsx5qy/edition.png",
    ),
    link: "/thirdweb.eth/Multiwrap",
  },
  {
    name: "ERC4907",
    description: "Rental NFT, ERC-721 User And Expires Extension.",
    img: replaceIpfsUrl(
      "ipfs://QmaKC631DSxDtjDcveAFVuGpSwM84icnXSGQgqrLpw3Lkh/yellow%E2%80%94360x360.png",
    ),
    link: "/doubledev.eth/ERC4907",
  },
  {
    name: "NFT Collection",
    description: "Create collection of unique NFTs.",
    img: replaceIpfsUrl(
      "ipfs://QmWARxASHf4UcWkwxTUDJxAXVDUG5STu5yBePJg35GzqjZ/nft-collection.png",
    ),
    link: "/thirdweb.eth/TokenERC721",
  },
  {
    name: "Edition",
    description: "Create editions of ERC1155 tokens.",
    img: replaceIpfsUrl(
      "ipfs://QmQm3UytP51wWMMwmDYdDHH4vCdokPqt52bUtBQoLsx5qy/edition.png",
    ),
    link: "/thirdweb.eth/TokenERC1155",
  },
  {
    name: "ERC721CommunityStream",
    description: "Equally distribute any token to community of NFT holders.",
    img: replaceIpfsUrl(
      "ipfs://QmbGjq5DY6gW1T7W7j3HEgYSAB2g4TnpzrNADTuniDXsqU/0.png",
    ),
    link: "/flairsdk.eth/ERC721CommunityStream",
  },
  {
    name: "Pack",
    description:
      "Pack multiple tokens into ERC1155 NFTs that act as randomized loot boxes.",
    img: replaceIpfsUrl(
      "ipfs://QmaLYhDh2oKxSjAS6iA434z8fvY43oAEug2AHHEMYMBU3K/pack.png",
    ),
    link: "/thirdweb.eth/Pack",
  },
];

const GUIDES = [
  {
    title: "Release an NFT Drop with an Allowlist and Multiple Claim Phases",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/08/thumbnail-13.png",
    link: "https://blog.thirdweb.com/guides/create-nft-drop-with-claim-phases/",
  },
  {
    title: "Create an ERC721A NFT Drop with Signature-Based Minting",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/08/thumbnail-39.png",
    link: "https://blog.thirdweb.com/guides/signature-drop/",
  },
  {
    title: "Create an Early Access NFT with TypeScript and React",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/08/thumbnail-22.png",
    link: "https://blog.thirdweb.com/guides/early-access-nft-with-typescript/",
  },
];

const Minting: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Minting | Solutions",
        description: "Launch and mint NFTs at scale",
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
        title="Build complete digital asset experiences"
        description="A simple all-in-one solution to build digital asset experiences, from choosing digital asset types and minting strategies to wallet creation and credit card checkout."
        trackingCategory={TRACKING_CATEGORY}
        buttonText="Get started"
        type="Solutions"
        buttonLink="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
        gradient="linear-gradient(145.96deg, rgb(142 14 255) 5.07%, #16bdf0 100%)"
        image={require("public/assets/solutions-pages/minting/hero.png")}
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
            title="Extensive digital asset types"
            icon={require("/public/assets/product-pages/extensions/hero-icon-2.png")}
          >
            <Box as="span">
              {`Discover a large collection of ready-to-deploy NFT types including
              1-of-1 collections, editions, loot boxes, dynamic from thirdweb's
              contract library (`}
              <TrackedLink
                href="https://portal.thirdweb.com/wallet"
                isExternal
                category={TRACKING_CATEGORY}
                label="wallet_sdk"
                color="primary.500"
              >
                Explore
              </TrackedLink>
              {`).`} Deploy different minting strategies including airdrops,
              free/paid claims, on demand NFTs and loot boxes.
            </Box>
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

      {/* build, launch, manage */}
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
        <Flex flexDir="column" py={24} align="center" gap={12}>
          <Heading as="h2" size="display.sm" textAlign="center" mb={12}>
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
              title="For Chains"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-4.png")}
            >
              <Text size="body.lg">
                Supercharge on-boarding for brands, apps and developers to your
                chain
              </Text>
              <UnorderedList>
                <ListItem>
                  <Text size="body.lg" mt={4}>
                    NFT Launchpad makes it easy for users to easily launch new
                    smart contracts and incorporate minting to smart contracts
                    using API call
                  </Text>
                </ListItem>
              </UnorderedList>
            </ProductCard>
            <ProductCard
              title="For Creators"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-3.png")}
            >
              <Text size="body.lg">
                Enable NFT minting for your users with familiar web2-like user
                experience
              </Text>
              <UnorderedList>
                <ListItem>
                  <Text my={4} size="body.lg">
                    Quests where users are rewarded with digital collectibles
                    for engagement
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
            </ProductCard>
            <ProductCard
              title="For Games"
              icon={require("/public/assets/solutions-pages/commerce/hero-icon-2.png")}
            >
              <Text size="body.lg">
                Easily connect game engines via an API to minting and blockchain
                infrastructure
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
            </ProductCard>
          </SimpleGrid>
        </Flex>
      </ProductSection>

      {/* Explore NFT contracts */}
      <ProductSection py={{ base: 12, md: 24 }}>
        <Heading size="title.2xl" mb={4} as="h2" textAlign="center">
          Get started with our NFT contracts
        </Heading>

        <Text fontSize="large" textAlign="center" mb={12}>
          Go to{" "}
          <Link color="white" href="https://thirdweb.com/explore" isExternal>
            Explore
          </Link>{" "}
          to deploy in 1-click.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={12}>
          {exploreNFTContracts.map((contractInfo) => {
            return (
              <article key={contractInfo.name}>
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="contract"
                  trackingProps={{
                    contract: contractInfo.name
                      .toLowerCase()
                      .replaceAll(" ", "-"),
                  }}
                  href={contractInfo.link}
                  isExternal
                  textDecoration="none !important"
                >
                  <Card
                    h="100%"
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.05)"
                    transition="border 200ms ease"
                    _hover={{
                      borderColor: "white",
                    }}
                  >
                    <Image
                      src={contractInfo.img}
                      alt=""
                      width={8}
                      mb={4}
                      borderRadius="full"
                    />
                    <Heading size="title.sm" mb={2}>
                      {contractInfo.name}
                    </Heading>
                    <Text size="body.lg">{contractInfo.description}</Text>
                  </Card>
                </TrackedLink>
              </article>
            );
          })}
        </SimpleGrid>

        <Flex justify="center" mb={8} gap={6}>
          <LinkButton
            flexShrink={0}
            size="sm"
            isExternal
            rightIcon={<Icon as={FiArrowRight} />}
            variant="link"
            href={`/explore/nft`}
            fontWeight={500}
            fontSize="20px"
          >
            View all NFT Contracts
          </LinkButton>
        </Flex>
      </ProductSection>

      {/* Guides */}
      <GuidesShowcase
        title="Start building NFT experiences"
        category={TRACKING_CATEGORY}
        description="Check out our guides to start building NFT experiences with thirdweb."
        solution="NFT-Drop"
        guides={GUIDES}
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

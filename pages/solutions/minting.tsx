import { Box, Flex, Icon, Image, SimpleGrid } from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductLearnMoreCard } from "components/product-pages/common/ProductLearnMoreCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "components/video-embed/YoutubeEmbed";
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
    img: "https://gateway.ipfscdn.io/ipfs/QmQm3UytP51wWMMwmDYdDHH4vCdokPqt52bUtBQoLsx5qy/edition.png",
    link: "/thirdweb.eth/Multiwrap",
  },
  {
    name: "ERC4907",
    description: "Rental NFT, ERC-721 User And Expires Extension.",
    img: "https://gateway.ipfscdn.io/ipfs/QmaKC631DSxDtjDcveAFVuGpSwM84icnXSGQgqrLpw3Lkh/yellow%E2%80%94360x360.png",
    link: "/doubledev.eth/ERC4907",
  },
  {
    name: "NFT Collection",
    description: "Create collection of unique NFTs.",
    img: "https://gateway.ipfscdn.io/ipfs/QmWARxASHf4UcWkwxTUDJxAXVDUG5STu5yBePJg35GzqjZ/nft-collection.png",
    link: "/thirdweb.eth/TokenERC721",
  },
  {
    name: "Edition",
    description: "Create editions of ERC1155 tokens.",
    img: "https://gateway.ipfscdn.io/ipfs/QmQm3UytP51wWMMwmDYdDHH4vCdokPqt52bUtBQoLsx5qy/edition.png",
    link: "/thirdweb.eth/TokenERC1155",
  },
  {
    name: "ERC721CommunityStream",
    description: "Equally distribute any token to community of NFT holders.",
    img: "https://gateway.ipfscdn.io/ipfs/QmbGjq5DY6gW1T7W7j3HEgYSAB2g4TnpzrNADTuniDXsqU/0.png",
    link: "/flairsdk.eth/ERC721CommunityStream",
  },
  {
    name: "Pack",
    description:
      "Pack multiple tokens into ERC1155 NFTs that act as randomized loot boxes.",
    img: "https://gateway.ipfscdn.io/ipfs/QmaLYhDh2oKxSjAS6iA434z8fvY43oAEug2AHHEMYMBU3K/pack.png",
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
        description: "Build and mint NFTs at scale easily",
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
        title="Build and mint NFTs at scale easily"
        description={
          <>
            An all-in-one toolkit to build and mint NFTs. <br />
            Create powerful NFT experiences.
          </>
        }
        trackingCategory={TRACKING_CATEGORY}
        buttonText="Get started"
        type="Solutions"
        buttonLink="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
        gradient="linear-gradient(145.96deg, rgb(142 14 255) 5.07%, #16bdf0 100%)"
        image={require("public/assets/solutions-pages/minting/hero.png")}
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Owned by you"
            icon={require("/public/assets/product-pages/extensions/hero-icon-1.png")}
          >
            Apps and contracts built with our tools are completely owned by you.
            No other parties have control over your apps and contracts.
          </ProductCard>
          <ProductCard
            title="Minting for all use cases"
            icon={require("/public/assets/product-pages/extensions/hero-icon-3.png")}
          >
            <span>
              We support all types of configurable minting mechanics for{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
                isExternal
              >
                EVM Contracts
              </Link>{" "}
              and{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/solana/nft-drop"
                isExternal
              >
                Solana programs
              </Link>
              , including:{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/signature-drop"
                isExternal
              >
                signature-based minting
              </Link>
              ,{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/nft-drop"
                isExternal
              >
                releasing a collection of unique NFTs
              </Link>
              ,{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/multiwrap"
                isExternal
              >
                wrap tokens into new wrapped NFT
              </Link>
              ,{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/pack"
                isExternal
              >
                randomized lootbox
              </Link>
              {},{" "}
              <Link
                color="white"
                href="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
                isExternal
              >
                and more
              </Link>
              .
            </span>
          </ProductCard>
          <ProductCard
            title="Unlock powerful tooling"
            icon={require("/public/assets/product-pages/extensions/hero-icon-2.png")}
          >
            Get auto-generated SDKs and dashboards to build apps on top of your
            NFT contracts and easily manage them.
          </ProductCard>
        </SimpleGrid>
      </Hero>

      {/* Video Embed section*/}
      <ProductSection py={{ base: 12, lg: 24 }}>
        <Flex alignItems="center" flexDirection="column">
          <Heading
            as="h2"
            size="title.xl"
            textAlign="center"
            mb={12}
            maxW={900}
          >
            Focus on creating powerful NFT experiences and let us handle the
            complexity
          </Heading>
          <YoutubeEmbed
            maxWidth={680}
            videoId="Eoy84LxJKEU"
            aspectRatio={16 / 9}
            title="Create an ERC721 NFT drop using thirdweb"
          />
        </Flex>
      </ProductSection>

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
                Build your own NFT and Marketplace contracts with{" "}
                <Link
                  color="white"
                  href="https://portal.thirdweb.com/contractkit"
                  isExternal
                >
                  ContractKit
                </Link>{" "}
                or discover and deploy in 1-click via{" "}
                <Link
                  color="white"
                  href="https://thirdweb.com/explore"
                  isExternal
                >
                  Explore
                </Link>
                {". "}
                Use our powerful SDKs to easily integrate NFT checkout into your
                app for easy fiat-on ramp.
              </>
            }
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
            href="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
          />
          <ProductLearnMoreCard
            title="Launch"
            category={TRACKING_CATEGORY}
            description="Deploy your NFT & Marketplace contracts on-chain with a simple contract deployment workflow designed for team collaboration"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
            href="https://portal.thirdweb.com/deploy"
          />
          <ProductLearnMoreCard
            title="Manage"
            category={TRACKING_CATEGORY}
            description="All your on-chain analytics in one place. Monitor, configure, and interact with your NFT contracts directly from a user interface."
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
            href="https://portal.thirdweb.com/dashboard"
          />
        </SimpleGrid>
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
      {/* <NewsletterSection /> */}
    </ProductPage>
  );
};

Minting.pageId = PageId.SolutionsCommerce;

export default Minting;

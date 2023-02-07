import { GuidesShowcase } from "../components/product-pages/common/GuideShowcase";
import { ProductPage } from "../components/product-pages/common/ProductPage";
import { ProductSection } from "../components/product-pages/common/ProductSection";
import { YoutubeEmbed } from "../components/video-embed/YoutubeEmbed";
import { PageId } from "../page-id";
import { ThirdwebNextPage } from "../utils/types";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { Heading } from "tw-components";

const TRACKING_CATEGORY = "storage";

const GUIDES = [
  {
    title: "Host Your Web Application On IPFS",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/This-is-the-one.png",
    link: "https://blog.thirdweb.com/guides/how-to-host-your-web-app-on-ipfs/",
  },
  {
    title: "What Is IPFS and How Does it Store NFT Metadata?",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-43.png",
    link: "https://blog.thirdweb.com/guides/securing-pinning-your-nft-with-ipfs/",
  },
  {
    title: "Host Your Web Application On IPFS",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/11/This-is-the-one.png",
    link: "https://blog.thirdweb.com/guides/how-to-host-your-web-app-on-ipfs/",
  },
];

const Storage: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Storage",
        description: "Secure, fast, decentralized storage",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/storage.png`,
              width: 2334,
              height: 1260,
              alt: "thirdweb Storage",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Storage"
        title="Secure, fast, decentralized storage"
        description="Get fast access to data stored on blockchain with a unified API that works with storage provider of your choice"
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/storage"
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #FFAE63 100.01%)"
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
          py={{ base: 12, lg: 24 }}
        >
          <ProductCard
            title="Simplifying web3 complexity"
            icon={require("/public/assets/product-pages/storage/hero-icon-1.png")}
          >
            Save development time. We handling the complexities of decentralized
            file management for you. No need to worry about fetching from
            multiple IPFS gateways, handling file and metadata upload formats,
            etc.
          </ProductCard>
          <ProductCard
            title="Fast and high availability"
            icon={require("/public/assets/product-pages/storage/hero-icon-2.png")}
          >
            Get fast upload and download speeds for decentralized storage,
            enabled by industry leading infrastructure. Upload and forget- we
            ensure that your files are always accessible.
          </ProductCard>
          <ProductCard
            title="Censorship-resistant"
            icon={require("/public/assets/product-pages/storage/hero-icon-3.png")}
          >
            Store your data with more privacy and security with our
            decentralized storage solution.
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
              Store your files in IPFS
            </Heading>
            <YoutubeEmbed
              maxWidth={680}
              videoId="wyYkpMgEVxE"
              aspectRatio={16 / 9}
              title="How to Upload Files to IPFS (Step by Step Guide)"
            />
          </Flex>
        </ProductSection>

        <GuidesShowcase
          title="Learn how to build"
          category={TRACKING_CATEGORY}
          description="Check out our guides to learn how to build with Storage"
          solution="Storage"
          guides={GUIDES}
        />
      </Hero>
    </ProductPage>
  );
};

Storage.pageId = PageId.StorageLanding;

export default Storage;

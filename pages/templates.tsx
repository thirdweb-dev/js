import {
  Box,
  DarkMode,
  Flex,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { GetStartedSection } from "components/homepage/sections/GetStartedSection";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { PageId } from "page-id";
import { Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

export interface TemplateCardProps {
  id: string;
  title: string;
  // Homepage is usually just <id>.thirdweb-example.com, but just to be safe.
  homepage: string;
  // Repo is usually just github.com/thirdweb-example/<id>, but just to be safe.
  repo: string;
  description: React.ReactNode;
  img: string;
  hoverBorderColor: string;
  tags: string[];
  authorIcon: string;
  authorENS: string;
  contractName?: string;
  contractLink?: string;
}

export const templates: TemplateCardProps[] = [
  {
    id: "loyalty-card",
    title: "Loyalty Card",
    homepage: "https://loyalty-card.thirdweb-example.com",
    repo: "https://github.com/thirdweb-example/loyalty-card/",
    description:
      "Allow users to generate a loyalty card and admins to manage the loyalty cards.",
    img: "/assets/templates/loyalty-card.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Signature minting", "Loyalty Card"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "erc721",
    title: "NFT Drop",
    homepage: "https://nft-drop.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/nft-drop",
    description:
      "Allow users to claim tokens under the criteria of claim conditions to receive ERC721 NFT(s).",
    img: "/assets/templates/nft-drop.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["ERC721", "Custom Claim Conditions"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
    contractName: "NFTDrop",
    contractLink: "https://thirdweb.com/thirdweb.eth/DropERC721",
  },
  {
    id: "marketplace-v3",
    title: "Marketplace",
    homepage: "https://marketplace-v3.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/marketplace-v3",
    description:
      "Allow holders of your NFTs to trade in a marketplace with a built-in escrow and auctioning system.",
    img: "/assets/templates/marketplace.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Multi-currency", "Buy & Sell"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
    contractName: "Marketplace",
    contractLink: "https://thirdweb.com/thirdweb.eth/MarketplaceV3",
  },
  {
    id: "nft-gated-website",
    title: "NFT Gated Website",
    homepage: "https://nft-gated-website.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/nft-gated-website",
    description:
      "Allow users to access your website only if they own a specific NFT.",
    img: "/assets/templates/nft-gated-site.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["NFT", "React", "Loyalty"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "nft-gallery",
    title: "NFT Gallery",
    homepage: "https://nft-gallery.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/nft-gallery",
    description:
      "View the metadata of all NFTs in your collection, where you can filter and sort by traits & properties.",
    img: "/assets/templates/nft-gallery.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["ERC721", "ERC1155"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "cra-javascript-starter",
    title: "CRA JavaScript Starter",
    homepage: "https://cra-javascript-starter.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/cra-typescript-starter",
    description:
      "Starter kit to build with Create React App and thirdweb without additional initial configuration.",
    img: "/assets/templates/starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["React", "JavaScript", "Web"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "cra-typescript-starter",
    title: "CRA TypeScript Starter",
    homepage: "https://cra-typescript-starter.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/cra-typescript-starter",
    description:
      "Starter kit to build with Create React App and thirdweb without additional initial configuration.",
    img: "/assets/templates/starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["React", "TypeScript", "Web"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "next-javascript-starter",
    title: "Next JavaScript Starter",
    homepage: "https://next-javascript-starter.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/next-javascript-starter",
    description:
      "Starter kit to build with Next and thirdweb without additional initial configuration.",
    img: "/assets/templates/starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Next", "JavaScript", "Web"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "next-typescript-starter",
    title: "Next TypeScript Starter",
    homepage: "https://next-typescript-starter.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/next-typescript-starter",
    description:
      "Starter kit to build with Next and thirdweb without additional initial configuration.",
    img: "/assets/templates/starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Next", "TypeScript", "Web"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "vite-javascript-starter",
    title: "Vite JavaScript Starter",
    homepage: "https://vite-javascript-starter.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/vite-javascript-starter",
    description:
      "Starter kit to build with Vite and thirdweb without additional initial configuration.",
    img: "/assets/templates/starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Vite", "TypeScript", "Web"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "vite-typescript-starter",
    title: "Vite TypeScript Starter",
    homepage: "https://vite-typescript-starter.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/vite-typescript-starter",
    description:
      "Starter kit to build with Vite and thirdweb without additional initial configuration.",
    img: "/assets/templates/starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Vite", "TypeScript", "Web"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
];

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  description,
  img,
  hoverBorderColor,
  tags,
  authorENS,
  authorIcon,
}) => {
  return (
    <Flex
      as={LinkBox}
      overflow="hidden"
      direction="column"
      zIndex={10}
      background="rgba(0,0,0,0.4)"
      boxShadow={`0 0 0 1px ${hoverBorderColor}`}
      borderRadius="8px"
      transition="box-shadow 300ms ease"
      _hover={{
        boxShadow: `0 0 80px ${hoverBorderColor}`,
      }}
    >
      <Image
        src={img}
        alt=""
        width="100%"
        height={{ lg: 196, base: 196 }}
        objectFit="cover"
      />
      <Flex
        direction="column"
        justifyContent="space-between"
        p={{ base: 6, lg: 8 }}
        py={{ base: 10 }}
        flexGrow={1}
      >
        <Box>
          <Heading as="h2" fontSize="20px" mb={3}>
            <TrackedLink
              as={LinkOverlay}
              href={`/template/${id}`}
              category="templates"
              label={title.toLowerCase()}
              color="white"
              _hover={{
                textDecoration: "none",
              }}
            >
              {title}
            </TrackedLink>
          </Heading>

          <Flex direction="row" alignItems="center" gap={1} mb={3}>
            {tags.map((tag, idx) => (
              <Box
                as="div"
                key={idx}
                color="whiteAlpha.700"
                border="1px solid #383838"
                borderRadius="8px"
                height="26px"
                padding="6px 12px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  as="span"
                  fontSize="12px"
                  fontWeight={500}
                  lineHeight={1.2}
                  letterSpacing="-0.015em"
                  opacity={0.7}
                  color="whiteAlpha.900"
                >
                  {tag}
                </Text>
              </Box>
            ))}
          </Flex>

          <Text
            size="body.md"
            lineHeight={1.7}
            color="whiteAlpha.700"
            opacity={0.7}
          >
            {description}
          </Text>
        </Box>
        <Flex
          direction="row"
          alignItems="center"
          w="fit-content"
          ml="auto"
          mt={6}
        >
          <Image
            src={authorIcon}
            alt={`Icon of ${authorENS}`}
            width="16px"
            height="16px"
            mr={1}
          />
          <Text
            as="span"
            color="whiteAlpha.900"
            lineHeight={1.5}
            fontSize="12px"
            fontWeight={500}
            letterSpacing="-0.02em"
            opacity={0.75}
          >
            {authorENS}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const Templates: ThirdwebNextPage = () => {
  return (
    <DarkMode>
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
        justify="center"
        flexDir="column"
        as="main"
      >
        <HomepageTopNav />
        <HomepageSection py={24} ml="auto" mr="auto">
          <Heading
            as="h1"
            fontSize={{ base: "64px", md: "64px" }}
            fontWeight={700}
            letterSpacing="-0.04em"
            mb={4}
            textAlign="center"
          >
            Explore{" "}
            <Text
              fontSize={{ base: "64px", md: "64px" }}
              fontWeight={700}
              letterSpacing="-0.04em"
              as="span"
              bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
              bgClip="text"
            >
              templates
            </Text>
            .
          </Heading>
          <Text
            fontSize="20px"
            textAlign="center"
            size="body.lg"
            mb={14}
            fontWeight={500}
          >
            Kickstart your development process with ready-to-ship repositories.
          </Text>
          <SimpleGrid
            columns={{ lg: 3, md: 2, base: 1 }}
            gap={6}
            margin="0 auto"
          >
            {templates.map((template, idx) => (
              <TemplateCard key={template.title + idx} {...template} />
            ))}
          </SimpleGrid>
        </HomepageSection>
      </Flex>
      <GetStartedSection />
      <NewsletterSection />
      <HomepageFooter />
    </DarkMode>
  );
};

Templates.pageId = PageId.Templates;

export default Templates;

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
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { Heading, Text, TrackedLink } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

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
    id: "unity-pioneer",
    title: "Pioneer",
    homepage: "https://thirdweb-example.github.io/unity-pioneer/",
    repo: "https://github.com/thirdweb-example/unity-pioneer",
    description:
      "Unity template featuring Account Abstraction, Session Keys, and Storage",
    img: "/assets/templates/unity-pioneer.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-take-flight",
    title: "Take Flight",
    homepage: "https://thirdweb-example.github.io/unity-take-flight/",
    repo: "https://github.com/thirdweb-example/unity-take-flight",
    description:
      "Unity template with Account Abstraction, Social Logins, and Onchain Scoring",
    img: "/assets/templates/unity-take-flight.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-blockventure",
    title: "Blockventure",
    homepage: "https://github.com/thirdweb-example/unity-blockventure",
    repo: "https://github.com/thirdweb-example/unity-blockventure",
    description: "Lite RPG Gathering, Shopping and Trading Systems.",
    img: "/assets/templates/unity-blockventure.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-iap-client",
    title: "Unity IAP Client",
    homepage:
      "https://blog.thirdweb.com/guides/enhancing-unity-iap-with-blockchain-interactions/",
    repo: "https://github.com/thirdweb-example/unity-iap-client/",
    description:
      "Blockchain integration with Unity IAP and server side validation.",
    img: "/assets/templates/unity-iap.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Engine", "Unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-iap-server",
    title: "Unity IAP Server",
    homepage:
      "https://blog.thirdweb.com/guides/enhancing-unity-iap-with-blockchain-interactions/",
    repo: "https://github.com/thirdweb-example/unity-iap-server/",
    description:
      "Server implementation compatible with Unity IAP Apple and Google receipts",
    img: "/assets/templates/unity-iap.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Engine", "Unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "mintcaster",
    title: "Mintcaster",
    homepage: "https://mintcaster.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/mintcaster/",
    description:
      "Bootstrap your own client on Farcaster — with a feed, cast functionality, and Sign-in with Farcaster auth. Add NFT minting functionality with thirdweb Engine.",
    img: "/assets/templates/mintcaster.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Engine", "Farcaster"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "web3warriors",
    title: "Web3 Warriors",
    homepage: "https://web3warriors.thirdweb.com/",
    repo: "https://blog.thirdweb.com/how-we-built-web3-warriors/",
    description: "Dungeon crawler demo game built with thirdweb Unity SDK.",
    img: "/assets/templates/web3-warriors.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Unity", "Gaming"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "catattacknft",
    title: "Cat Attack",
    homepage: "https://catattack.thirdweb.com",
    repo: "https://github.com/thirdweb-example/catattacknft",
    description: "Strategy demo game built with thirdweb SDKs.",
    img: "/assets/templates/cat-attack.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["TypeScript", "Gaming"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unreal_demo",
    title: "Speed Racers",
    homepage: "https://engine-express.thirdweb-preview.com/",
    repo: "https://github.com/thirdweb-example/unreal_demo",
    description: "Racing demo game using Unreal and thirdweb Engine.",
    img: "/assets/templates/speed-racer.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Unreal", "Engine", "Gaming"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "phygital-experience",
    title: "Phygital Experience",
    homepage: "https://engine-phygital.vercel.app/qrs",
    repo: "https://github.com/thirdweb-example/engine-phygital",
    description:
      "Allow users to scan a QR code received with a physical product to mint an NFT using thirdweb engine.",
    img: "/assets/templates/phygital-experience.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["Engine", "ERC721"],
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
    contractLink: "/thirdweb.eth/DropERC721",
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
    contractLink: "/thirdweb.eth/MarketplaceV3",
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
    id: "node-starter",
    title: "Node Starter",
    homepage: "",
    repo: "https://github.com/thirdweb-example/node-starter",
    description:
      "Starter kit to build with Node and thirdweb without additional initial configuration.",
    img: "/assets/templates/node-starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Node", "TypeScript", "Starter"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "expo-starter",
    title: "Expo Starter",
    homepage: "",
    repo: "https://github.com/thirdweb-example/node-starter",
    description:
      "Starter kit to build with Expo and thirdweb without additional initial configuration.",
    img: "/assets/templates/expo-starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Expo", "TypeScript", "React-Native", "Starter"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "vite-starter",
    title: "Vite Starter",
    homepage: "https://vite-starter.thirdweb-example.com",
    repo: "https://github.com/thirdweb-example/vite-starter",
    description:
      "Starter kit to build with Vite and thirdweb without additional initial configuration.",
    img: "/assets/templates/vite-starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Vite", "Starter"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "next-starter",
    title: "Next Starter",
    homepage: "https://next-starter.thirdweb-example.com",
    repo: "https://github.com/thirdweb-example/next-starter",
    description:
      "Starter kit to build with Next and thirdweb without additional initial configuration.",
    img: "/assets/templates/next-starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["Next", "Starter"],
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
            {tags.map((tag) => (
              <Box
                as="div"
                key={tag}
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
const title = "Web3 Templates for Websites & Apps";
const description =
  "Start building with a library of quick-start templates for web3 apps and websites — for NFTs, marketplaces, and more. Get started.";

const Templates: ThirdwebNextPage = () => {
  return (
    <DarkMode>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
        }}
      />
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
            {templates.map((template) => (
              <TemplateCard key={template.id} {...template} />
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

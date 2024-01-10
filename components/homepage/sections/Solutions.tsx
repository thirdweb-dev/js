import { Aurora } from "../Aurora";
import {
  Box,
  Flex,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { Heading, Text, TrackedLink } from "tw-components";

interface SolutionCardProps {
  title: string;
  description: React.ReactNode;
  img: string;
  gradient: string;
  partnerIcon?: string;
  partnerLink?: string;
  href: string;
  hoverBorderColor: string;
}

const solutions: SolutionCardProps[] = [
  {
    title: "Gaming",
    gradient: "linear-gradient(90deg, #A79AF9, #7AA8D2)",
    description:
      "The all-in-one platform for developers to easily bring their games onto web3. Build a stronger community around your game by giving players ownership of in-game assets.",
    img: "/assets/landingpage/GamingKit.png",
    partnerIcon: "/assets/landingpage/icons/Coinbase.svg",
    href: "/solutions/gaming",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
  },
  {
    title: "CommerceKit",
    gradient: "linear-gradient(90deg, #E8B3E0, #A45B99)",
    description:
      "Add powerful web3 features to your Shopify storefront enabling tokengated commerce, NFT loyalty programs, digital collectible sales, and more.",
    img: "/assets/landingpage/CommerceKit.png",
    partnerIcon: "/assets/landingpage/icons/Shopify.svg",
    partnerLink: "https://blockchain.shopify.dev/",
    href: "/solutions/commerce",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
  },
  {
    title: "Minting",
    gradient: "linear-gradient(90deg, #8e0eff, #16bdf0)",
    description: (
      <>
        An all-in-one toolkit to build and mint NFTs. Create powerful NFT
        experiences. Build your own NFT and Marketplace contracts with the{" "}
        <TrackedLink
          color="white"
          fontWeight="500"
          isExternal
          category="solutions"
          label="contractkit"
          href="https://portal.thirdweb.com/contracts/build/overview"
        >
          Solidity SDK
        </TrackedLink>{" "}
        or discover and deploy in 1-click via{" "}
        <TrackedLink
          color="white"
          fontWeight="500"
          isExternal
          href="/explore"
          category="solutions"
          label="explore"
        >
          Explore
        </TrackedLink>
        .
      </>
    ),
    img: "/assets/solutions-pages/minting/hero.png",
    href: "/solutions/minting",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
  },
];

const SolutionCard: React.FC<SolutionCardProps> = ({
  title,
  description,
  img,
  gradient,
  partnerIcon,
  partnerLink,
  href,
  hoverBorderColor,
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
        height={{ lg: 250, base: 180 }}
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
          <Heading
            as="h3"
            fontSize="24px"
            mb={6}
            bgGradient={gradient}
            bgClip="text"
          >
            <TrackedLink
              as={LinkOverlay}
              href={href}
              isExternal
              category="solutions"
              label={title.toLowerCase()}
            >
              {title}
            </TrackedLink>
          </Heading>
          <Text size="body.lg" lineHeight={1.7} color="whiteAlpha.700">
            {description}
          </Text>
        </Box>

        {partnerIcon && (
          <Flex alignItems="center" gap={2} mt={10}>
            <Text lineHeight={1}>In partnership with</Text>
            {partnerLink ? (
              <TrackedLink
                href={partnerLink}
                isExternal
                category="solutions"
                label="shopify"
              >
                <Image src={partnerIcon} alt="" width={100} />
              </TrackedLink>
            ) : (
              <Image src={partnerIcon} alt="" width={100} />
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export const SolutionsSection: React.FC = () => {
  return (
    <HomepageSection py={24} ml="auto" mr="auto">
      <Aurora
        pos={{ left: "10%", top: "60%" }}
        size={{ width: "2400px", height: "1800px" }}
        color="hsl(219deg 78% 30% / 25%)"
      />

      <Aurora
        pos={{ left: "90%", top: "60%" }}
        size={{ width: "2400px", height: "1800px" }}
        color="hsl(289deg 78% 30% / 25%)"
      />

      <Heading
        as="h3"
        fontSize={{ base: "32px", md: "48px" }}
        fontWeight={700}
        letterSpacing="-0.04em"
        mb={4}
        textAlign="center"
      >
        Explore solutions.
      </Heading>
      <Text fontSize="20px" textAlign="center" size="body.lg" mb={14}>
        thirdweb powers the best web3 projects across verticals
      </Text>
      <SimpleGrid columns={{ lg: 3, base: 1 }} gap={6} margin="0 auto">
        {solutions.map((feature, idx) => (
          <SolutionCard key={feature.title + idx} {...feature} />
        ))}
      </SimpleGrid>
    </HomepageSection>
  );
};

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
import { Aurora } from "../Aurora";

interface SolutionCardProps {
  title: string;
  description: React.ReactNode;
  img: string;
  gradient: string;
  href: string;
  hoverBorderColor: string;
}

const solutions: SolutionCardProps[] = [
  {
    title: "Gaming",
    gradient: "linear-gradient(90deg, #A79AF9, #7AA8D2)",
    description:
      "The complete web3 game development toolkit — with wallets to onboard users, contracts for onchain assets, fiat & crypto payments, infrastructure to scale your game. Cross-platform support.",
    img: "/assets/landingpage/GamingKit.png",
    href: "/solutions/gaming",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
  },
  {
    title: "Chains",
    gradient: "linear-gradient(90deg, #E8B3E0, #A45B99)",
    description:
      "Launch a production-ready L2, L3, or appchain and bring developers to your ecosystem — with account abstraction, payments, & RPCs handled for you.",
    img: "/assets/landingpage/chains-solutions.png",
    href: "/solutions/chains",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
  },
  {
    title: "Minting",
    gradient: "linear-gradient(90deg, #8e0eff, #16bdf0)",
    description:
      "Mint and distribute NFTs at scale — with frontend UI components, smart contracts for every use case, and robust APIs with backend wallets & nonce management.",
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
        mb={14}
        textAlign="center"
      >
        Solutions for every web3 app
      </Heading>
      <SimpleGrid columns={{ lg: 3, base: 1 }} gap={6} margin="0 auto">
        {solutions.map((feature) => (
          <SolutionCard key={feature.title} {...feature} />
        ))}
      </SimpleGrid>
    </HomepageSection>
  );
};

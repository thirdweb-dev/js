import {
  CommunityRewards,
  CreatorTools,
  DAOs,
  DefiProtocols,
  Marketplaces,
  NFTDrops,
  PlayToEarnGames,
  TokenGated,
} from "./example-svgs";
import { Flex, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading } from "tw-components";

const EXAMPLES_MAP = {
  tokenGated: {
    title: "Token gated memberships",
    href: "https://github.com/thirdweb-example/NFT-Gated-Website",
    svg: TokenGated,
  },
  defiProtocols: {
    title: "DeFi protocols",
    href: "https://portal.thirdweb.com/examples",
    svg: DefiProtocols,
  },
  daos: {
    title: "DAOs",
    href: "https://github.com/thirdweb-example/dao",
    svg: DAOs,
  },
  marketplaces: {
    title: "Digital asset marketplaces",
    href: "https://github.com/thirdweb-example/marketplace-next-ts",
    svg: Marketplaces,
  },
  nftDrops: {
    title: "NFT drops",
    href: "https://github.com/thirdweb-example/custom-minting-page",
    svg: NFTDrops,
  },
  creatorTools: {
    title: "Creator tools",
    href: "https://portal.thirdweb.com/examples",
    svg: CreatorTools,
  },
  communityRewards: {
    title: "Community rewards",
    href: "https://portal.thirdweb.com/examples",
    svg: CommunityRewards,
  },
  playToEarnGames: {
    title: "Play to earn games",
    href: "https://portal.thirdweb.com/examples",
    svg: PlayToEarnGames,
  },
} as const;

export const exampleCategories = Object.keys(EXAMPLES_MAP) as Array<
  keyof typeof EXAMPLES_MAP
>;

export type ExampleCategory = keyof typeof EXAMPLES_MAP;

export const ExampleItem: React.FC<{ category: ExampleCategory }> = ({
  category,
}) => {
  const { trackEvent } = useTrack();
  const { title, href, svg: RenderSVG } = EXAMPLES_MAP[category];
  return (
    <Flex as={LinkBox} role="group" flexDir="column" gap={6} flexGrow={0}>
      <RenderSVG />
      <LinkOverlay
        href={href}
        isExternal
        onClick={() => {
          trackEvent({
            category: "example",
            action: "click",
            label: category,
          });
        }}
      >
        <Heading
          _groupHover={{ textDecor: "underline" }}
          textAlign="center"
          size="subtitle.md"
          maxW="100%"
        >
          {title}
        </Heading>
      </LinkOverlay>
    </Flex>
  );
};

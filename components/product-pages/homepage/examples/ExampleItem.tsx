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
  nftDrops: {
    title: "NFT drops",
    href: "https://portal.thirdweb.com/templates/nft-drop-template",
    svg: NFTDrops,
  },
  marketplaces: {
    title: "NFT marketplaces",
    href: "https://portal.thirdweb.com/templates/marketplace-next-ts-template",
    svg: Marketplaces,
  },
  tokenGated: {
    title: "Token-gated memberships",
    href: "https://portal.thirdweb.com/templates/nft-gated-website-template",
    svg: TokenGated,
  },
  daos: {
    title: "DAOs",
    href: "https://portal.thirdweb.com/templates/dao-template",
    svg: DAOs,
  },
  creatorTools: {
    title: "Creator tools",
    href: "https://portal.thirdweb.com/templates",
    svg: CreatorTools,
  },
  communityRewards: {
    title: "Community rewards",
    href: "https://portal.thirdweb.com/templates/community-rewards-template",
    svg: CommunityRewards,
  },
  playToEarnGames: {
    title: "Play-to-earn games",
    href: "https://portal.thirdweb.com/templates/play-to-earn-game-template",
    svg: PlayToEarnGames,
  },
  defiProtocols: {
    title: "DeFi protocols",
    href: "https://portal.thirdweb.com/templates",
    svg: DefiProtocols,
  },
} as const;

export const exampleCategories = Object.keys(EXAMPLES_MAP) as Array<
  keyof typeof EXAMPLES_MAP
>;

export type ExampleCategory = keyof typeof EXAMPLES_MAP;

export const ExampleItem: React.FC<{ category: ExampleCategory }> = ({
  category,
}) => {
  const trackEvent = useTrack();
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

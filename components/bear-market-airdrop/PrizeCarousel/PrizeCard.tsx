import { ChakraNextImage } from "components/Image";

const PRIZE_MAP = {
  bearMarketBuilderNft: {
    img: require("./prizes/bear-market-builder.png"),
    filter: undefined,
  },
  thirdwebProEarlyAccessNft: {
    img: require("./prizes/thirdweb-pro-early-access.png"),
    filter: undefined,
  },
  "1Matic": {
    img: require("./prizes/1-matic.png"),
    filter: undefined,
  },
  "5Matic": {
    img: require("./prizes/5-matic.png"),
    filter: undefined,
  },
  "0.1Eth": {
    img: require("./prizes/0.1-eth.png"),
    filter: undefined,
  },
  "1Eth": {
    img: require("./prizes/1-eth.png"),
    filter: undefined,
  },
  "1kAwsCredits": {
    img: require("./prizes/1k-aws-credits.png"),
    filter: undefined,
  },
  lexicaAiArtPass: {
    img: require("./prizes/lexica-ai-art-pass.png"),
    filter: undefined,
  },
  clubIrlNft: {
    img: require("./prizes/club-irl-nft.png"),
    filter: undefined,
  },
  consensusPass: {
    img: require("./prizes/consensus-2023-two-day-pass.png"),
    filter: undefined,
  },
  cpg: {
    img: require("./prizes/cpg-genesis-nft.png"),
    filter: undefined,
  },
  quicknode900: {
    img: require("./prizes/quicknode-900.png"),
    filter: undefined,
  },
  quicknode5000: {
    img: require("./prizes/quicknode-5000.png"),
    filter: undefined,
  },
  quicknode25000: {
    img: require("./prizes/quicknode-25000.png"),
    filter: undefined,
  },
} as const;

type Prize = keyof typeof PRIZE_MAP;

interface PartnerLogoProps {
  prize: Prize;
}
export const PrizeCard: React.FC<PartnerLogoProps> = ({ prize }) => {
  return (
    <ChakraNextImage
      opacity="0.8"
      pointerEvents="none"
      w="auto"
      h={{ base: "300px", md: "400px" }}
      filter={PRIZE_MAP[prize].filter}
      src={PRIZE_MAP[prize].img}
      alt={prize}
    />
  );
};

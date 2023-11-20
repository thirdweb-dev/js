import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";

const PARTNER_LOGO_MAP = {
  rarible: {
    img: require("./logos/rarible.png"),
    filter: undefined,
  },
  aws: {
    img: require("./logos/aws.png"),
    filter: undefined,
  },
  fractal: {
    img: require("./logos/fractal.png"),
    filter: "brightness(0) invert(1)",
  },
  buildspace: {
    img: require("./logos/buildspace.png"),
    filter: undefined,
  },
  shopify: {
    img: require("./logos/shopify.png"),
    filter: "grayscale(1)",
  },
  paradigm: {
    img: require("./logos/paradigm.png"),
    filter: undefined,
  },
  unlock: {
    img: require("./logos/unlock.png"),
    filter: undefined,
  },
  nyfw: {
    img: require("./logos/nyfw.png"),
    filter: "brightness(0) invert(1)",
  },
  gala_games: {
    img: require("./logos/gala_games.png"),
    filter: undefined,
  },
  mirror: {
    img: require("./logos/mirror.png"),
    filter: undefined,
  },
  heroic_story: {
    img: require("./logos/heroic_story.png"),
    filter: undefined,
  },
  layer3: {
    img: require("./logos/layer3.png"),
    filter: undefined,
  },
  animoca: {
    img: require("./logos/animoca.png"),
    filter: "brightness(0) invert(1)",
  },
  pixels: {
    img: require("./logos/pixels.png"),
    filter: "brightness(0) invert(1)",
  },
  coinbase: {
    img: require("./logos/coinbase.png"),
    filter: undefined,
  },
  polygon: {
    img: require("./logos/polygon.png"),
    filter: undefined,
  },
  avacloud: {
    img: require("./logos/avacloud.png"),
    filter: "grayscale(1)",
  },
  courtyard: {
    img: require("./logos/courtyard.png"),
    filter: "brightness(0) invert(1)",
  },
} as const;

export type Partner = keyof typeof PARTNER_LOGO_MAP;

interface PartnerLogoProps {
  partner: Partner;
}
export const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner }) => {
  return (
    <Flex justifyContent="center">
      <ChakraNextImage
        opacity="0.8"
        pointerEvents="none"
        w="auto"
        maxW="150px"
        h={{ base: "40px", md: "50px" }}
        loading="eager"
        filter={PARTNER_LOGO_MAP[partner].filter}
        src={PARTNER_LOGO_MAP[partner].img}
        alt={partner}
        sizes="(max-width: 768px) 25vw,
                10vw"
      />
    </Flex>
  );
};

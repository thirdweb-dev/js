import { AspectRatio } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";

const PARTNER_LOGO_MAP = {
  rarible: {
    img: require("./logos/rarible.png"),
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
  minted: {
    img: require("./logos/minted.png"),
    filter: "brightness(0) invert(1)",
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
} as const;

type Partner = keyof typeof PARTNER_LOGO_MAP;

interface PartnerLogoProps {
  partner: Partner;
}
export const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner }) => {
  return (
    <AspectRatio
      opacity=".8"
      pointerEvents="none"
      w="full"
      ratio={16 / 9}
      filter={PARTNER_LOGO_MAP[partner].filter}
    >
      <ChakraNextImage
        src={PARTNER_LOGO_MAP[partner].img}
        alt={partner}
        sizes="(max-width: 768px) 25vw,
              10vw"
      />
    </AspectRatio>
  );
};

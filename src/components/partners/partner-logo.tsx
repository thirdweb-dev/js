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
  shopify: {
    img: require("./logos/shopify.png"),
    filter: "grayscale(1)",
  },
  paradigm: {
    img: require("./logos/paradigm.png"),
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
  infinigods: {
    img: require("./logos/infinigods.png"),
    filter: "grayscale(1)",
  },
  torque: {
    img: require("./logos/torque.png"),
    filter: undefined,
  },
  ztx: {
    img: require("./logos/ztx.png"),
    filter: undefined,
  },
  aavegotchi: {
    img: require("./logos/aavegotchi.png"),
    filter: undefined,
  },
  coolcats: {
    img: require("./logos/coolcats.png"),
    filter: undefined,
  },
  mcfarlane: {
    img: require("./logos/mcfarlane.png"),
    filter: undefined,
  },
  treasure: {
    img: require("./logos/treasure.png"),
    filter: undefined,
  },
  xai: {
    img: require("./logos/xai.png"),
    filter: undefined,
  },
  paima: {
    img: require("./logos/paima.png"),
    filter: undefined,
  },
  myna: {
    img: require("./logos/myna.png"),
    filter: undefined,
  },
} as const;

type Partner = keyof typeof PARTNER_LOGO_MAP;

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

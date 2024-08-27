import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";

const partnersCompanies = [
  {
    maxWidth: { base: "60px", lg: "80px" },
    src: require("../../../public/assets/partners/cpg.png"),
  },
  {
    maxWidth: { base: "100px", lg: "185px" },
    src: require("../../../public/assets/partners/coinbaseventures.png"),
  },
  {
    maxWidth: { base: "100px", lg: "160px" },
    src: require("../../../public/assets/partners/finc.png"),
  },
  {
    maxWidth: { base: "100px", lg: "160px" },
    src: require("../../../public/assets/partners/optimism.png"),
  },
  {
    maxWidth: { base: "100px", lg: "165px" },
    src: require("../../../public/assets/partners/polygon.png"),
  },
  {
    maxWidth: { base: "100px", lg: "150px" },
    src: require("../../../public/assets/partners/techstars.png"),
  },
  {
    maxWidth: { base: "100px", lg: "160px" },
    src: require("../../../public/assets/partners/haun.png"),
  },
  {
    maxWidth: { base: "100px", lg: "160px" },
    src: require("../../../public/assets/partners/monad.png"),
  },
  {
    maxWidth: { base: "150px", lg: "200px" },
    src: require("../../../public/assets/partners/aws.png"),
  },
  {
    maxWidth: { base: "150px", lg: "200px" },
    src: require("../../../public/assets/partners/avalanche_white.png"),
  },
];

const PartnersSection = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      gap={10}
      mt="24px"
    >
      {partnersCompanies.slice(0, 10).map((partner, idx) => (
        <ChakraNextImage
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={idx}
          maxW={partner.maxWidth}
          src={partner.src}
          alt="partner"
        />
      ))}
    </Flex>
  );
};

export default PartnersSection;

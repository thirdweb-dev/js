import { SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";

const partnersCompanies = [
  { maxWidth: "80px", src: require("../../../public/assets/partners/cpg.png") },
  {
    maxWidth: "185px",
    src: require("../../../public/assets/partners/coinbaseventures.png"),
  },
  {
    maxWidth: "160px",
    src: require("../../../public/assets/partners/finc.png"),
  },
  {
    maxWidth: "160px",
    src: require("../../../public/assets/partners/optimism.png"),
  },
  {
    maxWidth: "165px",
    src: require("../../../public/assets/partners/polygon.png"),
  },
  {
    maxWidth: "150px",
    src: require("../../../public/assets/partners/techstars.png"),
  },
  {
    maxWidth: "160px",
    src: require("../../../public/assets/partners/haun.png"),
  },
  {
    maxWidth: "160px",
    src: require("../../../public/assets/partners/monad.png"),
  },
  {
    maxWidth: "200px",
    src: require("../../../public/assets/partners/aws.png"),
  },
  {
    maxWidth: "200px",
    src: require("../../../public/assets/partners/avalanche_white.png"),
  },
];

const Partners = () => {
  return (
    <>
      <SimpleGrid
        columns={{ base: 1, lg: 6 }}
        gap={{ base: 16, md: 24 }}
        w="full"
        placeItems="center"
        mb={{ base: 16, md: "41px" }}
        mt="57px"
      >
        {partnersCompanies.slice(0, 6).map((partner, idx) => (
          <ChakraNextImage
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={idx}
            maxW={partner.maxWidth}
            src={partner.src}
            alt="partner"
          />
        ))}
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, lg: 4 }}
        gap={{ base: 6, md: 10 }}
        w="-moz-min-content"
        placeItems="center"
      >
        {partnersCompanies.slice(6).map((partner, idx) => (
          <ChakraNextImage
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={idx + 6}
            maxW={partner.maxWidth}
            src={partner.src}
            alt="partner"
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Partners;

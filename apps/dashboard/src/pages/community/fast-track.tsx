import { Box, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, Text } from "tw-components";

const chainsIcons = [
  {
    id: "treasure-icon",
    src: require("../../../public/assets/startup-program/coinbase-icon.png"),
    alt: "chain",
  },
  {
    id: "chain-icon",
    src: require("../../../public/assets/startup-program/chain-icon1.png"),
    alt: "chain",
  },
  {
    id: "chain-layer",
    src: require("../../../public/assets/startup-program/layer3-icon.png"),
    alt: "chain",
  },
];

const chainsIcons2 = [
  {
    id: "treasure-icon",
    src: require("../../../public/assets/startup-program/chain-icon2.png"),
    alt: "chain",
  },
  {
    id: "chain-icon",
    src: require("../../../public/assets/startup-program/chain-icon3.png"),
    alt: "chain",
  },
  {
    id: "chain-layer",
    src: require("../../../public/assets/startup-program/chain-icon4.png"),
    alt: "chain",
  },
];

const gradient = {
  src: require("../../../public/assets/startup-program/gradient-1.png"),
};

export const FastTrack = () => {
  return (
    <Box display={{ base: "block", lg: "none" }}>
      <SimpleGrid columns={3} spacing={0}>
        {chainsIcons.map((image) => (
          <Box
            key={image.id}
            height="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ChakraNextImage
              src={image.src}
              alt={image.alt}
              height="auto"
              objectFit="contain"
              maxW="87px"
            />
          </Box>
        ))}
      </SimpleGrid>
      <Box p="10px" maxW="545px" my="80px">
        <Heading fontSize="32px" textAlign="center" mb="20px">
          Fast track your application
        </Heading>
        <Text
          mt={4}
          fontSize="14px"
          opacity={{ base: 0.7, lg: 1 }}
          color="#fff"
          fontWeight="medium"
          textAlign="center"
        >
          Are you building on any of these ecosystems? If so, apply now to get
          fast tracked to the next cohort.
        </Text>
      </Box>
      <SimpleGrid columns={3} spacing={0}>
        {chainsIcons2.map((image) => (
          <Box
            key={image.id}
            height="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ChakraNextImage
              src={image.src}
              alt={image.alt}
              height="auto"
              objectFit="contain"
              maxW="87px"
            />
          </Box>
        ))}
      </SimpleGrid>
      {/* Gradient Box */}
      <Box
        position="absolute"
        bottom={{ base: "-50px", md: "-380px" }}
        left="40%"
        transform="translateX(-50%)"
        zIndex="-1"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <ChakraNextImage
          src={gradient.src}
          alt="description"
          width="100%"
          height="auto"
          opacity={0.5}
        />
      </Box>
    </Box>
  );
};

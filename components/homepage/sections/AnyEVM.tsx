import { Box, Flex, Image } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { Heading, Text } from "tw-components";

export const AnyEVMSection = () => {
  return (
    <HomepageSection id="any-evm" position="relative" pb={{ base: 36, md: 64 }}>
      <Flex
        flexDir="column"
        pb={24}
        pt={{ base: 12, md: 24 }}
        align="center"
        gap={{ base: 6, md: 8 }}
      >
        <Heading
          bg="linear-gradient(350.21deg, #FFFFFF -13.99%, rgba(255, 255, 255, 0) 136.74%)"
          bgClip="text"
          as="h2"
          size="title.2xl"
          textAlign="center"
          letterSpacing="-0.04em"
        >
          Any Contract. Any Chain.
        </Heading>
        <Text
          bg="linear-gradient(29.47deg, #FFFFFF -12.61%, rgba(255, 255, 255, 0) 152.49%)"
          bgClip="text"
          textAlign="center"
          as="h3"
          maxW={480}
          size="label.xl"
          lineHeight={1.2}
        >
          Our tools work with any contract deployed on any EVM compatible chain.
        </Text>
      </Flex>
      <Box
        pointerEvents="none"
        zIndex={-1}
        position="absolute"
        bottom={0}
        h="0"
        w="full"
      >
        <Image
          transform="translate(-50%, -60%)"
          ml="50%"
          alt=""
          w="1500px"
          maxW="250vw"
          src="/assets/landingpage/any-evm.png"
          justifySelf="flex-end"
        />
      </Box>
    </HomepageSection>
  );
};

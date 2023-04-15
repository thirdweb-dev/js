import { Box, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, Text } from "tw-components";

export const Why: React.FC = () => {
  return (
    <Box
      maxW={{
        base: "100%",
        lg: "container.md",
      }}
      px="10"
      display="flex"
      flexDirection="column"
      gap={16}
      mt={24}
    >
      <Heading
        fontSize="56px"
        w="min"
        bgGradient="linear(to-r, #743F9E, #BFA3DA)"
        bgClip="text"
      >
        Why?
      </Heading>
      <Flex p={0} position="relative" direction="column">
        <Text fontSize="32px" fontWeight="bold" lineHeight="120%">
          The last 18 months haven’t been easy. For those that continued
          building
        </Text>
        <Text
          bgGradient="linear(to-r, #4830A4, #9786DF)"
          bgClip="text"
          w="fit-content"
          mt={0}
          fontSize="32px"
          fontWeight="bold"
          lineHeight="120%"
        >
          We salute you.{" "}
        </Text>
        <ChakraNextImage
          src={require("public/assets/bear-market-airdrop/Ellipse-100.png")}
          position="absolute"
          top={14}
          left={-4}
          alt="scribble"
          display={{
            base: "none",
            xl: "block",
          }}
        />
      </Flex>
      <Flex direction="column" position="relative">
        <Text fontSize="32px" fontWeight="bold" lineHeight="120%">
          We are giving away 100,000 packs with prizes
        </Text>
        <Text
          bgGradient="linear(to-r, #743F9E, #BFA3DA)"
          bgClip="text"
          w="fit-content"
          position="relative"
          fontSize="32px"
          fontWeight="bold"
          lineHeight="120%"
        >
          worth up to $25,000.
          <ChakraNextImage
            src={require("public/assets/bear-market-airdrop/Ellipse 101.png")}
            position="absolute"
            top={-4}
            left={0}
            alt="scribble"
            display={{
              base: "none",
              xl: "block",
            }}
          />
        </Text>
      </Flex>
      <Flex position="relative" direction="column">
        <Text fontSize="32px" fontWeight="bold" lineHeight="120%">
          Inside each pack is a random reward provided by thirdweb and our
          partners to
        </Text>
        <Text
          bgGradient="linear(to-r, #C35AB1, #E9A8D9)"
          bgClip="text"
          w="fit-content"
          fontSize="32px"
          fontWeight="bold"
          lineHeight="120%"
        >
          support the builders of Web3 in 2023.
        </Text>
        <ChakraNextImage
          src={require("public/assets/bear-market-airdrop/Ellipse 102.png")}
          position="absolute"
          top={14}
          left={-6}
          alt="scribble"
          display={{
            base: "none",
            xl: "block",
          }}
        />
      </Flex>
      <Flex position="relative" direction="column">
        <Text fontSize="32px" fontWeight="bold" lineHeight="120%">
          For builders
        </Text>
        <Text
          bgGradient="linear(to-r, #743F9E, #BFA3DA)"
          bgClip="text"
          w="fit-content"
          fontSize="32px"
          fontWeight="extrabold"
          lineHeight="120%"
        >
          there is no bear market.
        </Text>
      </Flex>
    </Box>
  );
};

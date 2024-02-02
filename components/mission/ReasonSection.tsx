import { Flex, SimpleGrid } from "@chakra-ui/react";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import React from "react";
import { Heading, Text } from "tw-components";

const ReasonSection = () => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      alignItems="center"
      gap={{ base: "48px", "2xl": "0" }}
      placeItems="center"
      position="relative"
    >
      <Flex
        flexDir="column"
        maxW={{ base: "100%", md: "400px" }}
        mr={{ base: "0", md: "auto" }}
      >
        <Heading size="title.lg" mt={46}>
          Who is thirdweb for?
        </Heading>

        <Text mt={4} size="body.xl" color="#fff" opacity={0.7}>
          We believe that the most compelling use cases of blockchain technology
          will be found by crypto-native builders and startups who are building
          with web3 at the heart of their app. thirdweb is built by web3 native
          builders for web3 native builders.
        </Text>
      </Flex>

      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/desktop/audience.png")}
        mobileImage={require("public/assets/landingpage/mobile/audience.png")}
        alt="audience"
        w="100%"
        maxHeight="100%"
      />
    </SimpleGrid>
  );
};

export default ReasonSection;

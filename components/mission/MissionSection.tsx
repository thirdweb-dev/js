import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Aurora } from "components/homepage/Aurora";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import React, { Fragment } from "react";
import { Heading, Text } from "tw-components";

const MissionSection = () => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      placeItems="center"
      position="relative"
    >
      <Flex flexDir="column" maxW={500}>
        <Heading size="title.lg" maxW="xl" fontWeight="semibold" mt={46}>
          thirdweb provides a full stack platform for web3 with tools that work
          on any EVM chain.
        </Heading>

        <Text mt={4} size="body.xl" color="#fff" opacity={0.7}>
          It&apos;s a simple and cohesive developer experience.
        </Text>
      </Flex>

      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/mobile/full-stack.png")}
        mobileImage={require("public/assets/landingpage/mobile/full-stack.png")}
        w={{ base: "100%" }}
      />
    </SimpleGrid>
  );
};

export default MissionSection;

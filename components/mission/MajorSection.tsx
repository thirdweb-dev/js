import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingGridSection } from "components/landing-pages/grid-section";
import React from "react";
import { Heading, Text } from "tw-components";

const MajorSection = () => {
  return (
    <Flex
      w="full"
      flexDir={{ base: "column", xl: "row" }}
      alignItems={{ base: "center", xl: "flex-start" }}
      gap="60px"
    >
      <Heading
        size="title.lg"
        fontWeight="semibold"
        flex="1"
        textAlign={{ base: "center", xl: "left" }}
      >
        However, there are two major obstacles to mass adoption.
      </Heading>
      <Flex maxW="2xl">
        <LandingGridSection desktopColumns={2}>
          <Flex flexDir="column" gap={6}>
            <ChakraNextImage
              src={require("public/assets/landingpage/mobile/complexity.png")}
              alt="img-one"
            />
            <Flex flexDir="column" gap={4}>
              <Text size="body.xl" color="white" fontWeight="bold">
                Developer complexity
              </Text>
              To build a web3 app, developers need to piece together 10+
              different tools that don&apos;t natively talk to each other —
              creating a messy, fragmented DX that stifles innovation.
            </Flex>
          </Flex>

          <Flex flexDir="column" gap={6}>
            <ChakraNextImage
              src={require("public/assets/landingpage/mobile/user-experience.png")}
              alt="img-one"
            />
            <Flex flexDir="column" gap={4}>
              <Text size="body.xl" color="white" fontWeight="bold">
                Developer complexity
              </Text>
              To build a web3 app, developers need to piece together 10+
              different tools that don&apos;t natively talk to each other —
              creating a messy, fragmented DX that stifles innovation.
            </Flex>
          </Flex>
        </LandingGridSection>
      </Flex>
    </Flex>
  );
};

export default MajorSection;

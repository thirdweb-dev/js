import { Flex } from "@chakra-ui/react";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import React from "react";
import { Heading } from "tw-components";

const HeroSection = ({ text }: { text: string }) => {
  return (
    <Flex flexDir="column" alignItems="center" mt={{ base: 20, md: 140 }}>
      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/desktop/xl-logo.png")}
        mobileImage={require("public/assets/landingpage/mobile/xl-logo.png")}
        alt="thirdweb"
        maxW="80%"
      />
      <Heading
        size="title.lg"
        maxW="xl"
        fontWeight="semibold"
        textAlign="center"
        mt={46}
      >
        {text}
      </Heading>
    </Flex>
  );
};

export default HeroSection;

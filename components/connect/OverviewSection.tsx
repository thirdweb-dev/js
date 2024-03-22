import { Container, Flex } from "@chakra-ui/react";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { useParallaxEffect } from "hooks/effect/useParallexEffect";
import React from "react";
import { Text } from "tw-components";

const OverviewSection = () => {
  const parallaxOffset = useParallaxEffect(0.2);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      position="relative"
      mt={{ base: "0", md: 40 }}
      flexDir={{ base: "column", xl: "row" }}
      gap={{ base: "80px", xl: 0 }}
    >
      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/desktop/parallax-left.png")}
        mobileImage={require("public/assets/landingpage/mobile/parallax-left.png")}
        alt="parallax-one"
        maxW={{ base: "100%", xl: "412px", "2xl": "512px" }}
        w="full"
        transform={{
          base: "auto",
          xl: `translateY(${-parallaxOffset + 200}px)`,
        }}
        transition="transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)"
      />

      <Container
        as={Flex}
        flexDir="column"
        maxW="container.page"
        alignItems="center"
        position="relative"
        zIndex={5}
        mx={5}
      >
        <Text size="body.xl" textAlign="center" maxW={540} color="#fff">
          <Text as="span" size="body.xl" fontWeight="bold" color="#fff">
            Over 70,000 web3 developers
          </Text>
          &nbsp;trust thirdweb to build web3 apps and games. thirdweb&apos;s
          tools are designed to help developers build apps and experiences which
          are seamless for users and abstract away the blockchain.
        </Text>
      </Container>

      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/desktop/parallax-right.png")}
        mobileImage={require("public/assets/landingpage/mobile/parallax-right.png")}
        alt="parallax-one"
        maxW={{ base: "100%", xl: "412px", "2xl": "512px" }}
        w="100%"
        flex="1"
        transform={{
          base: "auto",
          xl: `translateY(${-parallaxOffset + 200}px)`,
        }}
        transition="transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)"
      />
    </Flex>
  );
};

export default OverviewSection;

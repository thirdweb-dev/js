import { Box, Center, Flex, LightMode } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { GeneralCta } from "components/shared/GeneralCta";
import WhiteLogo from "public/assets/landingpage/white-logo.png";
import { Heading } from "tw-components";

/**
 * Highlights Call To Action for Start Building with ThirdWeb
 */
export const GetStartedSection = () => {
  return (
    <HomepageSection id="get-started" bottomPattern>
      <Flex
        flexDir="column"
        pt={{ base: 12, lg: 24 }}
        pb={{ base: 24, lg: 0 }}
        align="center"
        gap={{ base: 6, md: 8 }}
      >
        <Center mb={6} pt={{ base: 8, lg: 24 }}>
          <Center p={2} position="relative" mb={6}>
            <Box
              position="absolute"
              bgGradient="linear(to-r, #F213A4, #040BBF)"
              top={0}
              left={0}
              bottom={0}
              right={0}
              borderRadius="3xl"
              overflow="visible"
              filter="blur(15px)"
            />

            <ChakraNextImage
              alt=""
              boxSize={{ base: 24, md: 32 }}
              placeholder="empty"
              src={WhiteLogo}
            />
          </Center>
        </Center>
        <Heading as="h2" size="display.md" textAlign="center">
          Get started with thirdweb
        </Heading>
        <Heading as="h3" maxW="600px" textAlign="center" size="subtitle.lg">
          Build web3 apps with ease. Get instant access.
        </Heading>
        <LightMode>
          <GeneralCta
            title="Start building for free"
            size="lg"
            w={{ base: "full", md: "inherit" }}
          />
        </LightMode>
      </Flex>
    </HomepageSection>
  );
};

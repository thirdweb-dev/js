import { Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { useTrack } from "hooks/analytics/useTrack";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { Button, Heading, Text } from "tw-components";

interface HeroSectionProps {
  trackingCategory: string;
  scrollToSection: () => void;
}

const HeroSection = ({
  trackingCategory,
  scrollToSection,
}: HeroSectionProps) => {
  const trackEvent = useTrack();

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="750px"
      background={`linear-gradient(to top, #000 0%, #000 2%, rgba(0,0,0,0) 18%), url(${getAbsoluteUrl()}/assets/grant/superchain/overlay.png)`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      p={4}
      py={{ base: 16, md: 0 }}
    >
      <SimpleGrid
        placeItems="center"
        columns={{ base: 1, md: 2 }}
        gap={{ base: 12, md: 8 }}
        maxW="container.page"
      >
        <Flex flexDir="column" gap="24px">
          <ChakraNextImage
            src={require("../../../../public/assets/grant/superchain/op-thirdweb.png")}
            alt="superchain-thirdweb"
            w={330}
            h={21}
          />
          <Heading
            fontSize={{ base: "42px", md: "56px" }}
            as="span"
            color="linear-gradient(90deg, #323131 0%, rgba(50, 49, 49, 0.00) 201.83%)"
            background="linear-gradient(90deg, #323131 0%, rgba(50, 49, 49, 0.00) 201.83%)"
            backgroundClip="text"
            fontWeight={700}
            letterSpacing="-1.68px"
            wordBreak="break-word"
          >
            Superchain App Accelerator
          </Heading>

          <Text
            fontSize={{ base: "18px", md: "22px" }}
            color="rgba(50, 49, 49, 0.80)"
            letterSpacing="-0.4px"
            fontWeight={500}
          >
            Bringing the costs of building & using onchain apps to zero — for
            developers & users.
          </Text>

          <Button
            py={6}
            px={8}
            bgColor="white"
            _hover={{
              bgColor: "white",
              opacity: 0.8,
            }}
            color="black"
            fontWeight="bold"
            mt="16px"
            maxW="fit-content"
            onClick={() => {
              trackEvent({
                category: trackingCategory,
                action: "click",
                label: "claim-credit",
              });

              scrollToSection();
            }}
          >
            Claim your credits
          </Button>
        </Flex>

        <Flex maxH="500px">
          <LandingDesktopMobileImage
            image={require("../../../../public/assets/grant/superchain/hero.png")}
            mobileImage={require("../../../../public/assets/grant/superchain/hero.png")}
          />
        </Flex>
      </SimpleGrid>
    </Flex>
  );
};

export default HeroSection;

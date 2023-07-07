import { LandingCTAButtons } from "./cta-buttons";
import { LandingDesktopMobileImage } from "./desktop-mobile-image";
import { Box, Container, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Heading, Text } from "tw-components";

interface LandingHeroProps {
  title: string;
  titleWithGradient: string;
  subtitle: string;
  inPartnershipWith?: StaticImageData;
  trackingCategory: string;
  ctaText?: string;
  ctaLink: string;
  gradient: string;
  image?: StaticImageData;
  mobileImage?: StaticImageData;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  title,
  titleWithGradient,
  subtitle,
  inPartnershipWith,
  trackingCategory,
  ctaText,
  ctaLink,
  gradient,
  image,
  mobileImage,
}) => {
  return (
    <Flex
      flexDir="column"
      gap={{ base: 12, md: 20 }}
      paddingY={{ base: 0, md: "64px" }}
      mb={{ base: "80px", md: "120px" }}
    >
      <Container maxW="container.md" paddingX={{ base: 4, md: 16 }}>
        <Flex flexDir="column" gap={{ base: 6, md: 8 }}>
          <Flex flexDir="column" gap={4}>
            {inPartnershipWith && (
              <Flex gap={2} justifyContent="center" alignItems="center">
                <Heading size="subtitle.sm" as="span">
                  In partnership with
                </Heading>
                <ChakraNextImage
                  src={require("public/assets/solutions-pages/commerce/shopify.png")}
                  width="80px"
                  alt="Shopify"
                />
              </Flex>
            )}
            <Heading
              as="h1"
              size="display.md"
              textAlign="center"
              px={{ base: 2, md: 0 }}
            >
              {title}{" "}
              <Box as="span" bgGradient={gradient} bgClip="text">
                {titleWithGradient}
              </Box>
            </Heading>
          </Flex>
          <Text textAlign="center" size="body.xl">
            {subtitle}
          </Text>
          <LandingCTAButtons
            ctaText={ctaText}
            ctaLink={ctaLink}
            trackingCategory={trackingCategory}
          />
        </Flex>
      </Container>
      <LandingDesktopMobileImage image={image} mobileImage={mobileImage} />
    </Flex>
  );
};

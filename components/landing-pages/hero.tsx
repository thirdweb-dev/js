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
  ctaLink?: string;
  gradient: string;
  image?: StaticImageData;
  mobileImage?: StaticImageData;
  noCta?: boolean;
  contactUsTitle?: string;
  contactUsLink?: string;
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
  noCta,
  contactUsTitle,
  contactUsLink,
}) => {
  return (
    <Flex
      flexDir="column"
      gap={{ base: 12, md: 20 }}
      paddingTop={{ base: 0, md: "64px" }}
    >
      <Container maxW="container.lg" paddingX={{ base: 4, md: 16 }}>
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
          <Text textAlign="center" size="body.lg">
            {subtitle}
          </Text>
          <LandingCTAButtons
            noCta={noCta}
            ctaText={ctaText}
            ctaLink={ctaLink}
            trackingCategory={trackingCategory}
            contactUsTitle={contactUsTitle}
            contactUsLink={contactUsLink}
          />
        </Flex>
      </Container>
      <LandingDesktopMobileImage image={image} mobileImage={mobileImage} />
    </Flex>
  );
};

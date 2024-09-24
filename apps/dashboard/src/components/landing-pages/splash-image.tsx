import { Box, Container, Flex } from "@chakra-ui/react";
import type { StaticImageData } from "next/image";
import { Heading, Text } from "tw-components";
import { LandingCTAButtons } from "./cta-buttons";
import { LandingDesktopMobileImage } from "./desktop-mobile-image";

interface SplashImageProps {
  title: string;
  titleWithGradient: string;
  subtitle: string;
  trackingCategory: string;
  ctaText?: string;
  ctaLink?: string;
  // biome-ignore lint/complexity/noBannedTypes: FIXME
  lottie?: {};
  gradient: string;
  image?: StaticImageData;
  mobileImage?: StaticImageData;
  noCta?: boolean;
  contactUsTitle?: string;
  contactUsLink?: string;
}

export const SplashImage: React.FC<SplashImageProps> = ({
  title,
  titleWithGradient,
  subtitle,
  trackingCategory,
  ctaText,
  ctaLink,
  gradient,
  lottie,
  image,
  mobileImage,
  noCta,
  contactUsTitle,
  contactUsLink,
}) => {
  return (
    <Flex flexDir="column" gap={{ base: 2, md: 4 }}>
      <Container maxW="container.lg" paddingX={{ base: 0, md: 4 }}>
        <Flex flexDir="column" gap={{ base: 6, md: 8 }}>
          <Flex flexDir="column" gap={2}>
            <Heading
              as="h2"
              size="display.sm"
              textAlign="center"
              px={{ base: 2, md: 0 }}
            >
              {title}{" "}
              <Box as="span" bgGradient={gradient} bgClip="text">
                {titleWithGradient}
              </Box>
            </Heading>
          </Flex>
          <Text
            color="white"
            opacity={0.8}
            textAlign="center"
            fontSize={[16, 20]}
            fontWeight={500}
            size="body.lg"
          >
            {subtitle}
          </Text>
        </Flex>
        <Flex maxH="1000px" my={4} pointerEvents="none">
          <LandingDesktopMobileImage
            lottie={lottie}
            image={image}
            mobileImage={mobileImage}
          />
        </Flex>
        <Flex gap={2} justifyContent="center" alignItems="center">
          <LandingCTAButtons
            noCta={noCta}
            noContactUs
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

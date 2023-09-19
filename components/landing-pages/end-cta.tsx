import { LandingCTAButtons } from "./cta-buttons";
import { Box, Container, Flex } from "@chakra-ui/react";
import { Heading } from "tw-components";

interface LandingEndCTAProps {
  title: string;
  titleWithGradient: string;
  gradient: string;
  ctaText?: string;
  ctaLink: string;
  noContactUs?: boolean;
  trackingCategory: string;
}

export const LandingEndCTA: React.FC<LandingEndCTAProps> = ({
  title,
  titleWithGradient,
  gradient,
  ctaText,
  ctaLink,
  noContactUs,
  trackingCategory,
}) => {
  return (
    <Container maxW="container.md">
      <Flex flexDir="column" gap={12}>
        <Heading pt={{ base: 20, md: 0 }} size="display.md" textAlign="center">
          {title}{" "}
          <Box as="span" bgGradient={gradient} bgClip="text">
            {titleWithGradient}
          </Box>
        </Heading>
        <Flex justifyContent="center">
          <LandingCTAButtons
            ctaText={ctaText}
            ctaLink={ctaLink}
            noContactUs={noContactUs}
            trackingCategory={trackingCategory}
          />
        </Flex>
      </Flex>
    </Container>
  );
};

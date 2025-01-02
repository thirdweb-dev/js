import { Box, Container, type ContainerProps, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Heading, Text, type TrackedLinkProps } from "tw-components";
import { LandingCTAButtons } from "./cta-buttons";

interface LandingEndCTAProps {
  title: string;
  description?: string;
  colorDescription?: string;
  containerMaxW?: ContainerProps["maxW"];
  titleWithGradient?: string;
  customEndCta?: ReactNode;
  gradient: string;
  ctaText?: string;
  ctaLink?: string;
  noCta?: boolean;
  contactUsLink?: string;
  noContactUs?: boolean;
  contactUsTitle?: string;
  trackingCategory: string;
  contactUsBg?: TrackedLinkProps["bg"];
  contactUsHover?: TrackedLinkProps["_hover"];
  contactUsBorder?: TrackedLinkProps["border"];
}

export const LandingEndCTA: React.FC<LandingEndCTAProps> = ({
  title,
  description,
  containerMaxW,
  colorDescription,
  titleWithGradient,
  customEndCta,
  gradient,
  ctaText,
  ctaLink,
  noCta,
  contactUsLink,
  noContactUs,
  contactUsTitle,
  trackingCategory,
  contactUsBg,
  contactUsHover,
  contactUsBorder,
}) => {
  return (
    <Container maxW={containerMaxW || "container.md"}>
      <Flex flexDir="column" gap={12}>
        <Heading pt={{ base: 20, md: 0 }} size="display.md" textAlign="center">
          {title}{" "}
          {titleWithGradient && (
            <Box as="span" bgGradient={gradient} bgClip="text">
              {titleWithGradient}
            </Box>
          )}
        </Heading>
        {description && (
          <Text
            size="body.xl"
            textAlign="center"
            color={colorDescription || "rgba(255, 255, 255, 0.70)"}
          >
            {description}
          </Text>
        )}

        {customEndCta ? (
          customEndCta
        ) : (
          <Flex justifyContent="center">
            <LandingCTAButtons
              ctaText={ctaText}
              ctaLink={ctaLink}
              noContactUs={noContactUs}
              trackingCategory={trackingCategory}
              noCta={noCta}
              contactUsLink={contactUsLink}
              contactUsTitle={contactUsTitle}
              contactUsBg={contactUsBg}
              contactUsHover={contactUsHover}
              contactUsBorder={contactUsBorder}
            />
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

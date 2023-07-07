import { Box, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Heading, Text } from "tw-components";

interface LandingShowcaseImageProps {
  miniTitle?: string;
  title: string;
  titleWithGradient?: string;
  gradient?: string;
  description: string;
  image: StaticImageData;
}

export const LandingShowcaseImage: React.FC<LandingShowcaseImageProps> = ({
  miniTitle,
  title,
  titleWithGradient,
  gradient,
  description,
  image,
}) => {
  return (
    <SimpleGrid columns={12} gap={12}>
      <GridItem colSpan={{ base: 12, md: 7 }}>
        <Flex flexDir="column" justifyContent="center">
          {miniTitle && (
            <Heading
              size="subtitle.sm"
              as="span"
              bgGradient={gradient}
              bgClip="text"
            >
              {miniTitle}
            </Heading>
          )}
          <Heading pb={4} size="display.sm">
            {title}{" "}
            <Box as="span" bgGradient={gradient} bgClip="text">
              {titleWithGradient}
            </Box>
          </Heading>
          {description && <Text size="body.lg">{description}</Text>}
        </Flex>
      </GridItem>
      {image && (
        <GridItem colSpan={{ base: 12, md: 5 }}>
          <ChakraNextImage
            src={require("public/assets/solutions-pages/commerce/shopify.png")}
            width="80px"
            alt="Shopify"
          />
        </GridItem>
      )}
    </SimpleGrid>
  );
};

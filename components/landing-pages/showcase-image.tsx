import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
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
  imagePosition?: "left" | "right";
}

export const LandingShowcaseImage: React.FC<LandingShowcaseImageProps> = ({
  miniTitle,
  title,
  titleWithGradient,
  gradient,
  description,
  image,
  imagePosition = "right",
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
      <GridItem order={imagePosition === "left" && !isMobile ? 2 : 1}>
        <Flex flexDir="column" justifyContent="center">
          {miniTitle && (
            <Text
              size="body.lg"
              as="span"
              textTransform="uppercase"
              fontWeight="bold"
            >
              {miniTitle}
            </Text>
          )}
          <Heading pb={4} size="display.sm">
            <Box as="span" bgGradient={gradient} bgClip="text">
              {titleWithGradient}{" "}
            </Box>
            {title}
          </Heading>
          {description && <Text size="body.xl">{description}</Text>}
        </Flex>
      </GridItem>
      <GridItem order={imagePosition === "left" && !isMobile ? 1 : 2}>
        <ChakraNextImage src={image} alt="" borderRadius="xl" />
      </GridItem>
    </SimpleGrid>
  );
};

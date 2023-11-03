import { LandingSectionHeadingProps } from "./types";
import { Box, Flex } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

export const LandingSectionHeading: React.FC<LandingSectionHeadingProps> = ({
  blackToWhiteTitle,
  title,
  gradient,
  titleWithGradient,
  titleSize = "display.sm",
  lineHeight = "100%",
}) => (
  <Flex flexDir="column" gap={2} textAlign="center" w="full">
    <Text
      bgGradient="linear(to-r, #FFFFFF, #343434)"
      bgClip="text"
      size="body.xl"
    >
      {blackToWhiteTitle}
    </Text>

    <Heading size={titleSize} lineHeight={lineHeight}>
      {title}{" "}
      {titleWithGradient && (
        <>
          {" "}
          <Box as="span" bgGradient={gradient} bgClip="text">
            {titleWithGradient}
          </Box>
        </>
      )}
    </Heading>
  </Flex>
);

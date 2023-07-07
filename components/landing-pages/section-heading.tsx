import { LandingSectionHeadingProps } from "./types";
import { Flex } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

export const LandingSectionHeading: React.FC<LandingSectionHeadingProps> = ({
  blackToWhiteTitle,
  title,
}) => (
  <Flex flexDir="column" gap={2} textAlign="center" w="full">
    <Text
      bgGradient="linear(to-r, #FFFFFF, #343434)"
      bgClip="text"
      size="body.xl"
    >
      {blackToWhiteTitle}
    </Text>
    <Heading size="display.sm">{title}</Heading>
  </Flex>
);

import { Flex } from "@chakra-ui/react";
import { Heading, type HeadingProps, Text } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";

type LayoutProps = {
  title: string;
  titleGradient: HeadingProps["bgGradient"];
  headline: string;
  description: string;
};

export const KeyFeatureLayout: ComponentWithChildren<LayoutProps> = ({
  title,
  titleGradient,
  headline,
  description,
  children,
}) => {
  return (
    <Flex
      maxW="container.page"
      px={4}
      mx="auto"
      my={128}
      position="relative"
      direction="column"
      align="center"
      w="full"
      as="section"
    >
      <Flex
        maxW={700}
        flexDir="column"
        align="center"
        gap={2}
        textAlign="center"
      >
        <Heading
          as="h2"
          size="title.lg"
          lineHeight="1.15"
          bgGradient={titleGradient}
          bgClip="text"
        >
          {title}
        </Heading>
        <Heading as="h3" size="title.2xl" color="white">
          {headline}
        </Heading>
        <Text
          py={8}
          mb={4}
          as="h4"
          maxW={480}
          size="body.lg"
          color="whiteAlpha.700"
        >
          {description}
        </Text>
      </Flex>
      {children}
    </Flex>
  );
};

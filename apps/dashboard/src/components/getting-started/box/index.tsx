import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Children } from "react";
import { Heading } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface GettingStartedBoxProps {
  title: string;
}

export const GettingStartedBox: ComponentWithChildren<
  GettingStartedBoxProps
> = ({ title, children }) => {
  const lengthOfChildren = Math.min(Children.count(children), 3);
  return (
    <Flex
      flexDirection="column"
      gap={8}
      px={{ base: 3, md: 6 }}
      py={{ base: 3, md: 6 }}
      transition="all 0.2s"
      position="relative"
      overflow="hidden"
    >
      <Flex direction="column" gap={3}>
        <Heading textAlign="center" size="title.sm">
          {title}
        </Heading>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: lengthOfChildren }}
        gap={6}
        transition="all 200ms"
        transformOrigin="top"
        overflow="hidden"
      >
        {children}
      </SimpleGrid>
    </Flex>
  );
};

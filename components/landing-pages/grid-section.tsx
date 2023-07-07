import { Flex, SimpleGrid } from "@chakra-ui/react";
import { ReactNode } from "react";
import { ComponentWithChildren } from "types/component-with-children";

interface LandingGridSectionProps {
  title: ReactNode;
}

export const LandingGridSection: ComponentWithChildren<
  LandingGridSectionProps
> = ({ title, children }) => {
  return (
    <Flex flexDir="column" gap={8}>
      {title}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {children}
      </SimpleGrid>
    </Flex>
  );
};

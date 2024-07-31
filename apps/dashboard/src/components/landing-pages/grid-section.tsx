import { Flex, SimpleGrid } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { ComponentWithChildren } from "types/component-with-children";

interface LandingGridSectionProps {
  title?: ReactNode;
  desktopColumns?: number;
}

export const LandingGridSection: ComponentWithChildren<
  LandingGridSectionProps
> = ({ title, desktopColumns = 3, children }) => {
  return (
    <Flex flexDir="column" gap={8}>
      {title && title}
      <SimpleGrid columns={{ base: 1, md: desktopColumns }} gap={6}>
        {children}
      </SimpleGrid>
    </Flex>
  );
};

import { Box, Flex, IconButton, SimpleGrid } from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { Children } from "react";
import { FiArrowDown, FiX } from "react-icons/fi";
import { Card, Heading, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface GettingStartedBoxProps {
  title: string;
  description: string | JSX.Element;
  storageId: string;
}

export const GettingStartedBox: ComponentWithChildren<
  GettingStartedBoxProps
> = ({ title, description, storageId, children }) => {
  const [isOpen, setIsOpen] = useLocalStorage(
    `getting-started:${storageId}`,
    true,
    false,
  );
  const lengthOfChildren = Math.min(Children.count(children), 3);
  return (
    <Card
      bg={isOpen ? undefined : "transparent"}
      boxShadow={isOpen ? undefined : "none"}
      as={Flex}
      flexDirection="column"
      gap={isOpen ? 4 : 0}
      px={{ base: 3, md: 6 }}
      py={isOpen ? { base: 3, md: 6 } : { base: 3, md: 4 }}
      transition="all 0.2s"
      position="relative"
      overflow="hidden"
    >
      <Flex align="center" justify="space-between" gap={4}>
        <Box display={{ base: "none", md: "block" }} boxSize={8} />
        <Heading
          textAlign={{ base: "left", md: "center" }}
          size="title.md"
          transition="all 0.2s"
          fontSize={isOpen ? "24px" : "18px"}
        >
          {title}
        </Heading>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? <FiX /> : <FiArrowDown />}
          aria-label={isOpen ? "Close" : "Open"}
          size="sm"
          variant="ghost"
        />
      </Flex>

      <Text
        fontStyle="italic"
        textAlign={{ base: "left", md: "center" }}
        size="body.lg"
        transition="all 200ms"
        transform={`scaleY(${isOpen ? 1 : 0})`}
        transformOrigin="top"
        maxH={isOpen ? "100px" : "0px"}
        opacity={isOpen ? 1 : 0}
        overflow="hidden"
        aria-hidden={!isOpen}
      >
        {description}
      </Text>
      <SimpleGrid
        columns={{ base: 1, md: lengthOfChildren }}
        gap={6}
        transition="all 200ms"
        transform={`scaleY(${isOpen ? 1 : 0})`}
        transformOrigin="top"
        maxH={isOpen ? { base: "100vh", md: "300px" } : "0px"}
        opacity={isOpen ? 1 : 0}
        overflow="hidden"
        aria-hidden={!isOpen}
      >
        {children}
      </SimpleGrid>
    </Card>
  );
};

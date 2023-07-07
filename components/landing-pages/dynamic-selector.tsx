import { LandingSectionHeading } from "./section-heading";
import { LandingSectionHeadingProps } from "./types";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { ReactElement, useState } from "react";
import { Text } from "tw-components";

interface SelectorItem {
  title: string;
  description: string;
  Component: ReactElement;
}

interface LandingDynamicSelectorProps extends LandingSectionHeadingProps {
  items: SelectorItem[];
}

export const LandingDynamicSelector: React.FC<LandingDynamicSelectorProps> = ({
  items,
  title,
  blackToWhiteTitle,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedItemTitle, setSelectedItemTitle] = useState(items[0].title);

  const selectedItem =
    items.find((item) => item.title === selectedItemTitle) || items[0];

  return (
    <Flex flexDir="column" gap={8}>
      <LandingSectionHeading
        title={title}
        blackToWhiteTitle={blackToWhiteTitle}
      />
      <Flex gap={12}>
        <Flex flexDir="column" w={{ base: "100%", md: "80%" }}>
          {items.map((item, index) => (
            <Flex key={index}>
              <Flex
                onClick={() => setSelectedItemTitle(item.title)}
                cursor={{ base: "default", md: "pointer" }}
                pointerEvents={{ base: "none", md: "all" }}
                flexDir="column"
                gap={6}
              >
                <Flex
                  borderBottom="2px solid"
                  borderBottomColor={
                    selectedItemTitle === item.title || isMobile
                      ? "primary.500"
                      : "gray.800"
                  }
                  py={6}
                  w="full"
                >
                  <Text size="label.lg">{item.title}</Text>
                </Flex>
                <Box>
                  <Text
                    size="body.md"
                    display={
                      isMobile || selectedItemTitle === item.title
                        ? "inherit"
                        : "none"
                    }
                  >
                    {item.description}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Flex display={{ base: "none", md: "inherit" }}>
          <Box ml={5}>{selectedItem.Component}</Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

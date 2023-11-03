import { LandingSectionHeading } from "./section-heading";
import { LandingSectionHeadingProps } from "./types";
import { Box, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { ReactElement, useState } from "react";
import { HeadingSizes } from "theme/typography";
import { Text } from "tw-components";

interface SelectorItem {
  title: string;
  description: string;
  Component: ReactElement;
}

interface LandingDynamicSelectorProps extends LandingSectionHeadingProps {
  items: SelectorItem[];
  gradient?: string;
  titleSize?: HeadingSizes;
  titleWithGradient?: string;
  titleGradient?: string;
  margin?: string;
  lineHeight?: string;
  TRACKING_CATEGORY: string;
}

export const LandingDynamicSelector: React.FC<LandingDynamicSelectorProps> = ({
  items,
  title,
  titleWithGradient,
  gradient = "linear(to-r, #BFA3DA, #84309C, #C735B0)",
  TRACKING_CATEGORY,
  titleSize,
  blackToWhiteTitle,
  titleGradient,
  lineHeight,
  margin = "",
}) => {
  const [selectedItemTitle, setSelectedItemTitle] = useState(items[0].title);
  const trackEvent = useTrack();

  const selectedItem =
    items.find((item) => item.title === selectedItemTitle) || items[0];

  return (
    <Flex flexDir="column" gap={8}>
      <LandingSectionHeading
        title={title}
        blackToWhiteTitle={blackToWhiteTitle}
        titleWithGradient={titleWithGradient}
        gradient={titleGradient}
        titleSize={titleSize}
        lineHeight={lineHeight}
      />
      <SimpleGrid
        borderRadius="xl"
        borderColor="gray.900"
        borderWidth={1}
        columns={12}
        overflow="hidden"
        margin={margin}
      >
        <GridItem
          as={SimpleGrid}
          columns={1}
          w={{ base: "100%", md: "100%" }}
          colSpan={{ base: 12, md: 4 }}
        >
          {items.map((item, index) => (
            <Flex
              key={index}
              borderColor="gray.900"
              borderWidth={1}
              p={8}
              borderLeft="none"
              _last={{ borderBottom: "none" }}
              _first={{ borderTop: "none" }}
              onClick={() => {
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "select",
                  label: item.title,
                });
                setSelectedItemTitle(item.title);
              }}
              cursor={{ base: "default", md: "pointer" }}
              pointerEvents={{ base: "none", md: "all" }}
              flexDir="column"
              w="full"
            >
              <Text
                size="label.lg"
                bgClip="text"
                bgGradient={{
                  base: "linear(to-r, #fff, #fff)",
                  md:
                    selectedItemTitle === item.title
                      ? gradient
                      : "linear(to-r, #fff, #fff)",
                }}
                pb={4}
                lineHeight="120%"
              >
                {item.title}
              </Text>
              <Text size="body.md">{item.description}</Text>
            </Flex>
          ))}
        </GridItem>
        <GridItem
          as={Flex}
          display={{ base: "none", md: "inherit" }}
          colSpan={8}
          p={8}
          alignItems="center"
        >
          <Box ml={5}>{selectedItem.Component}</Box>
        </GridItem>
      </SimpleGrid>
    </Flex>
  );
};

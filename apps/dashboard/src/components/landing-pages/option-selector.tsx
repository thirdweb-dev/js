import { ChakraNextImage } from "components/Image";
import { LandingSectionHeading } from "./section-heading";
import { LandingSectionHeadingProps } from "./types";
import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { StaticImageData } from "next/image";
import { useState } from "react";
import { Card, Text, Heading, Link } from "tw-components";
import {
  PRODUCTS,
  ProductLabel,
} from "components/product-pages/common/nav/data";
import { LandingDesktopMobileImage } from "./desktop-mobile-image";

interface OptionItem {
  title: string;
  description: string;
  products?: ProductLabel[];
  steps: string[];
  image?: StaticImageData;
  mobileImage?: StaticImageData;
}

interface LandingOptionSelectorProps extends LandingSectionHeadingProps {
  items: OptionItem[];
  TRACKING_CATEGORY: string;
}

export const LandingOptionSelector: React.FC<LandingOptionSelectorProps> = ({
  items,
  title,
  TRACKING_CATEGORY,
  blackToWhiteTitle,
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
      />
      <Flex gap={4} flexWrap="wrap" justifyContent="center">
        {items.map((item) => (
          <Card
            key={item.title}
            onClick={() => {
              trackEvent({
                category: TRACKING_CATEGORY,
                action: "select",
                label: item.title,
              });
              setSelectedItemTitle(item.title);
            }}
            py={1}
            px={3}
            cursor="pointer"
            transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
            _hover={{
              borderColor: "blue.500",
              boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
              transform: "scale(1.01)",
            }}
            borderColor={
              item.title === selectedItem.title ? "blue.500" : "inherit"
            }
          >
            {item.title}
          </Card>
        ))}
      </Flex>
      <SimpleGrid columns={{ base: 1, lg: 12 }} gap={8}>
        <GridItem colSpan={{ base: 1, lg: 4 }}>
          <Card as={Flex} flexDir="column" gap={8} p={8}>
            <Heading as="h4" size="title.md">
              {selectedItem.title}
            </Heading>
            <Text>{selectedItem.description}</Text>
            {selectedItem.products && (
              <Flex flexDir="column" gap={2}>
                <Text size="label.sm" fontWeight="bold">
                  PRODUCTS
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {selectedItem.products.map((product) => {
                    const prd = PRODUCTS.find((p) => p.label === product) || {
                      name: "",
                      description: "",
                      link: "",
                      icon: "",
                    };
                    return (
                      <Link
                        key={product}
                        href={prd.link}
                        _hover={{ textDecor: "none" }}
                        target="_blank"
                      >
                        <Flex
                          pl={2}
                          border="1px solid"
                          borderRadius="lg"
                          borderColor="borderColor"
                          _hover={{
                            borderColor: "blue.500",
                          }}
                          justifyContent="center"
                          alignItems="center"
                        >
                          {prd?.icon && (
                            <ChakraNextImage
                              alt=""
                              src={prd?.icon}
                              boxSize={4}
                            />
                          )}
                          <Text p={2} size="label.sm">
                            {prd.name}
                          </Text>
                        </Flex>
                      </Link>
                    );
                  })}
                </Flex>
              </Flex>
            )}
          </Card>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 8 }}>
          <Card p={0} overflow="hidden">
            {selectedItem?.image && (
              <LandingDesktopMobileImage
                image={selectedItem.image}
                mobileImage={selectedItem?.mobileImage}
              />
            )}
            <SimpleGrid columns={{ base: 1, lg: selectedItem.steps.length }}>
              {selectedItem.steps.map((step, idx) => (
                <Flex key={step} flexDir="column" gap={4} p={8}>
                  <Flex
                    borderRadius="full"
                    boxSize={8}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      size="body.xl"
                      border="1px solid"
                      borderRadius="full"
                      boxSize={8}
                      textAlign="center"
                    >
                      {idx + 1}
                    </Text>
                  </Flex>
                  <Text>{step}</Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Card>
        </GridItem>
      </SimpleGrid>
    </Flex>
  );
};

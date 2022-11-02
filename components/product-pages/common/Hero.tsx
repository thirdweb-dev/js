import { ProductButton } from "./ProductButton";
import {
  AspectRatio,
  Center,
  Container,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { Heading, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

export interface IHero {
  name: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  image?: StaticImageData;
}

export const Hero: ComponentWithChildren<IHero> = ({
  name,
  title,
  description,
  buttonText,
  buttonLink,
  image,
  gradient,
  children,
}) => {
  return (
    <Center
      w="100%"
      as="section"
      flexDirection="column"
      bg="#030A19"
      padding={{ base: 0, md: "64px" }}
    >
      <SimpleGrid
        as={Container}
        maxW="container.page"
        borderRadius={{ base: 0, md: 24 }}
        bg={gradient}
        columns={{ base: 1, md: 7 }}
        padding={0}
        margin={{ base: "0px", md: "40px" }}
        mb={0}
        minHeight="578px"
      >
        <Flex
          gridColumnEnd={{ base: undefined, md: image ? "span 4" : "span 7" }}
          padding={{ base: "24px", md: "48px" }}
          pt={{ base: "36px", md: undefined }}
          bg="rgba(0, 0, 0, 0.5)"
          borderLeftRadius={{ base: 0, md: 24 }}
          flexDir="column"
          gap={{ base: 6, md: "32px" }}
          align={{ base: "initial", md: "start" }}
          justify={{ base: "start", md: "center" }}
        >
          <Stack
            direction="row"
            align="center"
            spacing={1}
            opacity={0.8}
            justify={{ base: "center", md: "flex-start" }}
          >
            <Text
              cursor="default"
              fontWeight="medium"
              color="whiteAlpha.800"
              size="body.lg"
            >
              Products
            </Text>
            <Icon as={FiChevronRight} color="whiteAlpha.800" />
            <Text
              cursor="default"
              fontWeight="medium"
              color="whiteAlpha.800"
              size="body.lg"
            >
              {name}
            </Text>
          </Stack>
          <Heading
            as="h2"
            fontSize="48px"
            fontWeight="bold"
            size="display.sm"
            textAlign={{ base: "center", md: "left" }}
          >
            {title}
          </Heading>
          <Heading
            as="h3"
            size="subtitle.md"
            color="white"
            opacity={0.8}
            textAlign={{ base: "center", md: "left" }}
          >
            {description}
          </Heading>
          <ProductButton
            mt="32px"
            title={buttonText}
            href={buttonLink}
            color="blackAlpha.900"
            bg="white"
          />
        </Flex>
        {image && (
          <Center
            padding={{ base: "24px", md: "48px" }}
            gridColumnEnd={{ base: undefined, md: "span 3" }}
          >
            <Flex justifyContent={{ base: "center", md: "flex-end" }} w="100%">
              <AspectRatio ratio={1} maxW={96} w="100%">
                <ChakraNextImage alt="" src={image} priority />
              </AspectRatio>
            </Flex>
          </Center>
        )}
      </SimpleGrid>

      <Container
        maxW="container.page"
        mt="64px"
        padding={{ base: "24px", md: 0 }}
      >
        {children}
      </Container>
    </Center>
  );
};

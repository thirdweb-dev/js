import { Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { StaticImageData } from "next/image";
import React from "react";
import { ChakraNextLink, Heading, Text } from "tw-components";

interface Item {
  img: StaticImageData;
  title: string;
  link: string;
  description: string;
}

interface HomePageCardProps {
  title: string;
  description: string;
  introductionTitle: string;
  image: StaticImageData;
  mobileImage?: StaticImageData;
  items: Item[];
}

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <ChakraNextLink href={item.link} textDecoration={"none!important"}>
      <Flex
        padding={"16px"}
        border={"0.5px solid #2B2B2B"}
        borderRadius={"12px"}
        background={"#131417"}
        flexDir={"column"}
        minH={"110px"}
        transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
        _hover={{
          borderColor: "blue.500",
          boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
          transform: "scale(1.01)",
        }}
      >
        <Flex alignItems={"center"}>
          <ChakraNextImage maxW={"24px"} src={item.img} alt="item-card-logo" />

          <Text
            fontSize={"14px"}
            color={"#fff"}
            marginLeft={"8px"}
            fontWeight={600}
          >
            {item.title}
          </Text>
        </Flex>

        <Text fontSize={"14px"} marginTop={"12px"} color={"#646D7A"}>
          {item.description}
        </Text>
      </Flex>
    </ChakraNextLink>
  );
};

const HomePageCard = ({
  title,
  description,
  image,
  mobileImage,
  items,
  introductionTitle,
}: HomePageCardProps) => {
  return (
    <Container
      position="relative"
      maxW={"container.page"}
      mt={20}
      mb={{ base: 12, md: 40 }}
      zIndex={10}
    >
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={{ base: 12, md: 8 }}
        mt={{ base: 4, md: 28 }}
        flexDirection={"column-reverse"}
      >
        <Flex
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          w={"100%"}
          maxW={{ base: "100%", md: "100%" }}
          order={{ base: 2, md: 1 }}
        >
          <Flex flexDir="column" gap={4}>
            <Heading as="h1" size="title.2xl">
              {title}
            </Heading>
          </Flex>
          <Text size="body.lg" mr={6}>
            {description}
          </Text>

          <Text
            fontSize={"14px"}
            color={"#646D7A"}
            fontWeight={600}
            letterSpacing={"1.4px"}
          >
            {introductionTitle}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={"26px"}>
            {items.map((item, idx) => {
              return <ItemCard key={idx} item={item} />;
            })}
          </SimpleGrid>
        </Flex>
        <Flex
          flexDir={"column"}
          alignItems={{ base: "center", md: "flex-end" }}
          order={{ base: 1, md: 2 }}
        >
          <LandingDesktopMobileImage
            maxW={"383px"}
            image={image}
            mobileImage={mobileImage}
          />
        </Flex>
      </SimpleGrid>
    </Container>
  );
};

export default HomePageCard;

import { Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { HomeProductCard } from "components/dashboard/HomeProductCard";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { SectionItemProps } from "components/product-pages/common/nav/types";
import { StaticImageData } from "next/image";
import React from "react";
import { Heading, Text } from "tw-components";

interface HomePageCardProps {
  title: string;
  description: string;
  introductionTitle: string;
  image: StaticImageData;
  mobileImage?: StaticImageData;
  products: SectionItemProps[];
  TRACKING_CATEGORY: string;
}

const HomePageCard = ({
  title,
  description,
  image,
  mobileImage,
  products,
  introductionTitle,
  TRACKING_CATEGORY,
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
            {products.map((product, idx) => {
              return (
                <HomeProductCard
                  key={idx}
                  TRACKING_CATEGORY={TRACKING_CATEGORY}
                  product={product}
                  isFromLandingPage
                />
              );
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

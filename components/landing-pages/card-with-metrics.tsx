import { Container, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { LandingDesktopMobileImage } from "./desktop-mobile-image";
import { StaticImageData } from "next/image";
import { Heading, Text, TrackedLink } from "tw-components";

interface MetricItem {
  title: string;
  description: string;
  colSpan?: number;
}

interface CardWithMetricsProps {
  title: string;
  description: string;
  href: string;
  TRACKING_CATEGORY: string;
  hoverBackground: string;
  items: MetricItem[];
  image: StaticImageData;
  mobileImage: StaticImageData;
}

const CardWithMetric = ({
  title,
  description,
  href,
  TRACKING_CATEGORY,
  image,
  mobileImage,
  items,
  hoverBackground,
}: CardWithMetricsProps) => {
  return (
    <TrackedLink
      href={href}
      category={TRACKING_CATEGORY}
      label="cards-with-images"
      color="white"
      _hover={{
        textDecoration: "none",
      }}
      trackingProps={{
        title: title.toLowerCase().replaceAll(" ", "-"),
      }}
      rounded="lg"
    >
      <Flex
        flexDir="column"
        p={25}
        borderWidth={1}
        borderColor="borderColor"
        transition="400ms ease"
        _hover={{
          background: hoverBackground,
        }}
        rounded="lg"
      >
        <Flex flex={1}>
          <LandingDesktopMobileImage image={image} mobileImage={mobileImage} />
        </Flex>

        <Flex flexDir="column" mt={7}>
          <Heading size="title.md" color="white" fontWeight={500}>
            {title}
          </Heading>
          <Text size="body.lg" mt={4}>
            {description}
          </Text>
        </Flex>

        <SimpleGrid columns={4} placeItems="center" mt={8}>
          {items.map((item, index) => (
            <GridItem colSpan={item.colSpan ? item.colSpan : 1} key={index}>
              <Flex flex={1} flexDir="column">
                <Heading size="title.xs" color="white">
                  {item.title}
                </Heading>
                <Text size="body.sm" mt={1}>
                  {item.description}
                </Text>
              </Flex>
            </GridItem>
          ))}
        </SimpleGrid>
      </Flex>
    </TrackedLink>
  );
};

interface LandingCardWithMetricsProps {
  title: ReactNode;
  desktopColumns: number;
  metrics: Omit<CardWithMetricsProps, "TRACKING_CATEGORY">[];
  TRACKING_CATEGORY: string;
}

const LandingCardWithMetrics = ({
  title,
  desktopColumns,
  metrics,
  TRACKING_CATEGORY,
}: LandingCardWithMetricsProps) => {
  return (
    <Container
      position="relative"
      maxW="container.page"
      mt={20}
      mb={{ base: 12, md: 40 }}
      zIndex={10}
    >
      <Flex flexDir="column" gap={58}>
        {title && title}
        <SimpleGrid columns={{ base: 1, md: desktopColumns }} gap={6}>
          {metrics.map(
            (
              {
                title: cardTitle,
                description: cardDescription,
                href,
                hoverBackground,
                items,
                image,
                mobileImage,
              },
              idx,
            ) => (
              <CardWithMetric
                key={idx}
                title={cardTitle}
                description={cardDescription}
                href={href}
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                hoverBackground={hoverBackground}
                items={items}
                mobileImage={mobileImage}
                image={image}
              />
            ),
          )}
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

export default LandingCardWithMetrics;

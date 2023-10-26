import { Flex, GridItem, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Card, Text, TrackedLink } from "tw-components";
import { LandingDesktopMobileImage } from "./desktop-mobile-image";
import { ChakraNextImage } from "components/Image";

interface LandingCardWithImageProps {
  title: string;
  description?: ReactNode;
  image: StaticImageData;
  mobileImage?: StaticImageData;
  direction?: "vertical" | "horizontal";
  colSpan?: number;
  href: string;
  TRACKING_CATEGORY: string;
}

export const LandingCardWithImage: React.FC<LandingCardWithImageProps> = ({
  title,
  description,
  image,
  mobileImage,
  direction = "vertical",
  colSpan = 2,
  href,
  TRACKING_CATEGORY,
}) => {
  return (
    <GridItem colSpan={{ base: 2, md: colSpan }} h="full" cursor="pointer">
      <LinkBox h="full">
        <Card
          as={Flex}
          gap={6}
          p={0}
          h="full"
          flexDir={{
            base: "column",
            md: direction === "vertical" ? "column" : "row",
          }}
          overflow="hidden"
          transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
          _hover={{
            borderColor: "blue.500",
            boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
            transform: "scale(1.01)",
          }}
          justifyContent="space-between"
          alignItems="end"
        >
          <Flex
            gap={4}
            px={10}
            pt={10}
            flexDir="column"
            alignSelf="start"
            h="full"
          >
            <Text size="body.xl" color="white" fontWeight="bold">
              <TrackedLink
                as={LinkOverlay}
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
              >
                {title}
              </TrackedLink>
            </Text>
            {description && <Text size="body.lg">{description}</Text>}
          </Flex>
          <LandingDesktopMobileImage
            image={image}
            mobileImage={mobileImage}
            w={{ base: "100%", md: direction === "vertical" ? "100%" : "50%" }}
          />
        </Card>
      </LinkBox>
    </GridItem>
  );
};

interface LandingImageProps {
  title: ReactNode;
  gap: string | number;
  images: { height: number; width: number; src: string; title: string }[];
}

export const LandingImages: React.FC<LandingImageProps> = ({
  title,
  images,
  gap,
}) => {
  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" gap={8}>
      {title && title}

      <Flex
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        gap={gap}
        marginTop="24px"
      >
        {images.length
          ? images.map(({ src, height, width, title: imgTitle }, idx) => {
              return (
                <Flex
                  flexDir="column"
                  alignItems="center"
                  justifyContent="center"
                  key={idx}
                >
                  <ChakraNextImage
                    src={src}
                    height={height}
                    width={width}
                    alt="card-with-image"
                  />

                  <Text
                    marginTop="16px"
                    fontWeight={500}
                    fontSize="14px"
                    color="#fff"
                  >
                    {imgTitle}
                  </Text>
                </Flex>
              );
            })
          : null}
      </Flex>
    </Flex>
  );
};

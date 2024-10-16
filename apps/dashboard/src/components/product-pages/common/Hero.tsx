import { Container, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { ChevronRightIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import type { ReactElement, ReactNode } from "react";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import { ProductButton } from "./ProductButton";

interface HeroProps {
  name: string;
  title: string;
  description: ReactNode;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  image?: StaticImageData;
  type?: "Products" | "Solutions" | "Learn";
  underGetStarted?: ReactElement;
  trackingCategory: string;
  secondaryButton?: {
    text: string;
    link: string;
  };
  imageHeight?: string;
}

export const Hero: ComponentWithChildren<HeroProps> = ({
  name,
  title,
  description,
  buttonText,
  buttonLink,
  image,
  gradient,
  type = "Products",
  underGetStarted,
  secondaryButton,
  trackingCategory,
  children,
  imageHeight,
}) => {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#030A19] p-0 md:p-[64px]">
      <SimpleGrid
        as={Container}
        maxW="container.page"
        borderRadius={{ base: 0, md: 24 }}
        bg={gradient}
        columns={{ base: 1, md: 7 }}
        padding={0}
        margin={{ base: "0px", md: "40px" }}
        mb={0}
        minHeight={{ base: undefined, md: "578px" }}
        overflow="hidden"
      >
        <Flex
          gridColumnEnd={{ base: undefined, md: image ? "span 4" : "span 7" }}
          padding={{ base: "24px", md: "48px" }}
          pt={{ base: "36px", md: undefined }}
          bg="linear-gradient(90deg, rgba(3,10,25,.75) 0%, rgba(3,10,25,0) 100%)"
          position="relative"
          flexDir="column"
          gap={{ base: 6, md: "32px" }}
          align={{ base: "initial", md: "start" }}
          justify={{ base: "start", md: "center" }}
        >
          <div className="hidden flex-row items-center justify-center gap-1 opacity-80 md:flex md:justify-start">
            <Text
              cursor="default"
              fontWeight="medium"
              color="whiteAlpha.800"
              size="body.lg"
            >
              {type}
            </Text>
            <ChevronRightIcon className="size-4 text-white opacity-80" />
            <Text
              cursor="default"
              fontWeight="medium"
              color="whiteAlpha.800"
              size="body.lg"
            >
              {name}
            </Text>
          </div>
          <Heading
            pt={{ base: "80px", md: "0px" }}
            as="h1"
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

          <SimpleGrid
            mt={8}
            columns={{ base: 1, lg: 2 }}
            gap={2}
            rowGap={4}
            placeItems="center"
          >
            <GridItem w="full">
              <ProductButton
                title={buttonText}
                href={buttonLink}
                color="blackAlpha.900"
                bg="white"
              />
            </GridItem>
            <GridItem w="full">
              {secondaryButton && (
                <LinkButton
                  as={TrackedLink}
                  variant="outline"
                  borderWidth="2px"
                  w="full"
                  py="22px"
                  fontSize="20px"
                  fontWeight="bold"
                  textAlign="center"
                  borderRadius="md"
                  {...{
                    category: trackingCategory,
                    label: secondaryButton.text
                      .replaceAll(" ", "_")
                      .toLowerCase(),
                  }}
                  href={secondaryButton.link}
                  isExternal={secondaryButton.link.startsWith("http")}
                  noIcon
                >
                  {secondaryButton.text}
                </LinkButton>
              )}
            </GridItem>
            <GridItem>{underGetStarted}</GridItem>
          </SimpleGrid>
        </Flex>
        {image && (
          <div className="hidden items-center justify-center p-6 md:col-span-3 md:flex md:p-12">
            <ChakraNextImage
              maxH={{ base: imageHeight ? imageHeight : "480px" }}
              style={{ objectFit: "contain" }}
              alt=""
              loading="eager"
              src={image}
              priority
              sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
            />
          </div>
        )}
      </SimpleGrid>

      <Container
        maxW="container.page"
        mt="64px"
        padding={{ base: "24px", md: 0 }}
      >
        {children}
      </Container>
    </section>
  );
};

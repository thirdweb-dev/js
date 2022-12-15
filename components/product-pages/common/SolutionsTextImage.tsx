import { ProductSection } from "./ProductSection";
import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface SolutionsTextImageProps {
  image: string;
  title: string;
}

export const SolutionsTextImage: ComponentWithChildren<
  SolutionsTextImageProps
> = ({ image, title, children }) => {
  return (
    <ProductSection>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={12}
        alignItems="center"
        py={{ base: 6, md: 12 }}
      >
        <ChakraNextImage
          maxW={{ base: "100%", md: "50%" }}
          objectFit="contain"
          src={image}
          quality={95}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt=""
          borderRadius={{ base: "none", md: "lg" }}
        />

        <Flex flexDir="column" gap={4}>
          <Heading as="h2" size="display.sm" mb={4}>
            {title}
          </Heading>
          {children}
        </Flex>
      </Flex>
    </ProductSection>
  );
};

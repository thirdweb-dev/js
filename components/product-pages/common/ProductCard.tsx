import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Heading, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ProductCardProps {
  title: string;
  icon: StaticImageData;
}

export const ProductCard: ComponentWithChildren<ProductCardProps> = ({
  title,
  icon,
  children,
}) => {
  return (
    <Flex
      direction="column"
      bg="rgba(255, 255, 255, 0.05)"
      border="1px solid rgba(255, 255, 255, 0.05)"
      borderRadius="16px"
      padding="24px"
    >
      <ChakraNextImage src={icon} placeholder="empty" alt="" w={12} />
      <Heading size="title.sm" mt="32px">
        {title}
      </Heading>
      <Text size="body.lg" mt="16px">
        {children}
      </Text>
    </Flex>
  );
};

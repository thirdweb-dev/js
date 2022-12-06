import { Flex } from "@chakra-ui/react";
import NextImage, { StaticImageData } from "next/image";
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
      <NextImage
        src={icon}
        alt=""
        priority
        style={{
          width: "40px",
          height: "40px",
        }}
      />
      <Heading size="title.sm" mt="32px">
        {title}
      </Heading>
      <Text size="body.lg" mt="16px">
        {children}
      </Text>
    </Flex>
  );
};

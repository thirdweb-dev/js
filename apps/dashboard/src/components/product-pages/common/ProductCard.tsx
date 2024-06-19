import { Flex } from "@chakra-ui/react";
import NextImage, { StaticImageData } from "next/image";
import { Heading, TrackedLink } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ProductCardProps {
  title: string;
  icon: StaticImageData;
  titleLink?: string;
  linkCategory?: string;
}

export const ProductCard: ComponentWithChildren<ProductCardProps> = ({
  title,
  icon,
  children,
  titleLink,
  linkCategory,
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
      {titleLink && linkCategory ? (
        <TrackedLink
          href={titleLink}
          category={linkCategory}
          target="_blank"
          textDecoration="underline"
        >
          <Heading size="title.sm" mt="32px">
            {title}
          </Heading>
        </TrackedLink>
      ) : (
        <Heading size="title.sm" mt="32px">
          {title}
        </Heading>
      )}
      <Flex
        direction={"column"}
        fontSize="body.lg"
        mt="16px"
        color="paragraph"
        lineHeight={1.6}
        h="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
};

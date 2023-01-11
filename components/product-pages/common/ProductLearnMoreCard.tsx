import { Flex, Icon } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Heading, Link, Text } from "tw-components";

interface ProductLearnMoreCardProps {
  icon: StaticImageData;
  title: string;
  description: ReactNode;
  href: string;
}

export const ProductLearnMoreCard: React.FC<ProductLearnMoreCardProps> = ({
  title,
  icon,
  description,
  href,
}) => {
  return (
    <Flex direction="column" justify="space-between" align="flex-start" gap={4}>
      <Flex direction="column">
        <Flex alignItems="center" gap={2}>
          <ChakraNextImage src={icon} placeholder="empty" alt="" w={8} />
          <Heading size="title.sm" as="h3">
            {title}
          </Heading>
        </Flex>
        <Text size="body.lg" mt="16px">
          {description}
        </Text>
      </Flex>
      <Link
        width="auto"
        href={href}
        isExternal
        color="white"
        display="flex"
        alignItems="center"
        gap={1}
        role="group"
      >
        <span>Learn more</span>{" "}
        <Icon
          as={FiArrowRight}
          transform="rotate(-45deg)"
          transition="transform 0.2s"
          _groupHover={{ transform: "rotate(-45deg) translateX(2px)" }}
        />
      </Link>
    </Flex>
  );
};

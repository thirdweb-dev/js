import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { ArrowRightIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import {
  Heading,
  Text,
  TrackedLink,
  type TrackedLinkProps,
} from "tw-components";

interface ProductLearnMoreCardProps {
  icon: StaticImageData;
  title: string;
  description: ReactNode;
  href: string;
  category: TrackedLinkProps["category"];
}

export const ProductLearnMoreCard: React.FC<ProductLearnMoreCardProps> = ({
  title,
  icon,
  description,
  href,
  category,
}) => {
  return (
    <Flex direction="column" justify="space-between" align="flex-start" gap={4}>
      <div className="flex flex-col">
        <Flex alignItems="center" gap={2}>
          <ChakraNextImage src={icon} placeholder="empty" alt="" w={8} />
          <Heading size="title.sm" as="h3">
            {title}
          </Heading>
        </Flex>
        <Text size="body.lg" mt="16px">
          {description}
        </Text>
      </div>
      <TrackedLink
        width="auto"
        href={href}
        category={category}
        label={title.replace(" ", "_").toLowerCase()}
        isExternal
        color="white"
        display="flex"
        alignItems="center"
        gap={1}
        role="group"
      >
        <span>Learn more</span>
        <ArrowRightIcon className="-rotate-45 ml-2 size-4 transition-transform group-hover:translate-x-1 group-hover:rotate-45" />
      </TrackedLink>
    </Flex>
  );
};

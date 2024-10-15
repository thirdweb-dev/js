import { Box, Flex } from "@chakra-ui/react";
import { ArrowRightIcon } from "lucide-react";
import NextImage, { type StaticImageData } from "next/image";
import { Card, Heading, TrackedLink } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";

interface ImageCardProps {
  title: string;
  image: StaticImageData;
  TRACKING_CATEGORY: string;
  linkTitle?: string;
  category?: string;
  label: string;
  href: string;
}

export const ImageCard: ComponentWithChildren<ImageCardProps> = ({
  title,
  image,
  href,
  linkTitle,
  category,
  TRACKING_CATEGORY,
  label,
  children,
}) => {
  return (
    <TrackedLink
      category={TRACKING_CATEGORY || href}
      href={href}
      label={label}
      isExternal
      color="blue.400"
      _hover={{ textDecor: "none" }}
      role="group"
      textDecoration="none"
    >
      <Card as={Flex} flexDir="column" bg="black" padding={0} overflow="hidden">
        <NextImage src={image} alt="" priority />
        <Flex
          flexDir="column"
          gap={6}
          p={8}
          justifyContent="space-between"
          h="full"
        >
          <Flex alignItems="center" flexWrap="wrap" gap={4}>
            <Heading size="title.sm">{title}</Heading>

            {category && (
              <Box
                py={1}
                px={3}
                borderColor="#383838"
                borderWidth={1}
                maxW="fit-content"
                rounded={8}
                fontSize="12px"
              >
                {category}
              </Box>
            )}
          </Flex>
          {children && (
            <Flex
              direction="column"
              fontSize="body.lg"
              color="paragraph"
              lineHeight={1.6}
              h="100%"
            >
              {children}
            </Flex>
          )}
          {href && (
            <Flex alignItems="center">
              {linkTitle || <span>Visit website</span>}
              <ArrowRightIcon className="-rotate-45 ml-2 size-4 transition-transform group-hover:translate-x-1 group-hover:rotate-45" />
            </Flex>
          )}
        </Flex>
      </Card>
    </TrackedLink>
  );
};

import { Flex, Icon } from "@chakra-ui/react";
import NextImage, { StaticImageData } from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { Card, Heading, TrackedLink } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ImageCardProps {
  title: string;
  image: StaticImageData;
  TRACKING_CATEGORY?: string;
  href?: string;
}

export const ImageCard: ComponentWithChildren<ImageCardProps> = ({
  title,
  image,
  href,
  TRACKING_CATEGORY,
  children,
}) => {
  return (
    <Card as={Flex} flexDir="column" bg="black" padding={0} overflow="hidden">
      <NextImage src={image} alt="" priority />
      <Flex
        flexDir="column"
        gap={6}
        p={8}
        justifyContent="space-between"
        h="full"
      >
        <Heading size="title.sm">{title}</Heading>
        <Flex
          direction="column"
          fontSize="body.lg"
          color="paragraph"
          lineHeight={1.6}
          h="100%"
        >
          {children}
        </Flex>
        {href && (
          <TrackedLink
            category={TRACKING_CATEGORY || href}
            href={href}
            label="web3warriors"
            isExternal
            color="blue.400"
            _hover={{ textDecor: "underline" }}
            role="group"
          >
            <span>Visit website</span>{" "}
            <Icon
              as={FiArrowRight}
              transform="rotate(-45deg)"
              transition="transform 0.2s"
              _groupHover={{
                transform: "rotate(-45deg) translateX(2px)",
              }}
            />
          </TrackedLink>
        )}
      </Flex>
    </Card>
  );
};

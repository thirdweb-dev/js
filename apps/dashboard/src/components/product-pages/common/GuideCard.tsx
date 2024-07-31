import { AspectRatio, Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import {
  Heading,
  Text,
  TrackedLink,
  type TrackedLinkProps,
} from "tw-components";

interface GuideCardProps
  extends Pick<TrackedLinkProps, "category" | "label" | "trackingProps"> {
  image: string;
  title: string;
  description?: string;
  link: string;
  index: number;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  image,
  title,
  description,
  link,
  index,
  category,
  label,
  trackingProps,
}) => {
  return (
    <TrackedLink
      category={category}
      label={label}
      trackingProps={trackingProps}
      href={link}
      isExternal
      textDecor="none !important"
    >
      <Flex
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: index / 20 } }}
        exit={{ opacity: 0, y: -10, transition: { delay: index / 20 } }}
        as={motion.div}
        willChange="opacity"
        h="full"
        direction="column"
        borderRadius="2xl"
        border="1px solid"
        borderColor="#ffffff26"
        minH="325px"
        _hover={{ opacity: 0.86 }}
        overflow="hidden"
      >
        <AspectRatio ratio={2400 / 1260} w="full">
          <Box bg="rgba(0,0,0,.8)">
            <NextImage
              loading="lazy"
              alt=""
              src={image}
              fill
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            />
          </Box>
        </AspectRatio>
        <Flex
          flexGrow={1}
          flexDir="column"
          justifyContent="space-between"
          p={8}
          gap={4}
          bgColor="blackAlpha.300"
          borderBottomRadius="2xl"
        >
          <Heading size="title.sm">{title}</Heading>
          {description && <Text>{description}</Text>}
        </Flex>
      </Flex>
    </TrackedLink>
  );
};

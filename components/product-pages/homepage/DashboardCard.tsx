import { Icon } from "@chakra-ui/icon";
import {
  AspectRatio,
  Box,
  Flex,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import * as React from "react";
import type { IconType } from "react-icons";
import { Heading, Text } from "tw-components";

interface DashboardCardProps {
  headingTitle?: string;
  headingIcon?: IconType;
  title: string | JSX.Element;
  subtitle: string;
  rightImage: StaticImageData;
  gradientBGs?: CardGradientBackgroundProps;
  href?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  headingTitle,
  headingIcon,
  title,
  subtitle,
  rightImage,
  gradientBGs,
  href,
}) => {
  const titleElem = href ? (
    <LinkOverlay isExternal={href.startsWith("http")} href={href}>
      <Heading size="title.sm">{title}</Heading>
    </LinkOverlay>
  ) : (
    <Heading size="title.sm">{title}</Heading>
  );
  return (
    <LinkBox>
      <Stack
        borderRadius="2xl"
        boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
        overflow="hidden"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          position="relative"
          overflow="hidden"
          h={64}
        >
          <CardGradientBackground {...gradientBGs} />
          <ChakraNextImage p={6} alt="" src={rightImage} w="100%" />
        </Flex>
        <Flex
          flexDir="column"
          p={{ base: 6, md: 10 }}
          flexGrow={1}
          gap={4}
          bgColor="blackAlpha.300"
        >
          {headingTitle && (
            <Flex alignItems="center" gap={1.5}>
              {headingIcon && <Icon as={headingIcon} boxSize={4} />}
              <Text size="label.sm" textTransform="uppercase">
                {headingTitle}
              </Text>
            </Flex>
          )}
          {titleElem}
          <Text size="body.lg">{subtitle}</Text>
        </Flex>
      </Stack>
    </LinkBox>
  );
};

interface CardGradientBackgroundProps {
  topGradient?: string;
  bottomGradient?: string;
  leftGradient?: string;
  rightGradient?: string;
}

export const CardGradientBackground: React.FC<CardGradientBackgroundProps> = (
  props,
) => {
  return (
    <Box
      zIndex={-1}
      overflow="hidden"
      position="absolute"
      top={0}
      left={0}
      w="full"
      h="full"
      opacity={1}
      background={
        "linear-gradient(225.96deg, #000000 -0.79%, #4400D5 42.2%, #000000 101.89%)"
      }
      borderTopRadius="xl"
    >
      {props.topGradient && (
        <AspectRatio
          position="absolute"
          ratio={882 / 486}
          top="-90%"
          left="-5%"
          w="full"
        >
          <Box
            background={props.topGradient}
            borderRadius="full"
            filter="blur(69px)"
          />
        </AspectRatio>
      )}
      {props.rightGradient && (
        <AspectRatio
          position="absolute"
          ratio={882 / 486}
          top="-55%"
          right="-50%"
          w="full"
        >
          <Box
            transform="rotate(15deg)"
            background={props.rightGradient}
            borderRadius="full"
            filter="blur(69px)"
          />
        </AspectRatio>
      )}
      {props.bottomGradient && (
        <AspectRatio
          position="absolute"
          ratio={882 / 486}
          bottom="-50%"
          left="15%"
          w="full"
        >
          <Box
            background={props.bottomGradient}
            borderRadius="full"
            filter="blur(80px)"
          />
        </AspectRatio>
      )}
      {props.leftGradient && (
        <AspectRatio
          position="absolute"
          ratio={882 / 486}
          bottom="-50%"
          left="-20%"
          w="full"
        >
          <Box
            background={props.leftGradient}
            borderRadius="full"
            filter="blur(80px)"
          />
        </AspectRatio>
      )}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        backdropFilter="blur(5px)"
      />
    </Box>
  );
};

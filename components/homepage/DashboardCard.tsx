import Icon from "@chakra-ui/icon";
import { AspectRatio, Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import * as React from "react";
import { IconType } from "react-icons";
import { Heading, Text } from "tw-components";

interface DashboardCardProps {
  headingTitle: string;
  headingIcon: IconType;
  title: string | JSX.Element;
  subtitle: string;
  rightImage: StaticImageData;
  gradientBGs?: CardGradientBackgroundProps;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  headingTitle,
  headingIcon,
  title,
  subtitle,
  rightImage,
  gradientBGs,
}) => {
  return (
    <SimpleGrid
      borderRadius="2xl"
      border="1px solid"
      borderColor="#ffffff26"
      overflow="hidden"
      columns={1}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        position="relative"
        overflow="hidden"
        flexGrow={0}
        flexShrink={0}
        h={64}
      >
        <CardGradientBackground {...gradientBGs} />
        <ChakraNextImage p={6} alt="" src={rightImage} w="100%" />
      </Flex>
      <Flex
        flexShrink={0}
        flexGrow={0}
        flexDir="column"
        justifyContent="space-between"
        p={{ base: 6, md: 10 }}
        gap={4}
        bgColor="blackAlpha.300"
      >
        <Flex alignItems="center" gap={1.5}>
          <Icon as={headingIcon} boxSize={4} />
          <Text size="label.sm" textTransform="uppercase">
            {headingTitle}
          </Text>
        </Flex>
        <Heading size="title.sm">{title}</Heading>
        <Text size="body.lg">{subtitle}</Text>
      </Flex>
    </SimpleGrid>
  );
};

interface CardGradientBackgroundProps {
  topGradient?: string;
  bottomGradient?: string;
  leftGradient?: string;
  rightGradient?: string;
}

const CardGradientBackground: React.FC<CardGradientBackgroundProps> = (
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
      background="linear-gradient(225.96deg, #000000 -0.79%, #4400D5 42.2%, #000000 101.89%)"
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

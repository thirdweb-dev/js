import { Flex, Heading, Stack } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { FeatureCardMap } from "constants/mappings";
import React from "react";

interface IFeatureCardProps {
  type: keyof typeof FeatureCardMap;
}

export const HomepageFeatureCard: React.FC<IFeatureCardProps> = ({ type }) => {
  const { bg, title, icon, description, gradientBg } =
    FeatureCardMap[type as keyof typeof FeatureCardMap];

  return (
    <Flex
      position="relative"
      borderRadius={6}
      p={8}
      flexDir="column"
      bg={bg}
      overflow="hidden"
    >
      <Stack
        mb={6}
        spacing={4}
        direction={{ base: "row", lg: "column" }}
        align={{ base: "center", lg: "flex-start" }}
      >
        <ChakraNextImage w={{ base: 12, lg: 16 }} src={icon} alt={title} />

        <Heading as="h4" color="whiteAlpha.900" size="title.lg">
          {title}
        </Heading>
      </Stack>
      <Heading as="p" size="subtitle.md" color="whiteAlpha.900">
        {description}
      </Heading>

      {gradientBg && (
        <ChakraNextImage
          alt=""
          borderRadius={6}
          overflow="hidden"
          mixBlendMode={gradientBg.blendMode}
          pointerEvents="none"
          position="absolute"
          zIndex={0}
          top={0}
          left={0}
          bottom={0}
          right={0}
          src={gradientBg.url}
          objectFit="cover"
          objectPosition={gradientBg.position}
          layout="fill"
        />
      )}
    </Flex>
  );
};

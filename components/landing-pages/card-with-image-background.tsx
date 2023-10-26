import { Box } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import React, { ReactNode } from "react";

interface CardWithImageProps {
  image: string;
  children: ReactNode;
}

const LandingCardWithImageBackground = ({
  children,
  image,
}: CardWithImageProps) => {
  return (
    <Box
      borderRadius="12px"
      position="relative"
      padding="45px"
      minHeight="360px"
      width="full"
    >
      <ChakraNextImage
        userSelect="none"
        position="absolute"
        borderRadius="12px"
        top="0"
        left="0"
        right="0"
        bottom="0"
        width="100%"
        height="100%"
        objectFit="cover"
        alt=""
        src={image}
      />

      <Box position="relative" zIndex="2">
        {children}
      </Box>
    </Box>
  );
};

export default LandingCardWithImageBackground;

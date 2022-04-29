import {
  AspectRatio,
  AspectRatioProps,
  Box,
  Center,
  keyframes,
  useBreakpointValue,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import React from "react";

const spin = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(120deg)}
`;

export const AnimatedGradient: React.FC<
  Omit<AspectRatioProps, "ratio"> & { hero?: true }
> = ({ hero, opacity, ...props }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <AspectRatio
      ratio={1}
      zIndex="0"
      opacity={opacity || [1, 1, 0.5]}
      {...props}
    >
      <Center overflow="visible!important">
        <Box
          w="60%"
          h="60%"
          position="relative"
          filter={isMobile ? "blur(100px)" : "blur(150px)"}
          overflow="visible"
          animation={
            prefersReducedMotion || !hero
              ? undefined
              : `${spin} 5s ease-in-out alternate infinite`
          }
        >
          <Box
            w="60%"
            h="60%"
            position="absolute"
            bg="purple.500"
            top="22%"
            left="22%"
            transform="translate(-50%, -50%)"
          />
          <Box
            w="60%"
            h="60%"
            position="absolute"
            bg="orange.500"
            top="22%"
            right="22%"
            transform="translate(50%, -50%)"
          />
          <Box
            w="60%"
            h="60%"
            position="absolute"
            bg="primary.500"
            bottom="22%"
            left="22%"
            transform="translate(-50%, 50%)"
          />
          <Box
            w="60%"
            h="60%"
            position="absolute"
            bg="red.500"
            bottom="22%"
            right="22%"
            transform="translate(50%, 50%)"
          />
        </Box>
      </Center>
    </AspectRatio>
  );
};

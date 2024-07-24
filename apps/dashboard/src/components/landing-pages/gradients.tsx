import { Box, type BoxProps } from "@chakra-ui/react";

interface GradientPosition {
  top?: BoxProps["top"];
  bottom?: BoxProps["top"];
  left?: BoxProps["top"];
  right?: BoxProps["top"];
  height?: BoxProps["height"];
  width?: BoxProps["width"];
  backgroundSize?: BoxProps["backgroundSize"];
  background?: BoxProps["background"];
}

interface GradientsProps {
  top: GradientPosition;
  bottom: GradientPosition;
}

export function Gradients({ top, bottom }: GradientsProps) {
  return (
    <>
      <Box
        position="absolute"
        top={top.top}
        left={top.left}
        right={top.right}
        bottom={top.bottom}
        height={top.height}
        width={top.width}
        background={top.background}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize={top.backgroundSize}
        zIndex={2}
      />

      <Box
        position="absolute"
        top={bottom.top}
        left={bottom.left}
        right={bottom.right}
        bottom={bottom.bottom}
        height={bottom.height}
        width={bottom.width}
        background={bottom.background}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize={bottom.backgroundSize}
        zIndex={2}
      />
    </>
  );
}

import { chakra } from "@chakra-ui/react";
import NextImage from "next/image";

export const ChakraNextImage = chakra(NextImage, {
  baseStyle: { objectFit: "contain!important", maxW: "100%", zIndex: 1 },
  shouldForwardProp: (prop) =>
    [
      "src",
      "alt",
      "fill",
      "loader",
      "quality",
      "priroty",
      "loading",
      "placeholder",
      "blurDataURL",
      "unoptimized",
      "onLoadingComplete",
      "sizes",
    ].includes(prop),
});

export type ChakraNextImageProps = React.ComponentProps<typeof ChakraNextImage>;

import { chakra } from "@chakra-ui/react";
import NextImage from "next/image";

export const ChakraNextImage = chakra(NextImage, {
  baseStyle: { objectFit: "contain!important", maxW: "100%", zIndex: 1 },
  shouldForwardProp: (prop) =>
    [
      "width",
      "height",
      "src",
      "alt",
      "fill",
      "loader",
      "quality",
      "priority",
      "loading",
      "placeholder",
      "blurDataURL",
      "unoptimized",
      "onLoad",
      "sizes",
    ].includes(prop),
});

export type ChakraNextImageProps = React.ComponentProps<typeof ChakraNextImage>;

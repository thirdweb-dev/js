import {
  Box,
  BoxProps,
  ImageProps as ChakraImageProps,
  chakra,
} from "@chakra-ui/react";
import NextImage, { ImageProps } from "next/image";
import { useMemo } from "react";
import useDimensions from "react-cool-dimensions";
import { isBrowser } from "utils/isBrowser";

const ChakraNextUnwrappedImage = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    [
      "width",
      "height",
      "src",
      "alt",
      "quality",
      "placeholder",
      "blurDataURL",
      "loader ",
      "layout",
      "sizes",
      "onLoadingComplete",
      "priority",
    ].includes(prop),
});

const previousLoadedImagesSet = new Set<string>();

export type ChakraNextImageProps = ImageProps &
  Omit<BoxProps, "width" | "height"> & {
    alt: string;
    imgProps?: Omit<ChakraImageProps, "placeholder">;
  };

export const ChakraNextImage = (props: ChakraNextImageProps) => {
  const {
    src,
    alt,
    width,
    quality = 90,
    height,
    layout = "responsive",
    objectFit,
    objectPosition,
    placeholder = typeof src === "string" ? "empty" : "blur",
    imgProps,
    priority,
    sizes,
    ...rest
  } = props;
  const { observe, width: _width } = useDimensions<HTMLDivElement | null>();
  const imageId = useMemo(() => {
    const _src: string =
      typeof src === "string"
        ? src
        : (src as any)?.default?.src || (src as any)?.src || "";
    return `${_src}_w=${_width}`;
  }, [_width, src]);

  const size =
    sizes ||
    (isBrowser() && _width !== undefined
      ? `${(_width / window.innerWidth) * 100}vw`
      : "100vw");
  return (
    <Box maxW="100%" pos="relative" {...rest} ref={observe}>
      <ChakraNextUnwrappedImage
        onLoadingComplete={() => {
          previousLoadedImagesSet.add(imageId);
        }}
        objectFit={objectFit}
        objectPosition={objectPosition}
        w="auto"
        h="auto"
        layout={layout}
        sizes={size}
        width={width}
        quality={quality}
        height={height}
        placeholder={placeholder}
        src={src}
        alt={alt}
        priority={priority}
        transition={
          previousLoadedImagesSet.has(imageId) ? undefined : "all 0.2s"
        }
        {...imgProps}
      />
    </Box>
  );
};

import type { ChakraNextImageProps } from "components/Image";
import type { StaticImageData } from "next/image";
import type { HeadingSizes } from "theme/typography";

export type LandingDesktopMobileImageProps = ChakraNextImageProps & {
  image?: StaticImageData;
  mobileImage?: StaticImageData;
  // biome-ignore lint/complexity/noBannedTypes: FIXME
  lottie?: {};
};

export interface LandingSectionHeadingProps {
  blackToWhiteTitle?: string;
  title: string;
  titleWithGradient?: string;
  gradient?: string;
  titleSize?: HeadingSizes;
  lineHeight?: string;
}

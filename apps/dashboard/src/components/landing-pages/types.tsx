import type { ChakraNextImageProps } from "components/Image";
import type { StaticImageData } from "next/image";
import type { HeadingSizes } from "theme/typography";

export type LandingDesktopMobileImageProps = ChakraNextImageProps & {
  image?: StaticImageData;
  mobileImage?: StaticImageData;
};

export interface LandingSectionHeadingProps {
  blackToWhiteTitle?: string;
  title: string;
  titleWithGradient?: string;
  gradient?: string;
  titleSize?: HeadingSizes;
  lineHeight?: string;
}

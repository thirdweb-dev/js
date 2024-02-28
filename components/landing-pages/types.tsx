import { ChakraNextImageProps } from "components/Image";
import { StaticImageData } from "next/image";
import { HeadingSizes } from "theme/typography";

export type LandingDesktopMobileImageProps = ChakraNextImageProps & {
  image?: StaticImageData;
  mobileImage?: StaticImageData;
  lottie?: {};
};

export interface LandingSectionHeadingProps {
  blackToWhiteTitle: string;
  title: string;
  titleWithGradient?: string;
  gradient?: string;
  titleSize?: HeadingSizes;
  lineHeight?: string;
}

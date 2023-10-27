import { ChakraNextImageProps } from "components/Image";
import { StaticImageData } from "next/image";

export type Guide = {
  title: string;
  description?: string;
  image: string;
  link: string;
};

export type LandingDesktopMobileImageProps = ChakraNextImageProps & {
  image?: StaticImageData;
  mobileImage?: StaticImageData;
  lottie?: {};
};

export interface LandingSectionHeadingProps {
  blackToWhiteTitle: string;
  title: string;
}

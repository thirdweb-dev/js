import { StaticImageData } from "next/image";

export type Guide = {
  title: string;
  description?: string;
  image: string;
  link: string;
};

export interface LandingDesktopMobileImageProps {
  image?: StaticImageData;
  mobileImage?: StaticImageData;
}

export interface LandingSectionHeadingProps {
  blackToWhiteTitle: string;
  title: string;
}

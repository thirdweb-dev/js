import { LandingDesktopMobileImageProps } from "./types";
import { ChakraNextImage } from "components/Image";

export const LandingDesktopMobileImage: React.FC<
  LandingDesktopMobileImageProps
> = ({ image, mobileImage, ...props }) => {
  return (
    <>
      {mobileImage && (
        <ChakraNextImage
          {...props}
          display={{ base: "block", md: "none" }}
          src={mobileImage}
          alt=""
        />
      )}
      {image && (
        <ChakraNextImage
          {...props}
          src={image}
          alt=""
          display={{ base: mobileImage ? "none" : "block", md: "block" }}
        />
      )}
    </>
  );
};

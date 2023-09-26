import { LandingDesktopMobileImageProps } from "./types";
import { ChakraNextImage } from "components/Image";

export const LandingDesktopMobileImage: React.FC<
  LandingDesktopMobileImageProps
> = ({ image, mobileImage }) => {
  return (
    <>
      {mobileImage && (
        <ChakraNextImage
          src={mobileImage}
          alt=""
          display={{ base: "block", md: "none" }}
        />
      )}
      {image && (
        <ChakraNextImage
          src={image}
          alt=""
          display={{ base: mobileImage ? "none" : "block", md: "block" }}
        />
      )}
    </>
  );
};

import { Box } from "@chakra-ui/react";
import { LandingDesktopMobileImageProps } from "./types";
import { ChakraNextImage } from "components/Image";

export const LandingDesktopMobileImage: React.FC<
  LandingDesktopMobileImageProps
> = ({ image, mobileImage, ...props }) => {
  return (
    <>
      {!props.video && mobileImage && (
        <ChakraNextImage
          {...props}
          display={{ base: "block", md: "none" }}
          src={mobileImage}
          alt=""
        />
      )}

      {!props.video && image && (
        <ChakraNextImage
          {...props}
          src={image}
          alt=""
          display={{ base: mobileImage ? "none" : "block", md: "block" }}
        />
      )}

      {props.video && (
        <Box
          as="video"
          loop
          playsInline
          preload="auto"
          width="550"
          height="400"
          autoPlay
          src={props.video}
          muted
          boxShadow="0 0 50px #0e0d0f"
          borderRadius="50px"
        />
      )}
    </>
  );
};

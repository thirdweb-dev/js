import { Box } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import Lottie from "lottie-react";
import type { LandingDesktopMobileImageProps } from "./types";

export const LandingDesktopMobileImage: React.FC<
  LandingDesktopMobileImageProps
> = ({ lottie, image, mobileImage, ...props }) => {
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
      {!lottie && image && (
        <ChakraNextImage
          {...props}
          src={image}
          alt=""
          display={{ base: mobileImage ? "none" : "block", md: "block" }}
        />
      )}
      {lottie && (
        <Box
          w="100%"
          h="100%"
          display={{ base: mobileImage ? "none" : "block", md: "block" }}
        >
          <Lottie
            animationData={lottie}
            style={{ height: "100%" }}
            loop={true}
          />
        </Box>
      )}
    </>
  );
};

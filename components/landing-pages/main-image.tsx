import { LandingDesktopMobileImage } from "./desktop-mobile-image";
import { LandingSectionHeading } from "./section-heading";
import {
  LandingDesktopMobileImageProps,
  LandingSectionHeadingProps,
} from "./types";
import { Flex } from "@chakra-ui/react";

type LandingMainImageProps = LandingSectionHeadingProps &
  LandingDesktopMobileImageProps;

export const LandingMainImage: React.FC<LandingMainImageProps> = ({
  image,
  mobileImage,
  blackToWhiteTitle,
  title,
}) => {
  return (
    <Flex flexDir="column" gap={20}>
      <LandingSectionHeading
        blackToWhiteTitle={blackToWhiteTitle}
        title={title}
      />
      <LandingDesktopMobileImage image={image} mobileImage={mobileImage} />
    </Flex>
  );
};

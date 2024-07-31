import { Flex, type FlexProps } from "@chakra-ui/react";
import type { StaticImageData } from "next/image";
import { Text } from "tw-components";
import { LandingDesktopMobileImage } from "./desktop-mobile-image";

type LandingImageSectionItemProps = {
  image: StaticImageData;
  mobileImage: StaticImageData;
  title: string;
  description: string;
  maxHeightImage?: FlexProps["maxHeight"];
} & FlexProps;

const LandingImageSectionItem = ({
  mobileImage,
  image,
  title,
  description,
  maxHeightImage,
  ...rest
}: LandingImageSectionItemProps) => {
  return (
    <Flex flexDir="column" gap={6}>
      <Flex
        alignItems="center"
        justifyContent="center"
        borderRadius="12px"
        background="#131418"
        minH={{ base: "auto", md: "333px" }}
        {...rest}
      >
        <LandingDesktopMobileImage
          image={image}
          mobileImage={mobileImage}
          w="100%"
          maxHeight={maxHeightImage}
          alt=""
        />
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Text size="body.xl" color="white" fontWeight="bold">
          {title}
        </Text>

        {description && <Text size="body.lg">{description}</Text>}
      </Flex>
    </Flex>
  );
};

export default LandingImageSectionItem;

import { Flex, type FlexProps } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Text } from "tw-components";

interface LandingIconSectionItemProps {
  icon: StaticImageData;
  title: string;
  bg?: FlexProps["bg"];
  description?: ReactNode;
  descriptionColor?: string;
  customDescription?: ReactNode;
  shouldShowNoBorder?: boolean;
  iconWidth?: string;
}

export const LandingIconSectionItem: React.FC<LandingIconSectionItemProps> = ({
  icon,
  title,
  bg,
  description,
  descriptionColor,
  customDescription,
  shouldShowNoBorder,
  iconWidth,
}) => {
  return (
    <Flex flexDir="column" gap={6}>
      <Flex
        p={3.5}
        {...(shouldShowNoBorder
          ? {}
          : {
              border: "2px solid",
              borderColor: "borderColor",
              borderRadius: "lg",
            })}
        w={iconWidth ?? 14}
        bg={bg}
      >
        <ChakraNextImage src={icon} width={iconWidth ?? "32px"} alt="" />
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Text size="body.xl" color="white" fontWeight="bold">
          {title}
        </Text>
        {customDescription && customDescription}
        {description && (
          <Text size="body.lg" color={descriptionColor}>
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

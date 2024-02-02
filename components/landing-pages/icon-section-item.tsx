import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Text } from "tw-components";

interface LandingIconSectionItemProps {
  icon: StaticImageData;
  title: string;
  description?: ReactNode;
  shouldShowNoBorder?: boolean;
  iconWidth?: string;
}

export const LandingIconSectionItem: React.FC<LandingIconSectionItemProps> = ({
  icon,
  title,
  description,
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
      >
        <ChakraNextImage src={icon} width={iconWidth ?? "32px"} alt="" />
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

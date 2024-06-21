import { Flex, type FlexProps, Icon } from "@chakra-ui/react";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import type { IconType } from "react-icons/lib";
import { Text, TrackedLink } from "tw-components";

export function SupportedPlatformLink(props: {
  platform: "React" | "React Native" | "Unity" | "TypeScript";
  href: string;
  noBorder?: boolean;
  size: "sm" | "md";
  trackingCategory: string;
  bg?: FlexProps["bg"];
}) {
  let icon: IconType = SiReact;
  if (props.platform === "Unity") {
    icon = SiUnity;
  } else if (props.platform === "TypeScript") {
    icon = SiTypescript;
  }

  return (
    <TrackedLink
      category={props.trackingCategory}
      label={`platform-${props.platform.replace(" ", "-").toLowerCase()}`}
      href={props.href}
      isExternal
      _hover={{
        textDecor: "none",
        color: "blue.500",
      }}
      role="group"
    >
      <Flex
        bg={props.bg}
        gap={props.size === "sm" ? 2 : 3}
        alignItems="center"
        border={props.noBorder ? undefined : "1px solid"}
        borderColor="borderColor"
        px={props.noBorder ? 0 : 2}
        py={1}
        borderRadius="md"
        _groupHover={{
          borderColor: "blue.500",
        }}
        transition="border-color 200ms ease"
      >
        <Icon
          as={icon}
          w={props.size === "sm" ? 4 : 5}
          h={props.size === "sm" ? 4 : 5}
          color="faded"
          _groupHover={{
            color: "blue.500",
          }}
          transition="color 200ms ease"
        />
        <Text
          fontWeight={500}
          color="heading"
          _groupHover={{
            color: "blue.500",
          }}
          fontSize={props.size === "sm" ? 12 : 14}
          transition="color 200ms ease"
        >
          {props.platform}
        </Text>
      </Flex>
    </TrackedLink>
  );
}

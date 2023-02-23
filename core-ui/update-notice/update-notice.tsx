import { Flex, Icon } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { SiJavascript } from "@react-icons/all-files/si/SiJavascript";
// import { SiGo } from "@react-icons/all-files/si/SiGo";
// import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiReact } from "@react-icons/all-files/si/SiReact";
// import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import type { IconType } from "react-icons";
import { Badge, Card, Heading, Text, TrackedLink } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

type SDKTypes = "react" | "typescript";

type Version = {
  sdk: SDKTypes;
  version: string;
};
const SDKTypeMap: Record<
  SDKTypes,
  { icon: IconType; ghUrl: string; color: `#${string}` }
> = {
  react: {
    icon: SiReact,
    color: "#61DBFB",
    ghUrl:
      "https://github.com/thirdweb-dev/js/releases/tag/%40thirdweb-dev%2Freact%40",
  },
  typescript: {
    icon: SiJavascript,
    color: "#f7df1e",
    ghUrl:
      "https://github.com/thirdweb-dev/js/releases/tag/%40thirdweb-dev%2Fsdk%40",
  },
  // go: {
  //   icon: SiGo,
  //   ghUrl: "go",
  // },
  // python: {
  //   icon: SiPython,
  //   ghUrl: "python",
  // },
  // unity: {
  //   icon: SiUnity,
  //   ghUrl: "unity",
  // },
};

interface UpdatenoticeProps {
  learnMoreHref: string;
  trackingLabel: string;
  versions?: Version[];
}

export const UpdateNotice: ComponentWithChildren<UpdatenoticeProps> = ({
  children,
  versions,
  trackingLabel,
  learnMoreHref,
}) => {
  return (
    <Flex
      as={Card}
      gap={{ base: 2, md: 4 }}
      p={4}
      borderRadius="lg"
      align={"center"}
      flexWrap="wrap"
      css={css`
        container-type: inline-size;
      `}
    >
      <Badge order={1} colorScheme="purple" variant="solid">
        NEW
      </Badge>
      <Text
        order={{ base: 3, md: 2 }}
        css={css`
          order: 3 !important;
          @container (min-width: 48em) {
            order: 2 !important;
          }
        `}
      >
        {children}{" "}
        <TrackedLink
          _light={{
            color: "blue.500",
            _hover: { color: "blue.600" },
            _active: { color: "blue.500" },
          }}
          _dark={{
            color: "blue.400",
            _hover: { color: "blue.400" },
            _active: { color: "blue.500" },
          }}
          fontWeight={600}
          category="update_notice"
          label={trackingLabel}
          href={learnMoreHref}
          isExternal={learnMoreHref.startsWith("http")}
        >
          Learn more ↗
        </TrackedLink>
      </Text>

      {versions && (
        <Flex
          maxW="66%"
          flexWrap="wrap"
          ml="auto"
          order={{ base: 2, md: 3 }}
          gap={2}
          align="center"
          css={css`
            order: 2 !important;
            @container (min-width: 48em) {
              order: 3 !important;
            }
          `}
        >
          <Heading as="h4" size="label.sm">
            Requires:
          </Heading>
          {versions?.map((v) => (
            <TrackedLink
              isExternal
              href={SDKTypeMap[v.sdk].ghUrl + v.version}
              category="update_notice"
              label={`release_note_${v.sdk}`}
              key={v.sdk}
              role="group"
            >
              <Badge
                textTransform="none"
                borderWidth="1px"
                borderRadius="sm"
                variant="solid"
                _light={{
                  color: "#000",
                  bg: "transparent",
                  borderColor: "borderColor",
                }}
                _dark={{
                  color: "#fff",
                  bg: "transparent",
                  borderColor: "borderColor",
                }}
              >
                <Flex as="span" direction="row" align="center" gap={1.5}>
                  <Icon
                    _groupHover={{ fill: SDKTypeMap[v.sdk].color }}
                    borderRadius="sm"
                    as={SDKTypeMap[v.sdk].icon}
                  />
                  <span>{v.version}</span>
                </Flex>
              </Badge>
            </TrackedLink>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

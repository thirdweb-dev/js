import { Flex, Image, Tooltip, Icon } from "@chakra-ui/react";
import React from "react";
import { Text } from "tw-components";
import { replaceIpfsUrl } from "lib/sdk";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export function WalletButton(props: {
  name: string;
  subtitle?: string;
  icon: string;
  isChecked: boolean;
  onSelect: () => void;
  recommended?: boolean;
  onRecommendedClick?: () => void;
}) {
  const { isChecked, onSelect, name, icon, subtitle } = props;
  return (
    <Flex
      borderRadius="lg"
      border="1px solid transparent"
      bg={isChecked ? "hsl(215.88deg 100% 60% / 15%)" : "inputBg"}
      _hover={
        !isChecked
          ? {
              bg: "inputBg",
              borderColor: "borderColor",
            }
          : {
              borderColor: "blue.500",
            }
      }
      transition="background 100ms ease, border-color 100ms ease"
      alignItems="center"
      userSelect={"none"}
      pr={1}
      gap={1}
    >
      <Flex
        gap={3}
        alignItems="center"
        flexGrow={1}
        p={2}
        onClick={() => {
          onSelect();
        }}
        cursor="pointer"
      >
        <Image width={7} height={7} alt={name} src={replaceIpfsUrl(icon)} />

        <Flex
          flexDir="column"
          justifyContent="center"
          flexGrow={1}
          alignSelf="stretch"
        >
          <Text
            fontWeight={500}
            fontSize={14}
            color={isChecked || subtitle ? "heading" : "paragraph"}
          >
            {name}
          </Text>
          {subtitle && (
            <Text fontSize={12} color="faded">
              {subtitle}
            </Text>
          )}
        </Flex>
      </Flex>

      <Tooltip
        hasArrow
        label={props.recommended ? "Recommended" : "Not Recommended"}
        placement="top"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          onClick={props.onRecommendedClick}
          cursor="pointer"
          role="button"
          aria-label="Toggle Recommended"
        >
          <Icon
            as={props.recommended ? AiFillStar : AiOutlineStar}
            w={4}
            h={4}
            color={props.recommended ? "blue.500" : "faded"}
          />
        </Flex>
      </Tooltip>
    </Flex>
  );
}

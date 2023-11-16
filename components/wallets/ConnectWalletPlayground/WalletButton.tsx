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

      <RecommendedIconButton
        onClick={props.onRecommendedClick}
        isRecommended={props.recommended}
      />
    </Flex>
  );
}

export function RecommendedIconButton(props: {
  isRecommended?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip
      hasArrow
      label={props.isRecommended ? "Recommended" : "Not Recommended"}
      placement="top"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        onClick={props.onClick}
        cursor="pointer"
        role="button"
        aria-label="Toggle Recommended"
      >
        <Icon
          as={props.isRecommended ? AiFillStar : AiOutlineStar}
          w={4}
          h={4}
          color={props.isRecommended ? "blue.500" : "faded"}
        />
      </Flex>
    </Tooltip>
  );
}

export function SocialButton(props: {
  name: string;
  icon: "email" | "google" | "facebook" | "apple";
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <Flex
      borderRadius="lg"
      border="1px solid transparent"
      bg={props.isSelected ? "hsl(215.88deg 100% 60% / 15%)" : "inputBg"}
      _hover={
        !props.isSelected
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
        onClick={props.onClick}
        cursor="pointer"
      >
        <Image
          width={7}
          height={7}
          alt={props.name}
          src={socialIconMap[props.icon]}
        />

        <Text
          fontWeight={500}
          fontSize={14}
          color={props.isSelected ? "heading" : "paragraph"}
        >
          {props.name}
        </Text>
      </Flex>
    </Flex>
  );
}

export const googleIconUri =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MDUuNiIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxODYuNjkgMTkwLjUiIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTE4NC41ODMgNzY1LjE3MSkiPjxwYXRoIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIgZD0iTS0xMDg5LjMzMy02ODcuMjM5djM2Ljg4OGg1MS4yNjJjLTIuMjUxIDExLjg2My05LjAwNiAyMS45MDgtMTkuMTM3IDI4LjY2MmwzMC45MTMgMjMuOTg2YzE4LjAxMS0xNi42MjUgMjguNDAyLTQxLjA0NCAyOC40MDItNzAuMDUyIDAtNi43NTQtLjYwNi0xMy4yNDktMS43MzItMTkuNDgzeiIgZmlsbD0iIzQyODVmNCIvPjxwYXRoIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIgZD0iTS0xMTQyLjcxNC02NTEuNzkxbC02Ljk3MiA1LjMzNy0yNC42NzkgMTkuMjIzaDBjMTUuNjczIDMxLjA4NiA0Ny43OTYgNTIuNTYxIDg1LjAzIDUyLjU2MSAyNS43MTcgMCA0Ny4yNzgtOC40ODYgNjMuMDM4LTIzLjAzM2wtMzAuOTEzLTIzLjk4NmMtOC40ODYgNS43MTUtMTkuMzEgOS4xNzktMzIuMTI1IDkuMTc5LTI0Ljc2NSAwLTQ1LjgwNi0xNi43MTItNTMuMzQtMzkuMjI2eiIgZmlsbD0iIzM0YTg1MyIvPjxwYXRoIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIgZD0iTS0xMTc0LjM2NS03MTIuNjFjLTYuNDk0IDEyLjgxNS0xMC4yMTcgMjcuMjc2LTEwLjIxNyA0Mi42ODlzMy43MjMgMjkuODc0IDEwLjIxNyA0Mi42ODljMCAuMDg2IDMxLjY5My0yNC41OTIgMzEuNjkzLTI0LjU5Mi0xLjkwNS01LjcxNS0zLjAzMS0xMS43NzYtMy4wMzEtMTguMDk4czEuMTI2LTEyLjM4MyAzLjAzMS0xOC4wOTh6IiBmaWxsPSIjZmJiYzA1Ii8+PHBhdGggZD0iTS0xMDg5LjMzMy03MjcuMjQ0YzE0LjAyOCAwIDI2LjQ5NyA0Ljg0OSAzNi40NTUgMTQuMjAxbDI3LjI3Ni0yNy4yNzZjLTE2LjUzOS0xNS40MTMtMzguMDEzLTI0Ljg1Mi02My43MzEtMjQuODUyLTM3LjIzNCAwLTY5LjM1OSAyMS4zODgtODUuMDMyIDUyLjU2MWwzMS42OTIgMjQuNTkyYzcuNTMzLTIyLjUxNCAyOC41NzUtMzkuMjI2IDUzLjM0LTM5LjIyNnoiIGZpbGw9IiNlYTQzMzUiIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIvPjwvZz48L3N2Zz4=";
export const facebookIconUri =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iRWJlbmUgMSIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgaWQ9ImZhY2Vib29rLWxvZ28tMjAxOSI+PHBhdGggZmlsbD0iIzE4NzdmMiIgZD0iTTEwMjQsNTEyQzEwMjQsMjI5LjIzMDE2LDc5NC43Njk3OCwwLDUxMiwwUzAsMjI5LjIzMDE2LDAsNTEyYzAsMjU1LjU1NCwxODcuMjMxLDQ2Ny4zNzAxMiw0MzIsNTA1Ljc3Nzc3VjY2MEgzMDJWNTEySDQzMlYzOTkuMkM0MzIsMjcwLjg3OTgyLDUwOC40Mzg1NCwyMDAsNjI1LjM4OTIyLDIwMCw2ODEuNDA3NjUsMjAwLDc0MCwyMTAsNzQwLDIxMFYzMzZINjc1LjQzNzEzQzYxMS44MzUwOCwzMzYsNTkyLDM3NS40NjY2Nyw1OTIsNDE1Ljk1NzI4VjUxMkg3MzRMNzExLjMsNjYwSDU5MnYzNTcuNzc3NzdDODM2Ljc2OSw5NzkuMzcwMTIsMTAyNCw3NjcuNTU0LDEwMjQsNTEyWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik03MTEuMyw2NjAsNzM0LDUxMkg1OTJWNDE1Ljk1NzI4QzU5MiwzNzUuNDY2NjcsNjExLjgzNTA4LDMzNiw2NzUuNDM3MTMsMzM2SDc0MFYyMTBzLTU4LjU5MjM1LTEwLTExNC42MTA3OC0xMEM1MDguNDM4NTQsMjAwLDQzMiwyNzAuODc5ODIsNDMyLDM5OS4yVjUxMkgzMDJWNjYwSDQzMnYzNTcuNzc3NzdhNTE3LjM5NjE5LDUxNy4zOTYxOSwwLDAsMCwxNjAsMFY2NjBaIj48L3BhdGg+PC9zdmc+";
export const appleIconUri =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDM4IiBoZWlnaHQ9IjI1MDAiIHZpZXdCb3g9IjAgMCA0OTYuMjU1IDYwOC43MjgiIGlkPSJhcHBsZSI+PHBhdGggZmlsbD0iIzk5OSIgZD0iTTI3My44MSA1Mi45NzNDMzEzLjgwNi4yNTcgMzY5LjQxIDAgMzY5LjQxIDBzOC4yNzEgNDkuNTYyLTMxLjQ2MyA5Ny4zMDZjLTQyLjQyNiA1MC45OC05MC42NDkgNDIuNjM4LTkwLjY0OSA0Mi42MzhzLTkuMDU1LTQwLjA5NCAyNi41MTItODYuOTcxek0yNTIuMzg1IDE3NC42NjJjMjAuNTc2IDAgNTguNzY0LTI4LjI4NCAxMDguNDcxLTI4LjI4NCA4NS41NjIgMCAxMTkuMjIyIDYwLjg4MyAxMTkuMjIyIDYwLjg4M3MtNjUuODMzIDMzLjY1OS02NS44MzMgMTE1LjMzMWMwIDkyLjEzMyA4Mi4wMSAxMjMuODg1IDgyLjAxIDEyMy44ODVzLTU3LjMyOCAxNjEuMzU3LTEzNC43NjIgMTYxLjM1N2MtMzUuNTY1IDAtNjMuMjE1LTIzLjk2Ny0xMDAuNjg4LTIzLjk2Ny0zOC4xODggMC03Ni4wODQgMjQuODYxLTEwMC43NjYgMjQuODYxQzg5LjMzIDYwOC43MyAwIDQ1NS42NjYgMCAzMzIuNjI4YzAtMTIxLjA1MiA3NS42MTItMTg0LjU1NCAxNDYuNTMzLTE4NC41NTQgNDYuMTA1IDAgODEuODgzIDI2LjU4OCAxMDUuODUyIDI2LjU4OHoiPjwvcGF0aD48L3N2Zz4=";
export const emailIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzM1ODlfODY0OSkiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzU4OV84NjQ5KSIvPgo8cmVjdCB4PSItMSIgeT0iLTEiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjkuOCIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM1ODlfODY0OSkiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzM1ODlfODY0OSkiPgo8cGF0aCBkPSJNMjQgMTQuMjVDMTguNjE3MiAxNC4yNSAxNC4yNSAxOC42MTcyIDE0LjI1IDI0QzE0LjI1IDI5LjM4MjggMTguNjE3MiAzMy43NSAyNCAzMy43NUMyNC44OTg4IDMzLjc1IDI1LjYyNSAzNC40NzYyIDI1LjYyNSAzNS4zNzVDMjUuNjI1IDM2LjI3MzggMjQuODk4OCAzNyAyNCAzN0MxNi44MTk1IDM3IDExIDMxLjE4MDUgMTEgMjRDMTEgMTYuODE5NSAxNi44MTk1IDExIDI0IDExQzMxLjE4MDUgMTEgMzcgMTYuODE5NSAzNyAyNFYyNS42MjVDMzcgMjguMzE2NCAzNC44MTY0IDMwLjUgMzIuMTI1IDMwLjVDMzAuNjM3MSAzMC41IDI5LjMwMTYgMjkuODI5NyAyOC40MDc4IDI4Ljc3ODVDMjcuMjUgMjkuODQ0OSAyNS43MDEyIDMwLjUgMjQgMzAuNUMyMC40MDk4IDMwLjUgMTcuNSAyNy41OTAyIDE3LjUgMjRDMTcuNSAyMC40MDk4IDIwLjQwOTggMTcuNSAyNCAxNy41QzI1LjQxNjggMTcuNSAyNi43MjcgMTcuOTUyIDI3Ljc5MzQgMTguNzIzOEMyOC4wODI4IDE4LjQ2OTkgMjguNDU4NiAxOC4zMTI1IDI4Ljg3NSAxOC4zMTI1QzI5Ljc3MzggMTguMzEyNSAzMC41IDE5LjAzODcgMzAuNSAxOS45Mzc1VjI1LjYyNUMzMC41IDI2LjUyMzggMzEuMjI2MiAyNy4yNSAzMi4xMjUgMjcuMjVDMzMuMDIzOCAyNy4yNSAzMy43NSAyNi41MjM4IDMzLjc1IDI1LjYyNVYyNEMzMy43NSAxOC42MTcyIDI5LjM4MjggMTQuMjUgMjQgMTQuMjVaTTI3LjI1IDI0QzI3LjI1IDIzLjEzOCAyNi45MDc2IDIyLjMxMTQgMjYuMjk4MSAyMS43MDE5QzI1LjY4ODYgMjEuMDkyNCAyNC44NjIgMjAuNzUgMjQgMjAuNzVDMjMuMTM4IDIwLjc1IDIyLjMxMTQgMjEuMDkyNCAyMS43MDE5IDIxLjcwMTlDMjEuMDkyNCAyMi4zMTE0IDIwLjc1IDIzLjEzOCAyMC43NSAyNEMyMC43NSAyNC44NjIgMjEuMDkyNCAyNS42ODg2IDIxLjcwMTkgMjYuMjk4MUMyMi4zMTE0IDI2LjkwNzYgMjMuMTM4IDI3LjI1IDI0IDI3LjI1QzI0Ljg2MiAyNy4yNSAyNS42ODg2IDI2LjkwNzYgMjYuMjk4MSAyNi4yOTgxQzI2LjkwNzYgMjUuNjg4NiAyNy4yNSAyNC44NjIgMjcuMjUgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8zNTg5Xzg2NDkiIHgxPSIyNS41IiB5MT0iLTYuMjk1NzJlLTA2IiB4Mj0iMzAuMjAxNiIgeTI9IjQ3LjUzNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjODM1OEJBIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzdCMUNGNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMzU4OV84NjQ5IiB4MT0iMjUuNTYyNSIgeTE9Ii0xLjAwMDAxIiB4Mj0iMzAuNDYiIHkyPSI0OC41MTU2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4MzU4QkEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0IxQ0Y3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMzU4OV84NjQ5Ij4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPGNsaXBQYXRoIGlkPSJjbGlwMV8zNTg5Xzg2NDkiPgo8cmVjdCB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMSAxMSkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";

const socialIconMap = {
  email: emailIcon,
  google: googleIconUri,
  facebook: facebookIconUri,
  apple: appleIconUri,
};

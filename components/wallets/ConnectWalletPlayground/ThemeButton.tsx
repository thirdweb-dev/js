import { Tooltip } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { Button } from "tw-components";

export function ThemeButton(props: {
  theme: "light" | "dark";
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  trackingCategory: string;
}) {
  const trackEvent = useTrack();
  const bg = props.theme === "dark" ? "black" : "white";
  const borderColor = props.theme === "dark" ? "gray.800" : "gray.200";
  return (
    <Tooltip label={props.theme === "dark" ? "Dark" : "Light"}>
      <Button
        disabled={props.disabled}
        cursor={props.disabled ? "not-allowed" : "pointer"}
        w={10}
        h={10}
        borderRadius="50%"
        aria-label={props.theme}
        border="3px solid"
        bg={bg}
        _hover={{
          bg,
        }}
        borderColor={props.isSelected ? "blue.500" : borderColor}
        onClick={
          props.disabled
            ? undefined
            : () => {
                props.onClick();
                trackEvent({
                  category: props.trackingCategory,
                  label: "customize",
                  input: "theme",
                  action: "click",
                  theme: props.theme,
                });
              }
        }
      ></Button>
    </Tooltip>
  );
}

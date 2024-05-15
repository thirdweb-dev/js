"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledH2 } from "../design-system/elements.js";
import { fontSize, iconSize } from "../design-system/index.js";
import { IconButton } from "./buttons.js";

export const ModalTitle = /* @__PURE__ */ StyledH2(() => {
  const theme = useCustomTheme();
  return {
    margin: 0,
    fontWeight: 600,
    fontSize: fontSize.lg,
    color: theme.colors.primaryText,
    lineHeight: 1.3,
    textAlign: "left",
  };
});

/**
 * @internal
 */
export const BackButton: React.FC<{
  onClick: () => void;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <IconButton
      onClick={props.onClick}
      style={{ transform: "translateX(-25%)", ...props.style }}
      type="button"
    >
      <ChevronLeftIcon width={iconSize.md} height={iconSize.md} />
    </IconButton>
  );
};

"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { fontSize, iconSize } from "../../../core/design-system/index.js";
import { StyledH2 } from "../design-system/elements.js";
import { IconButton } from "./buttons.js";

export const ModalTitle = /* @__PURE__ */ StyledH2((_) => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.primaryText,
    fontSize: fontSize.lg,
    fontWeight: 600,
    lineHeight: 1.3,
    margin: 0,
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
      <ChevronLeftIcon height={iconSize.md} width={iconSize.md} />
    </IconButton>
  );
};

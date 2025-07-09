import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { StyledButton } from "../design-system/elements.js";

export const MenuButton = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      backgroundColor: theme.colors.tertiaryBg,
      svg: {
        color: theme.colors.accentText,
      },
    },
    "&[data-variant='danger']:hover svg": {
      color: `${theme.colors.danger}!important`,
    },
    "&[data-variant='primary']:hover svg": {
      color: `${theme.colors.primaryText}!important`,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    alignItems: "center",
    all: "unset",
    backgroundColor: "transparent",
    borderRadius: radius.md,
    // border: `1px solid ${theme.colors.borderColor}`,
    boxSizing: "border-box",
    color: theme.colors.secondaryText,
    cursor: "pointer",
    display: "flex",
    fontSize: fontSize.md,
    fontWeight: 500,
    gap: spacing.sm,
    lineHeight: 1.3,
    padding: `${spacing.sm} ${spacing.sm}`,
    svg: {
      color: theme.colors.secondaryText,
      transition: "color 200ms ease",
    },
    transition: "background-color 200ms ease, transform 200ms ease",
    WebkitTapHighlightColor: "transparent",
    width: "100%",
  };
});

export const MenuLink = /* @__PURE__ */ (() => MenuButton.withComponent("a"))();

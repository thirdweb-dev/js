"use client";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  type Theme,
  fontSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { StyledButton } from "../design-system/elements.js";

export type ButtonProps = {
  variant: "primary" | "secondary" | "link" | "accent" | "outline" | "ghost";
  unstyled?: boolean;
  fullWidth?: boolean;
  gap?: keyof typeof spacing;
  bg?: keyof Theme["colors"];
};

export const Button = /* @__PURE__ */ StyledButton((props: ButtonProps) => {
  const theme = useCustomTheme();
  if (props.unstyled) {
    return {};
  }
  return {
    all: "unset",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    padding: `${fontSize.sm} ${fontSize.sm}`,
    fontSize: fontSize.sm,
    fontWeight: 500,
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
    lineHeight: "normal",
    flexShrink: 0,
    transition: "border 200ms ease",
    gap: (props.gap && spacing[props.gap]) || 0,
    width: props.fullWidth ? "100%" : undefined,
    textAlign: "center",
    maxWidth: "100%",
    background: (() => {
      if (props.bg) {
        return theme.colors[props.bg];
      }
      switch (props.variant) {
        case "primary":
          return theme.colors.primaryButtonBg;
        case "accent":
          return theme.colors.accentButtonBg;
        case "secondary":
          return theme.colors.secondaryButtonBg;
        default:
          return "none";
      }
    })(),
    color: (() => {
      switch (props.variant) {
        case "primary":
          return theme.colors.primaryButtonText;
        case "accent":
          return theme.colors.accentButtonText;
        case "secondary":
          return theme.colors.secondaryButtonText;
        case "ghost":
        case "outline":
          return theme.colors.secondaryButtonText;
        case "link":
          return theme.colors.accentText;
        default:
          return theme.colors.primaryButtonText;
      }
    })(),
    "&:active": {
      transform: "translateY(1px)",
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    "&[data-disabled='true']": {
      background: theme.colors.tertiaryBg,
      color: theme.colors.secondaryText,
      borderColor: "transparent",
      boxShadow: "none",
      "&:hover": {
        borderColor: "transparent",
      },
    },
    ...(() => {
      if (props.variant === "outline") {
        return {
          border: `1px solid ${theme.colors.borderColor}`,
          "&:hover": {
            borderColor: theme.colors.accentText,
            transform: "scale(1.01)",
          },
          '&[aria-selected="true"]': {
            borderColor: theme.colors.accentText,
          },
        };
      }

      if (props.variant === "ghost") {
        return {
          border: "1px solid transparent",
          "&:hover": {
            borderColor: theme.colors.accentText,
            transform: "scale(1.01)",
          },
        };
      }

      if (props.variant === "accent") {
        return {
          "&:hover": {
            transform: "scale(1.01)",
          },
        };
      }

      if (props.variant === "secondary") {
        return {
          "&:hover": {
            background: theme.colors.secondaryButtonHoverBg,
            transform: "scale(1.01)",
          },
        };
      }

      if (props.variant === "link") {
        return {
          padding: 0,
          "&:hover": {
            color: theme.colors.primaryText,
            transform: "scale(1.01)",
          },
        };
      }

      return {};
    })(),
  };
});

export const ButtonLink = /* @__PURE__ */ (() => Button.withComponent("a"))();

export const IconButton = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    WebkitTapHighlightColor: "transparent",
    color: theme.colors.secondaryIconColor,
    padding: "2px",
    transition: "background 200ms ease, color 200ms ease",
    "&:hover": {
      background: theme.colors.secondaryIconHoverBg,
      color: theme.colors.secondaryIconHoverColor,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
  };
});

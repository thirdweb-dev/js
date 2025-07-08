"use client";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import { StyledButton } from "../design-system/elements.js";

type ButtonProps = {
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
    "&:active": {
      transform: "translateY(1px)",
    },
    "&[data-disabled='true']": {
      "&:hover": {
        borderColor: "transparent",
      },
      background: theme.colors.tertiaryBg,
      borderColor: "transparent",
      boxShadow: "none",
      color: theme.colors.secondaryText,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    alignItems: "center",
    all: "unset",
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
    borderRadius: radius.md,
    boxSizing: "border-box",
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
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    fontSize: fontSize.sm,
    fontWeight: 500,
    gap: (props.gap && spacing[props.gap]) || 0,
    justifyContent: "center",
    lineHeight: "normal",
    maxWidth: "100%",
    padding: `${fontSize.sm} ${fontSize.sm}`,
    textAlign: "center",
    transition: "border 200ms ease",
    WebkitTapHighlightColor: "transparent",
    width: props.fullWidth ? "100%" : undefined,
    ...(() => {
      if (props.variant === "outline") {
        return {
          "&:hover": {
            borderColor: theme.colors.accentText,
          },
          '&[aria-selected="true"]': {
            borderColor: theme.colors.accentText,
          },
          border: `1px solid ${theme.colors.borderColor}`,
        };
      }

      if (props.variant === "ghost") {
        return {
          "&:hover": {
            borderColor: theme.colors.accentText,
          },
          border: "1px solid transparent",
        };
      }

      if (props.variant === "accent") {
        return {
          "&:hover": {
            opacity: 0.8,
          },
        };
      }

      if (props.variant === "secondary") {
        return {
          "&:hover": {
            background: theme.colors.secondaryButtonHoverBg,
          },
        };
      }

      if (props.variant === "link") {
        return {
          "&:hover": {
            color: theme.colors.primaryText,
          },
          padding: 0,
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
    "&:hover": {
      background: theme.colors.secondaryIconHoverBg,
      color: theme.colors.secondaryIconHoverColor,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    alignItems: "center",
    all: "unset",
    borderRadius: radius.sm,
    color: theme.colors.secondaryIconColor,
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    padding: "2px",
    transition: "background 200ms ease, color 200ms ease",
    WebkitTapHighlightColor: "transparent",
  };
});

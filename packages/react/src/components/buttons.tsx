import { fontSize, radius, spacing, Theme } from "../design-system";
import { StyledButton } from "../design-system/elements";
import { useCustomTheme } from "../design-system/CustomThemeProvider";

type ButtonProps = {
  variant: "primary" | "secondary" | "link" | "accent" | "outline";
  theme?: Theme;
  fullWidth?: boolean;
  gap?: keyof typeof spacing;
};

export const Button = /* @__PURE__ */ StyledButton((props: ButtonProps) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    padding: `${fontSize.sm} ${fontSize.sm}`,
    fontSize: fontSize.md,
    fontWeight: 500,
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
    lineHeight: "normal",
    flexShrink: 0,
    transition: "border 200ms ease",
    gap: (props.gap && spacing[props.gap]) || 0,
    width: props.fullWidth ? "100%" : undefined,
    background: (() => {
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
    ...(() => {
      if (props.variant === "outline") {
        return {
          border: `1.5px solid ${theme.colors.borderColor}`,
          "&:hover": {
            borderColor: theme.colors.accentText,
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
          padding: 0,
          "&:hover": {
            color: theme.colors.primaryText,
          },
        };
      }
    })(),
  };
});

export const IconButton = /* @__PURE__ */ StyledButton(() => {
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
  };
});

export const InputButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    padding: spacing.sm,
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    color: theme.colors.secondaryText,
    "&:hover": {
      color: theme.colors.primaryText,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
  };
});

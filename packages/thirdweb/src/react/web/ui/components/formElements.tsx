"use client";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import {
  StyledDiv,
  StyledInput,
  StyledLabel,
} from "../design-system/elements.js";

type LabelProps = {
  color?: keyof Theme["colors"];
};

export const Label = /* @__PURE__ */ StyledLabel((props: LabelProps) => {
  const theme = useCustomTheme();
  return {
    color: theme.colors[props.color || "primaryText"],
    display: "block",
    fontSize: fontSize.sm,
    fontWeight: 500,
  };
});

type InputProps = {
  variant: "outline" | "transparent";
  sm?: boolean;
  theme?: Theme;
};

export const Input = /* @__PURE__ */ StyledInput<InputProps>((props) => {
  const theme = useCustomTheme();
  return {
    "&:-webkit-autofill": {
      boxShadow: `0 0 0px 1000px ${theme.colors.inputAutofillBg} inset !important`,
      transition: "background-color 5000s ease-in-out 0s",
      WebkitBoxShadow: `0 0 0px 1000px ${theme.colors.inputAutofillBg} inset !important`,
      WebkitTextFillColor: theme.colors.primaryText,
    },
    "&:-webkit-autofill:focus": {
      boxShadow: `0 0 0px 1000px ${
        theme.colors.inputAutofillBg
      } inset, 0 0 0 2px ${
        props.variant === "outline" ? theme.colors.accentText : "transparent"
      } !important`,
      WebkitBoxShadow: `0 0 0px 1000px ${
        theme.colors.inputAutofillBg
      } inset, 0 0 0 2px ${
        props.variant === "outline" ? theme.colors.accentText : "transparent"
      } !important`,
    },
    "&::placeholder": {
      color: theme.colors.secondaryText,
    },
    "&:focus": {
      boxShadow: `0 0 0 2px ${theme.colors.accentText}`,
    },
    "&:not([type='password'])": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    "&[data-error='true']": {
      boxShadow: `0 0 0 2px ${theme.colors.danger} !important`,
    },
    "&[data-focus='false']:focus": {
      boxShadow: "none",
    },
    "&[data-placeholder='true']": {
      color: theme.colors.secondaryText,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    "&[type='number']": {
      appearance: "none",
      MozAppearance: "textfield",
    },
    "&[type='number']::-webkit-outer-spin-button, &[type='number']::-webkit-inner-spin-button":
      {
        margin: 0,
        WebkitAppearance: "none",
      },
    appearance: "none",
    background: "transparent",
    border: "none",
    borderRadius: radius.md,
    boxShadow: `0 0 0 1.5px ${
      props.variant === "outline" ? theme.colors.borderColor : "transparent"
    }`,
    boxSizing: "border-box",
    color: theme.colors.primaryText,
    display: "block",
    fontFamily: "inherit",
    fontSize: fontSize.md,
    outline: "none",
    padding: props.sm ? spacing.sm : fontSize.sm,
    WebkitAppearance: "none",
    width: "100%",
  };
});

// for rendering a input and a button side by side
export const InputContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    "&:focus-within": {
      boxShadow: `0 0 0px 1px ${theme.colors.accentText}`,
    },
    // show error ring on container instead of input
    "&[data-error='true']": {
      boxShadow: `0 0 0px 1px ${theme.colors.danger}`,
    },
    borderRadius: radius.md,
    boxShadow: `0 0 0px 1px ${theme.colors.borderColor}`,
    display: "flex",
    "input:focus": {
      boxShadow: "none",
    },
  };
});

import { fontSize, radius, Theme, spacing } from "../design-system";
import { StyledDiv, StyledInput, StyledLabel } from "../design-system/elements";
import { useCustomTheme } from "../design-system/CustomThemeProvider";

type LabelProps = {
  color?: keyof Theme["colors"];
};

export const Label = /* @__PURE__ */ StyledLabel((props: LabelProps) => {
  const theme = useCustomTheme();
  return {
    fontSize: fontSize.sm,
    color: theme.colors[props.color || "primaryText"],
    display: "block",
    fontWeight: 500,
  };
});

type InputProps = {
  variant: "outline" | "transparent";
  sm?: boolean;
  theme?: Theme;
};

export const Input = /* @__PURE__ */ StyledInput((props: InputProps) => {
  const theme = useCustomTheme();
  return {
    fontSize: fontSize.md,
    display: "block",
    padding: props.sm ? spacing.sm : fontSize.sm,
    boxSizing: "border-box",
    width: "100%",
    outline: "none",
    border: "none",
    borderRadius: "6px",
    color: theme.colors.primaryText,
    WebkitAppearance: "none",
    appearance: "none",
    background: "transparent",
    "&::placeholder": {
      color: theme.colors.secondaryText,
    },
    boxShadow: `0 0 0 1.5px ${
      props.variant === "outline" ? theme.colors.borderColor : "transparent"
    }`,
    "&:-webkit-autofill": {
      WebkitTextFillColor: theme.colors.primaryText,
      WebkitBoxShadow: `0 0 0px 1000px ${theme.colors.inputAutofillBg} inset !important`,
      boxShadow: `0 0 0px 1000px ${theme.colors.inputAutofillBg} inset !important`,
      transition: "background-color 5000s ease-in-out 0s",
    },
    "&:-webkit-autofill:focus": {
      WebkitBoxShadow: `0 0 0px 1000px ${theme.colors.inputAutofillBg} inset, 0 0 0 2px ${theme.colors.accentText} !important`,
      boxShadow: `0 0 0px 1000px ${theme.colors.inputAutofillBg} inset, 0 0 0 2px ${theme.colors.accentText} !important`,
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
    "&[disabled]": {
      cursor: "not-allowed",
    },
    "&[type='number']::-webkit-outer-spin-button, &[type='number']::-webkit-inner-spin-button":
      {
        WebkitAppearance: "none",
        margin: 0,
      },
    "&[type='number']": {
      appearance: "none",
      MozAppearance: "textfield",
    },
  };
});

// for rendering a input and a button side by side
export const InputContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    borderRadius: radius.sm,
    boxShadow: `0 0 0px 1.5px ${theme.colors.borderColor}`,
    "&:focus-within": {
      boxShadow: `0 0 0px 2px ${theme.colors.accentText}`,
    },
    "input:focus": {
      boxShadow: "none",
    },
    // show error ring on container instead of input
    "&[data-error='true']": {
      boxShadow: `0 0 0px 2px ${theme.colors.danger}`,
    },
  };
});

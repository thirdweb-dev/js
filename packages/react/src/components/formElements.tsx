import { fontSize, radius, spacing, Theme } from "../design-system";
import styled from "@emotion/styled";

export const Label = styled.label<{
  theme?: Theme;
  color?: keyof Theme["colors"];
}>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.colors[p.color || "primaryText"]};
  display: block;
`;

export const Input = styled.input<{
  variant: "outline" | "transparent";
  theme?: Theme;
}>`
  font-size: ${fontSize.md};
  display: block;
  padding: ${fontSize.sm};
  box-sizing: border-box;
  width: 100%;
  outline: none;
  border: none;
  border-radius: 6px;
  color: ${(p) => p.theme.colors.primaryText};
  -webkit-appearance: none;
  appearance: none;
  background: transparent;

  &::placeholder {
    color: ${(p) => p.theme.colors.secondaryText};
  }

  box-shadow: 0 0 0 1.5px
    ${(p) => {
      switch (p.variant) {
        case "outline":
          return p.theme.colors.borderColor;
        default:
          return "transparent";
      }
    }};

  /* when browser auto-fills the input  */
  &:-webkit-autofill {
    -webkit-text-fill-color: ${(p) => p.theme.colors.primaryText};
    -webkit-box-shadow: 0 0 0px 1000px ${(p) => p.theme.colors.inputAutofillBg}
      inset !important;
    box-shadow: 0 0 0px 1000px ${(p) => p.theme.colors.inputAutofillBg} inset !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  &:-webkit-autofill:focus {
    -webkit-box-shadow:
      0 0 0px 1000px ${(p) => p.theme.colors.inputAutofillBg} inset,
      0 0 0 2px ${(p) => p.theme.colors.accentText} !important;
    box-shadow:
      0 0 0px 1000px ${(p) => p.theme.colors.inputAutofillBg} inset,
      0 0 0 2px ${(p) => p.theme.colors.accentText} !important;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.colors.accentText};
  }

  /* show overflow ellipsis for long text - but not if it's a type="password"  */
  &:not([type="password"]) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &[data-error="true"] {
    box-shadow: 0 0 0 2px ${(p) => p.theme.colors.danger} !important;
  }

  &[disabled] {
    cursor: not-allowed;
  }

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    appearance: none;
    -moz-appearance: textfield;
  }
`;

// for rendering a input and a button side by side
export const InputContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  border-radius: ${radius.sm};
  box-shadow: 0 0 0px 1.5px ${(p) => p.theme.colors.borderColor};

  /* show focus ring on container instead of input  */
  &:focus-within {
    box-shadow: 0 0 0px 2px ${(p) => p.theme.colors.accentText};
  }

  input:focus {
    box-shadow: none;
  }

  /* show error ring on container instead of input  */
  &[data-error="true"] {
    box-shadow: 0 0 0px 2px ${(p) => p.theme.colors.danger};
  }
`;

export const ErrorMessage = styled.p<{ theme?: Theme }>`
  all: unset;
  font-size: ${fontSize.sm};
  display: block;
  color: ${(p) => p.theme.colors.danger};
  line-height: 1;
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.sm};
`;

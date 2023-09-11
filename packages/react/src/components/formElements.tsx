import { fontSize, radius, spacing, Theme } from "../design-system";
import styled from "@emotion/styled";

export const Label = styled.label<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.text.neutral};
  display: block;
`;

export const Input = styled.input<{
  variant: "outline" | "transparent" | "secondary";
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
  color: ${(p) => p.theme.text.neutral};
  -webkit-appearance: none;
  appearance: none;
  background: ${(p) => {
    switch (p.variant) {
      case "secondary":
        return p.theme.bg.elevated;
      default:
        return "transparent";
    }
  }};

  &::placeholder {
    color: ${(p) => p.theme.text.secondary};
  }

  box-shadow: 0 0 0 1.5px
    ${(p) => {
      switch (p.variant) {
        case "outline":
          return p.theme.input.outline;
        case "transparent":
          return "transparent";
        case "secondary":
          return p.theme.bg.elevatedHover;
      }
    }};

  /* when browser auto-fills the input  */
  &:-webkit-autofill {
    -webkit-text-fill-color: ${(p) => p.theme.text.neutral};
    -webkit-box-shadow: 0 0 0px 1000px ${(p) => p.theme.bg.elevated} inset !important;
    box-shadow: 0 0 0px 1000px ${(p) => p.theme.bg.elevated} inset !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  &:-webkit-autofill:focus {
    -webkit-box-shadow:
      0 0 0px 1000px ${(p) => p.theme.bg.elevated} inset,
      0 0 0 2px ${(p) => p.theme.input.focusRing} !important;
    box-shadow:
      0 0 0px 1000px ${(p) => p.theme.bg.elevated} inset,
      0 0 0 2px ${(p) => p.theme.input.focusRing} !important;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.input.focusRing};
  }

  /* show overflow ellipsis for long text - but not if it's a type="password"  */
  &:not([type="password"]) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &[data-error="true"] {
    box-shadow: 0 0 0 2px ${(p) => p.theme.input.errorRing} !important;
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
  box-shadow: 0 0 0px 1.5px ${(p) => p.theme.input.outline};

  /* show focus ring on container instead of input  */
  &:focus-within {
    box-shadow: 0 0 0px 2px ${(p) => p.theme.input.focusRing};
  }

  input:focus {
    box-shadow: none;
  }

  /* show error ring on container instead of input  */
  &[data-error="true"] {
    box-shadow: 0 0 0px 2px ${(p) => p.theme.input.errorRing};
  }
`;

export const ErrorMessage = styled.p<{ theme?: Theme }>`
  all: unset;
  font-size: ${fontSize.sm};
  display: block;
  color: ${(p) => p.theme.input.errorRing};
  line-height: 1;
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.sm};
`;

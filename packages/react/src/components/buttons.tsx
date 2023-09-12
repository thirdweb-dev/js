import { fontSize, radius, spacing, Theme } from "../design-system";
import styled from "@emotion/styled";

export const Button = styled.button<{
  variant: "inverted" | "secondary" | "link" | "danger" | "accent" | "outline";
  theme?: Theme;
  fullWidth?: boolean;
}>`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md};
  padding: ${fontSize.sm} ${fontSize.sm};
  font-size: ${fontSize.md};
  font-weight: ${(p) => (p.variant === "link" ? 400 : 500)};
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  line-height: 1;
  flex-shrink: 0;

  ${(p) => p.fullWidth && `width: 100%;`};

  background: ${(p) => {
    switch (p.variant) {
      case "inverted":
        return p.theme.colors.primaryText;
      case "accent":
        return p.theme.colors.accentBg;
      case "secondary":
        return p.theme.colors.base3;
      default:
        return "none";
    }
  }};

  &:hover {
    ${(p) => {
      if (p.variant === "secondary") {
        return `
      background: ${p.theme.colors.base3};
      `;
      }
    }}
  }

  color: ${(p) => {
    switch (p.variant) {
      case "inverted":
        return p.theme.colors.base1;
      case "accent":
        return p.theme.colors.textOnAccentBg;
      case "secondary":
        return p.theme.colors.primaryText;
      case "link":
        return p.theme.colors.accentText;
      case "danger":
        return p.theme.colors.danger;
      default:
        return p.theme.colors.primaryText;
    }
  }};

  ${(p) => {
    if (p.variant === "outline") {
      return `
      border: 1.5px solid ${p.theme.colors.base4};
      &:hover {
        border-color: ${p.theme.colors.primaryText};
      }
    `;
    }
  }}

  ${(p) => {
    if (p.variant === "link") {
      return `
      padding: 0;
      &:hover {
        color: ${p.theme.colors.primaryText};
      }`;
    }
  }}

  cursor: pointer;

  /* pressed effect */
  &:active {
    transform: translateY(1px);
  }

  &[disabled] {
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button<{
  variant: "neutral" | "secondary";
  theme?: Theme;
}>`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.sm};
  -webkit-tap-highlight-color: transparent;
  color: ${(p) => {
    switch (p.variant) {
      case "neutral":
        return p.theme.colors.primaryText;
      case "secondary":
        return p.theme.colors.secondaryText;
    }
  }};
  padding: 2px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  &:hover {
    background: ${(p) => p.theme.colors.base3};
    color: ${(p) => p.theme.colors.primaryText};
  }
`;

export const InputButton = styled.button<{ theme?: Theme }>`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.sm};
  padding: ${spacing.sm};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: ${(p) => p.theme.colors.secondaryText};
  &:hover {
    color: ${(p) => p.theme.colors.primaryText};
  }
  &[disabled] {
    cursor: not-allowed;
  }
`;

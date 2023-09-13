import { fontSize, radius, spacing, Theme } from "../design-system";
import styled from "@emotion/styled";

export const Button = styled.button<{
  variant: "primary" | "secondary" | "link" | "accent" | "outline";
  theme?: Theme;
  fullWidth?: boolean;
}>`
  all: unset;
  cursor: pointer;
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
      case "primary":
        return p.theme.colors.primaryButtonBg;
      case "accent":
        return p.theme.colors.accentButtonBg;
      case "secondary":
        return p.theme.colors.secondaryButtonBg;
      default:
        return "none";
    }
  }};

  color: ${(p) => {
    switch (p.variant) {
      case "primary":
        return p.theme.colors.primaryButtonText;
      case "accent":
        return p.theme.colors.accentButtonText;
      case "secondary":
        return p.theme.colors.secondaryButtonText;
      case "outline":
        return p.theme.colors.secondaryButtonText;
      case "link":
        return p.theme.colors.accentText;
      default:
        return p.theme.colors.primaryButtonText;
    }
  }};

  ${(p) => {
    if (p.variant === "outline") {
      return `
      border: 1.5px solid ${p.theme.colors.borderColor};
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

  /* pressed effect */
  &:active {
    transform: translateY(1px);
  }

  &[disabled] {
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button<{
  theme?: Theme;
}>`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.sm};
  -webkit-tap-highlight-color: transparent;
  color: ${(p) => p.theme.colors.secondaryIconColor};
  padding: 2px;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${(p) => p.theme.colors.secondaryIconHoverBg};
    color: ${(p) => p.theme.colors.secondaryIconHoverColor};
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

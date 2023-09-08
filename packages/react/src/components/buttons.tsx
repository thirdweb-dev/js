import { fontSize, radius, spacing, Theme } from "../design-system";
import styled from "@emotion/styled";

// for rendering a conventional button
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
        return p.theme.bg.inverted;
      case "accent":
        return p.theme.btn.accent.bg;
      case "secondary":
        return p.theme.bg.elevated;
      default:
        return "none";
    }
  }};

  &:hover {
    ${(p) => {
      if (p.variant === "secondary") {
        return `
      background: ${p.theme.bg.elevatedHover};
      `;
      }
    }}
  }

  color: ${(p) => {
    switch (p.variant) {
      case "inverted":
        return p.theme.text.inverted;
      case "accent":
        return p.theme.btn.accent.color;
      case "secondary":
        return p.theme.text.neutral;
      case "link":
        return p.theme.bg.accent;
      case "danger":
        return p.theme.text.danger;
      default:
        return p.theme.text.neutral;
    }
  }};

  ${(p) => {
    if (p.variant === "outline") {
      return `
      border: 1px solid ${p.theme.bg.elevatedHover};
      &:hover {
        border-color: ${p.theme.bg.inverted};
      }
    `;
    }
  }}

  ${(p) => {
    if (p.variant === "link") {
      return `
      padding: 0;
      &:hover {
        color: ${p.theme.text.neutral};
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

// for rendering a button with an icon
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
        return p.theme.text.neutral;
      case "secondary":
        return p.theme.text.secondary;
    }
  }};
  padding: 2px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  &:hover {
    background: ${(p) => p.theme.bg.elevated};
    color: ${(p) => p.theme.text.neutral};
  }
`;

// for rendering a button next to input
export const InputButton = styled.button<{ theme?: Theme }>`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.sm};
  padding: ${spacing.sm};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: ${(p) => p.theme.text.secondary};
  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }
  &[disabled] {
    cursor: not-allowed;
  }
`;

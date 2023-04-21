import { fontSize, radius, spacing, Theme } from "../design-system";
import styled from "@emotion/styled";

// for rendering a conventional button
export const Button = styled.button<{
  variant: "inverted" | "secondary" | "link" | "danger";
  theme?: Theme;
}>`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md};
  padding: ${spacing.sm} ${spacing.sm};
  font-size: ${fontSize.md};
  font-weight: 500;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  line-height: 1;
  flex-shrink: 0;

  &:focus {
    box-shadow: 0 0 0 3px
      ${(p) => {
        switch (p.variant) {
          case "inverted":
            return p.theme.bg.invertedFocused;
          case "secondary":
            return p.theme.bg.highlighted;
          case "link":
            return "none";
          case "danger":
            return p.theme.text.danger;
        }
      }};
  }

  box-shadow: ${(p) => {
    switch (p.variant) {
      case "danger":
        return `0 0 0 2px ${p.theme.text.danger}`;
      case "link":
        return "none";
      default:
        return "none";
    }
  }};

  background: ${(p) => {
    switch (p.variant) {
      case "inverted":
        return p.theme.bg.inverted;
      case "secondary":
        return p.theme.bg.elevated;
      case "link":
        return "transparent";
      case "danger":
        return "none";
    }
  }};
  color: ${(p) => {
    switch (p.variant) {
      case "inverted":
        return p.theme.text.inverted;
      case "secondary":
        return p.theme.text.neutral;
      case "link":
        return p.theme.link.primary;
      case "danger":
        return p.theme.text.danger;
    }
  }};
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
  transition: background 0.2s ease, color 0.2s ease;
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
`;

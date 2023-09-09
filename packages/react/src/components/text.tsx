import styled from "@emotion/styled";
import { fontSize, Theme } from "../design-system";

export const Text = styled.span<{
  theme?: Theme;
  color?: keyof Theme["text"];
  center?: boolean;
  inline?: boolean;
  size?: keyof typeof fontSize;
  weight?: 400 | 500 | 600 | 700;
  multiline?: boolean;
}>`
  font-size: ${(p) => fontSize[p.size || "md"]};
  color: ${(p) => p.theme.text[p.color || "secondary"]};
  margin: 0;
  display: ${(p) => (p.inline ? "inline" : "block")};
  font-weight: ${(p) => p.weight || 400};
  line-height: ${(p) => (p.multiline ? 1.5 : 1)};
  ${(p) => (p.center ? `text-align: center;` : "")};
`;

export const Link = styled.a<{
  theme?: Theme;
  small?: boolean;
  secondary?: boolean;
  inline?: boolean;
  center?: boolean;
}>`
  all: unset;
  cursor: pointer;
  color: ${(p) => (p.secondary ? p.theme.text.secondary : p.theme.text.accent)};
  font-size: ${(p) => (p.small ? fontSize.sm : fontSize.md)};
  text-decoration: none;
  text-align: ${(p) => (p.center ? "center" : "left")};
  display: ${(p) => (p.inline ? "inline" : "block")};
  line-height: 1;

  &:hover {
    color: ${(p) => p.theme.text.neutral};
    text-decoration: none;
  }
`;

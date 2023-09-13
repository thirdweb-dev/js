import styled from "@emotion/styled";
import { fontSize, Theme } from "../design-system";

export const Text = styled.span<{
  theme?: Theme;
  color?: keyof Theme["colors"];
  center?: boolean;
  inline?: boolean;
  size?: keyof typeof fontSize;
  weight?: 400 | 500 | 600 | 700;
  multiline?: boolean;
  balance?: boolean;
}>`
  font-size: ${(p) => fontSize[p.size || "md"]};
  color: ${(p) => p.theme.colors[p.color || "secondaryText"]};
  margin: 0;
  display: ${(p) => (p.inline ? "inline" : "block")};
  font-weight: ${(p) => p.weight || 400};
  line-height: ${(p) => (p.multiline ? 1.5 : 1)};
  ${(p) => (p.center ? `text-align: center;` : "")};
  text-wrap: ${(p) => (p.balance ? "balance" : "auto")};
`;

export const Link = styled.a<{
  theme?: Theme;
  size?: keyof typeof fontSize;
  secondary?: boolean;
  weight?: 400 | 500 | 600 | 700;
  inline?: boolean;
  center?: boolean;
}>`
  all: unset;
  cursor: pointer;
  color: ${(p) =>
    p.secondary ? p.theme.colors.secondaryText : p.theme.colors.accentText};
  font-size: ${(p) => fontSize[p.size || "md"]};
  text-decoration: none;
  text-align: ${(p) => (p.center ? "center" : "left")};
  display: ${(p) => (p.inline ? "inline" : "block")};
  font-weight: ${(p) => p.weight || 400};
  line-height: 1;

  &:hover {
    color: ${(p) => p.theme.colors.primaryText};
    text-decoration: none;
  }
`;

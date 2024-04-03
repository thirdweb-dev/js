import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledSpan, StyledAnchor } from "../design-system/elements.js";
import { fontSize, type Theme } from "../design-system/index.js";

type TextProps = {
  theme?: Theme;
  color?: keyof Theme["colors"];
  center?: boolean;
  inline?: boolean;
  size?: keyof typeof fontSize;
  weight?: 400 | 500 | 600 | 700;
  multiline?: boolean;
  balance?: boolean;
};

export const Text = /* @__PURE__ */ StyledSpan((p: TextProps) => {
  const theme = useCustomTheme();
  return {
    fontSize: fontSize[p.size || "md"],
    color: theme.colors[p.color || "secondaryText"],
    margin: 0,
    display: p.inline ? "inline" : "block",
    fontWeight: p.weight || 500,
    lineHeight: p.multiline ? 1.5 : "normal",
    textAlign: p.center ? "center" : "left",
    textWrap: p.balance ? "balance" : "inherit",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
});

type LinkProps = {
  theme?: Theme;
  size?: keyof typeof fontSize;
  weight?: 400 | 500 | 600 | 700;
  inline?: boolean;
  center?: boolean;
  color?: keyof Theme["colors"];
  hoverColor?: keyof Theme["colors"];
};

export const Link = /* @__PURE__ */ StyledAnchor((p: LinkProps) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    cursor: "pointer",
    color: theme.colors[p.color || "accentText"],
    fontSize: fontSize[p.size || "md"],
    textDecoration: "none",
    textAlign: p.center ? "center" : "left",
    display: p.inline ? "inline" : "block",
    fontWeight: p.weight || 500,
    lineHeight: "normal",
    transition: "color 0.2s ease",
    "&:hover": {
      color: theme.colors[p.hoverColor || "primaryText"],
      textDecoration: "none",
    },
  };
});

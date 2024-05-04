"use client";
import { useCustomTheme } from "../../ui/design-system/CustomThemeProvider.js";
import { StyledButton } from "../../ui/design-system/elements.js";
import { fontSize } from "../../ui/design-system/index.js";

export const LinkButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    color: theme.colors.accentText,
    fontSize: fontSize.sm,
    cursor: "pointer",
    textAlign: "center",
    fontWeight: 500,
    width: "100%",
    "&:hover": {
      color: theme.colors.primaryText,
    },
  };
});

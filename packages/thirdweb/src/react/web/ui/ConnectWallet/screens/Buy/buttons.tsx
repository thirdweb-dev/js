import styled from "@emotion/styled";
import { Button } from "../../../components/buttons.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../design-system/index.js";

export const FeesButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: "transparent",
    border: "1px solid transparent",
    "&:hover": {
      background: "transparent",
      borderColor: theme.colors.accentText,
    },
    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.xs,
    padding: spacing.sm,
    color: theme.colors.primaryText,
    borderRadius: radius.md,
  };
});

export const SecondaryButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    "&:hover": {
      background: theme.colors.tertiaryBg,
      borderColor: theme.colors.accentText,
    },
    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
  };
});

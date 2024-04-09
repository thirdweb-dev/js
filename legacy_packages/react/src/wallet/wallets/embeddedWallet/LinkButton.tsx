import { fontSize } from "../../../design-system";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { StyledButton } from "../../../design-system/elements";

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

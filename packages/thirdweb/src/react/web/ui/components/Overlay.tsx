"use client";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";

export const Overlay = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    animation: `${fadeInAnimation} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
    backdropFilter: "blur(10px)",
    backgroundColor: theme.colors.modalOverlayBg,
    inset: 0,
    position: "fixed",
    zIndex: 9999,
  };
});

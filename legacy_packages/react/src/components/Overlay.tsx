import { keyframes } from "@emotion/react";
import { StyledDiv } from "../design-system/elements";
import { useCustomTheme } from "../design-system/CustomThemeProvider";

const overlayEnter = keyframes`
 from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Overlay = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    backgroundColor: theme.colors.modalOverlayBg,
    zIndex: 9999,
    position: "fixed",
    inset: 0,
    animation: `${overlayEnter} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
    backdropFilter: "blur(10px)",
  };
});

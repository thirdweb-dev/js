import type { Theme } from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const overlayEnter = keyframes`
 from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Overlay = styled.div<{ theme?: Theme }>`
  background-color: ${(p) => p.theme.colors.overlay};
  z-index: 9999;
  position: fixed;
  inset: 0;
  animation: ${overlayEnter} 400ms cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
`;

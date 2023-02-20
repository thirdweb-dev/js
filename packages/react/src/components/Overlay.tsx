import { Theme } from "../design-system";
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
  background-color: ${(p) => p.theme.overlay.subdued};
  position: fixed;
  inset: 0;
  animation: ${overlayEnter} 200ms cubic-bezier(0.16, 1, 0.3, 1);
`;

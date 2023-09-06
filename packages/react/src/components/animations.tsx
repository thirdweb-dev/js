import { keyframes } from "@emotion/react";
import { spacing } from "../design-system";

export const flyingAnimation = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-${spacing.sm});
  }
`;

import { keyframes } from "@emotion/react";

export const floatUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20%) scale(0.8) ;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const floatDownAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20%) scale(0.8) ;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const FadeIn = styled.div`
  animation: ${fadeInAnimation} 0.15s ease-in;
`;

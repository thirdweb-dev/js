import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

export interface SpinnerProps {}

export const Spinner = styled.div<SpinnerProps>`
  display: inline-block;
  border-top: 2px solid currentcolor;
  border-right: 2px solid currentcolor;
  border-bottom-style: solid;
  border-left-style: solid;
  border-radius: 99999px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  animation: 0.45s linear 0s infinite normal none running ${spin};
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
`;

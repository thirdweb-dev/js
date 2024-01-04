// UNCHANGED
import { css, cx, keyframes } from "@emotion/css";
import React from "react";

export const Spinner = ({
  className,
}: {
  className?: string;
}): React.ReactElement => {
  return <div id="loader" className={cx(loader, className)}></div>;
};

const Spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const loader = css`
  border: 0.15rem solid #f3f3f300;
  border-top: 0.15rem solid #000000;
  border-left: 0.15rem solid #000000;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  animation: ${Spin} 1s linear infinite;
`;

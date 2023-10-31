import { css } from "@emotion/css";

export const opacity0 = css`
  opacity: 0;
`;

export const opacity1 = css`
  opacity: 1;
`;

export const iframeContainer = css`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const transitionContainer = css`
  display: grid;
  position: relative;
  width: 100%;
`;

const enterTransition = css`
  transition-delay: 150ms;
  transition-property: opacity;
  transition-duration: 75ms;
`;

const leaveTransition = css`
  transition-property: opacity;
  transition-duration: 150ms;
`;

const transitionDefaultClasses = css`
  background-color: transparent;
  grid-column-start: 1;
  grid-row-start: 1;
`;

export const commonTransitionProps = {
  className: transitionDefaultClasses,
  enter: enterTransition,
  enterFrom: opacity0,
  enterTo: opacity1,
  leave: leaveTransition,
  leaveFrom: opacity1,
  leaveTo: opacity0,
};

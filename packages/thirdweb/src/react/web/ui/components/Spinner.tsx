"use client";
import { keyframes } from "@emotion/react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import { iconSize } from "../../../core/design-system/index.js";
import { StyledCircle, StyledSvg } from "../design-system/elements.js";

/**
 * @internal
 */
export const Spinner: React.FC<{
  size: keyof typeof iconSize;
  color?: keyof Theme["colors"];
}> = (props) => {
  const theme = useCustomTheme();
  return (
    <Svg
      style={{
        height: `${iconSize[props.size]}px`,
        width: `${iconSize[props.size]}px`,
      }}
      viewBox="0 0 50 50"
    >
      <Circle
        cx="25"
        cy="25"
        fill="none"
        r="20"
        stroke={props.color ? theme.colors[props.color] : "currentColor"}
        strokeWidth={Number(iconSize[props.size]) > 64 ? "2" : "4"}
      />
    </Svg>
  );
};

// animations
const dashAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const Svg = /* @__PURE__ */ StyledSvg({
  animation: `${rotateAnimation} 2s linear infinite`,
  height: "1em",
  width: "1em",
});

const Circle = /* @__PURE__ */ StyledCircle({
  animation: `${dashAnimation} 1.5s ease-in-out infinite`,
  strokeLinecap: "round",
});

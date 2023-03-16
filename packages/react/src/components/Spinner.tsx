import { iconSize, Theme } from "../design-system";
import { keyframes, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

export const Spinner: React.FC<{
  color: keyof Theme["icon"];
  size: keyof typeof iconSize;
}> = (props) => {
  const theme = useTheme() as Theme;
  return (
    <Svg
      style={{
        width: iconSize[props.size],
        height: iconSize[props.size],
      }}
      viewBox="0 0 50 50"
    >
      <Circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={theme.icon[props.color || "primary"]}
        strokeWidth="4"
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

// styles
const Svg = styled.svg`
  animation: ${rotateAnimation} 2s linear infinite;
  width: 1em;
  height: 1em;
`;

const Circle = styled.circle`
  stroke-linecap: round;
  animation: ${dashAnimation} 1.5s ease-in-out infinite;
`;

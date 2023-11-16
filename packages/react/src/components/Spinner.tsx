import { iconSize, type Theme } from "../design-system";
import { keyframes, useTheme } from "@emotion/react";
import { StyledCircle, StyledSvg } from "../design-system/elements";

export const Spinner: React.FC<{
  color: keyof Theme["colors"];
  size: keyof typeof iconSize;
}> = (props) => {
  const theme = useTheme() as Theme;
  return (
    <Svg
      style={{
        width: iconSize[props.size] + "px",
        height: iconSize[props.size] + "px",
      }}
      viewBox="0 0 50 50"
    >
      <Circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={theme.colors[props.color]}
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

const Svg = /* @__PURE__ */ StyledSvg({
  animation: `${rotateAnimation} 2s linear infinite`,
  width: "1em",
  height: "1em",
});

const Circle = /* @__PURE__ */ StyledCircle({
  strokeLinecap: "round",
  animation: `${dashAnimation} 1.5s ease-in-out infinite`,
});

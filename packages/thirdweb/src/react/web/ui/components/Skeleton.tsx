"use client";
import { keyframes } from "@emotion/react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius, type Theme } from "../../../core/design-system/index.js";
import { StyledDiv } from "../design-system/elements.js";

/**
 * @internal
 */
export const Skeleton: React.FC<{
  height: string;
  width?: string;
  color?: keyof Theme["colors"];
  className?: string;
}> = (props) => {
  return (
    <SkeletonDiv
      className={props.className || ""}
      color={props.color}
      style={{
        height: props.height,
        width: props.width || "auto",
      }}
    />
  );
};

const skeletonAnimation = keyframes`
0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const SkeletonDiv = /* @__PURE__ */ StyledDiv(
  (props: { color?: keyof Theme["colors"] }) => {
    const theme = useCustomTheme();
    return {
      animation: `${skeletonAnimation} 500ms ease-in-out infinite alternate`,
      backgroundColor: theme.colors[props.color || "skeletonBg"],
      backgroundSize: "200% 200%",
      borderRadius: radius.sm,
    };
  },
);

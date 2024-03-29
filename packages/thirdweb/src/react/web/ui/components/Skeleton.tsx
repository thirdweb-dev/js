import { keyframes } from "@emotion/react";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../design-system/elements.js";
import { radius } from "../design-system/index.js";

/**
 * @internal
 */
export const Skeleton: React.FC<{
  height: string;
  width?: string;
}> = (props) => {
  return (
    <SkeletonDiv
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

const SkeletonDiv = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    backgroundSize: "200% 200%",
    backgroundColor: theme.colors.skeletonBg,
    animation: `${skeletonAnimation} 500ms ease-in-out infinite alternate`,
    borderRadius: radius.sm,
  };
});

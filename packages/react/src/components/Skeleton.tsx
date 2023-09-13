import { radius, Theme } from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

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

const SkeletonDiv = styled.div<{ theme?: Theme }>`
  background-size: 200% 200%;
  background-color: ${(p) => p.theme.colors.skeletonBg};
  animation: ${skeletonAnimation} 500ms ease-in-out infinite alternate;
  border-radius: ${radius.sm};
`;

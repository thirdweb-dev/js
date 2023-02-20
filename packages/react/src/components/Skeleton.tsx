import { radius, Theme } from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const Skeleton: React.FC<{ height: string; width?: string }> = (
  props,
) => {
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
    background-color: var(--skeleton-c-1);
  }
  100% {
    background-color: var(--skeleton-c-2);
  }
`;

const SkeletonDiv = styled.div<{ theme?: Theme }>`
  background-size: 200% 200%;
  --skeleton-c-1: ${(p) => p.theme.bg.elevated};
  --skeleton-c-2: ${(p) => p.theme.bg.highlighted};
  animation: ${skeletonAnimation} 1s ease-in-out infinite alternate;
  border-radius: ${radius.sm};
`;

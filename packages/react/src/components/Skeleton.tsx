import { radius, Theme } from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

type Gradient = { c1: keyof Theme["bg"]; c2: keyof Theme["bg"] };

export const Skeleton: React.FC<{
  height: string;
  width?: string;
  gradient?: Gradient;
}> = (props) => {
  return (
    <SkeletonDiv
      gradient={props.gradient}
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

const SkeletonDiv = styled.div<{ theme?: Theme; gradient?: Gradient }>`
  background-size: 200% 200%;
  --skeleton-c-1: ${(p) => p.theme.bg[p.gradient?.c1 || "elevated"]};
  --skeleton-c-2: ${(p) => p.theme.bg[p.gradient?.c2 || "highlighted"]};
  animation: ${skeletonAnimation} 500ms ease-in-out infinite alternate;
  border-radius: ${radius.sm};
`;

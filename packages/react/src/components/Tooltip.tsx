import { fontSize, radius, shadow, spacing, Theme } from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export const ToolTip: React.FC<{
  children: React.ReactNode;
  tip: React.ReactNode;
}> = (props) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{props.children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <TooltipContent sideOffset={5}>
            {props.tip}
            <TooltipArrow />
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

const slideUpAndFade = keyframes`
from {
  opacity: 0;
  transform: translateY(2px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
`;

const TooltipContent = styled(RadixTooltip.Content)<{ theme?: Theme }>`
  background: ${(p) => p.theme.bg.inverted};
  color: ${(p) => p.theme.text.inverted};
  border-radius: ${radius.sm};
  line-height: 1;
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${fontSize.sm};
  box-shadow: ${shadow.sm};
  user-select: none;
  will-change: transform, opacity;
  animation: ${slideUpAndFade} 200ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const TooltipArrow = styled(RadixTooltip.Arrow)<{ theme?: Theme }>`
  fill: ${(p) => p.theme.bg.inverted};
`;

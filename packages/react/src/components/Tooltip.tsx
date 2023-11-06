import { fontSize, radius, shadow, spacing, Theme } from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export const ToolTip: React.FC<{
  children: React.ReactNode;
  tip: React.ReactNode;
  sideOffset?: number;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}> = (props) => {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{props.children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <TooltipContent
            sideOffset={props.sideOffset || 6}
            align={props.align}
            side={props.side}
          >
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

const TooltipContent = /* @__PURE__ */ (() => styled(RadixTooltip.Content)<{
  theme?: Theme;
}>`
  background: ${(p) => p.theme.colors.tooltipBg};
  color: ${(p) => p.theme.colors.tooltipText};
  border-radius: ${radius.sm};
  line-height: normal;
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${fontSize.sm};
  box-shadow: ${shadow.sm};
  user-select: none;
  will-change: transform, opacity;
  animation: ${slideUpAndFade} 200ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 999999999999999;
  max-width: 300px;
  line-height: 1.5;
`)();

const TooltipArrow = /* @__PURE__ */ (() => styled(RadixTooltip.Arrow)<{
  theme?: Theme;
}>`
  fill: ${(p) => p.theme.colors.tooltipBg};
`)();

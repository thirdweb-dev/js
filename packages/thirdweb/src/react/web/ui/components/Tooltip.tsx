"use client";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  shadow,
  spacing,
} from "../../../core/design-system/index.js";

/**
 * @internal
 */
export const ToolTip: React.FC<{
  children: React.ReactNode;
  tip: React.ReactNode;
  sideOffset?: number;
  align?: "start" | "center" | "end" | undefined;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}> = (props) => {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{props.children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <TooltipContent
            sideOffset={props.sideOffset || 6}
            align={props.align || "center"}
            side={props.side || "top"}
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

const TooltipContent = /* @__PURE__ */ (() =>
  styled(RadixTooltip.Content)((_) => {
    const theme = useCustomTheme();
    return {
      background: theme.colors.tooltipBg,
      color: theme.colors.tooltipText,
      borderRadius: radius.sm,
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: fontSize.sm,
      boxShadow: shadow.sm,
      userSelect: "none",
      willChange: "transform, opacity",
      animation: `${slideUpAndFade} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
      zIndex: 999999999999999,
      maxWidth: "300px",
      lineHeight: 1.5,
    };
  }))();

const TooltipArrow = /* @__PURE__ */ (() =>
  styled(RadixTooltip.Arrow)(() => {
    const theme = useCustomTheme();
    return {
      fill: theme.colors.tooltipBg,
    };
  }))();

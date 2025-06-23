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
            align={props.align || "center"}
            side={props.side || "top"}
            sideOffset={props.sideOffset || 6}
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
      animation: `${slideUpAndFade} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
      background: theme.colors.tooltipBg,
      borderRadius: radius.sm,
      boxShadow: shadow.sm,
      color: theme.colors.tooltipText,
      fontSize: fontSize.sm,
      lineHeight: 1.5,
      maxWidth: "300px",
      padding: `${spacing.xs} ${spacing.sm}`,
      userSelect: "none",
      willChange: "transform, opacity",
      zIndex: 999999999999999,
    };
  }))();

const TooltipArrow = /* @__PURE__ */ (() =>
  styled(RadixTooltip.Arrow)(() => {
    const theme = useCustomTheme();
    return {
      fill: theme.colors.tooltipBg,
    };
  }))();

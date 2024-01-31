import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as RXPopover from "@radix-ui/react-popover";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { radius, spacing, shadow, fontSize } from "../design-system/index.js";
import { Container } from "./basic.js";

export type PopoverProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * @internal
 */
export const Popover = (props: PopoverProps) => {
  return (
    <RXPopover.Root open={props.open} onOpenChange={props.onOpenChange}>
      <RXPopover.Trigger asChild>{props.children}</RXPopover.Trigger>
      <RXPopover.Portal>
        <PopoverContent sideOffset={7} side="top">
          <Container
            flex="row"
            center="y"
            gap="sm"
            style={{
              lineHeight: 1.5,
              maxWidth: "200px",
              textAlign: "center",
            }}
          >
            {props.content}
          </Container>
          <PopoverArrow />
        </PopoverContent>
      </RXPopover.Portal>
    </RXPopover.Root>
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

const PopoverContent = /* @__PURE__ */ (() =>
  styled(RXPopover.Content)(() => {
    const theme = useCustomTheme();
    return {
      borderRadius: radius.sm,
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: theme.colors.tooltipBg,
      boxShadow: shadow.md,
      willChange: "transform, opacity",
      animation: `${slideUpAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
      color: theme.colors.tooltipText,
      fontSize: fontSize.md,
    };
  }))();

const PopoverArrow = /* @__PURE__ */ (() =>
  styled(RXPopover.Arrow)(() => {
    const theme = useCustomTheme();
    return {
      fill: theme.colors.tooltipBg,
    };
  }))();

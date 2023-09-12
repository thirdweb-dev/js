import {
  fontSize,
  radius,
  shadow,
  spacing,
  type Theme,
} from "../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as RXPopover from "@radix-ui/react-popover";

export type PopoverProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Popover = (props: PopoverProps) => {
  return (
    <RXPopover.Root open={props.open} onOpenChange={props.onOpenChange}>
      <RXPopover.Trigger asChild>{props.children}</RXPopover.Trigger>
      <RXPopover.Portal>
        <PopoverContent sideOffset={7} side="top">
          <FlexWrapper>{props.content}</FlexWrapper>
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

const PopoverContent = /* @__PURE__ */ styled(
  /* @__PURE__ */ RXPopover.Content,
)<{ theme?: Theme }>`
  border-radius: ${radius.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${(p) => p.theme.colors.primaryText};
  box-shadow: ${shadow.md};
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  animation-name: ${slideUpAndFade};
  color: ${(p) => p.theme.colors.base1};
  font-size: ${fontSize.md};
`;

const PopoverArrow = /* @__PURE__ */ styled(/* @__PURE__ */ RXPopover.Arrow)<{
  theme?: Theme;
}>`
  fill: ${(p) => p.theme.colors.primaryText};
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

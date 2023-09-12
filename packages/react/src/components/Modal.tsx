import {
  Theme,
  media,
  spacing,
  shadow,
  radius,
  iconSize,
} from "../design-system";
import {
  widemodalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
  compactmodalMaxHeight,
} from "../wallet/ConnectWallet/constants";
import { Overlay } from "./Overlay";
import { noScrollBar } from "./basic";
import { IconButton } from "./buttons";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DynamicHeight } from "./DynamicHeight";

export const Modal: React.FC<{
  trigger?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hideCloseIcon?: boolean;
  size: "wide" | "compact";
}> = (props) => {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.setOpen}>
      {/* Trigger */}
      {props.trigger && (
        <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      )}

      {/* Dialog */}
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay asChild>
          <Overlay />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <DialogContent
            style={{
              height: props.size === "compact" ? "auto" : widemodalMaxHeight,
              maxWidth:
                props.size === "compact"
                  ? modalMaxWidthCompact
                  : modalMaxWidthWide,
            }}
          >
            {props.size === "compact" ? (
              <DynamicHeight maxHeight={compactmodalMaxHeight}>
                {props.children}{" "}
              </DynamicHeight>
            ) : (
              props.children
            )}

            {/* Close Icon */}
            {!props.hideCloseIcon && (
              <CrossContainer>
                <Dialog.Close asChild>
                  <IconButton
                    variant="secondary"
                    type="button"
                    aria-label="Close"
                  >
                    <Cross2Icon
                      style={{
                        width: iconSize.md,
                        height: iconSize.md,
                        color: "inherit",
                      }}
                    />
                  </IconButton>
                </Dialog.Close>
              </CrossContainer>
            )}
          </DialogContent>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const CrossContainer = styled.div`
  position: absolute;
  top: ${spacing.lg};
  right: ${spacing.lg};

  ${media.mobile} {
    right: ${spacing.md};
  }
`;

const modalAnimationDesktop = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const modalAnimationMobile = keyframes`
  from {
    opacity: 0;
    transform: translate(0, 50%);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

const DialogContent = styled.div<{ theme?: Theme }>`
  z-index: 10000;
  background: ${(p) => p.theme.colors.base1};
  color: ${(p) => p.theme.colors.primaryText};
  border-radius: ${radius.xl};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 40px);
  box-sizing: border-box;
  animation: ${modalAnimationDesktop} 300ms ease;
  box-shadow: ${shadow.lg};
  line-height: 1;
  border: 1px solid ${(p) => p.theme.colors.base3};
  outline: none;

  ${noScrollBar}

  /* open from bottom on mobile */
  ${media.mobile} {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100vw;
    transform: none;
    width: 100vw;
    animation: ${modalAnimationMobile} 0.35s cubic-bezier(0.15, 1.15, 0.6, 1);
    border-radius: ${radius.xxl};
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    max-width: none !important;
  }

  & *::selection {
    background-color: ${(p) => p.theme.colors.primaryText};
    color: ${(p) => p.theme.colors.base1};
  }
`;

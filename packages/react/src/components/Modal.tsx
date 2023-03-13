import {
  Theme,
  media,
  spacing,
  shadow,
  radius,
  iconSize,
  fontSize,
} from "../design-system";
import { scrollbar } from "../design-system/styles";
import { Overlay } from "./Overlay";
import { IconButton } from "./buttons";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

export const Modal: React.FC<{
  trigger?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  hideCloseIcon?: boolean;
}> = (props) => {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.setOpen}>
      {/* Trigger */}
      {props.trigger && (
        <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      )}

      {/* Overlay */}
      <Dialog.Overlay asChild>
        <Overlay />
      </Dialog.Overlay>

      {/* Dialog */}
      <Dialog.Portal>
        <Dialog.Content asChild>
          <DialogContent style={props.style}>
            {props.title && <DialogTitle> {props.title}</DialogTitle>}

            {props.children}

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

const CrossContainer = styled.div`
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
  background-color: ${(p) => p.theme.bg.base};
  border-radius: ${radius.xl};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 40px);
  overflow-y: auto;
  padding: ${spacing.lg};
  padding-bottom: ${spacing.xl};
  animation: ${modalAnimationDesktop} 200ms ease;
  box-shadow: ${shadow.lg};

  &:focus {
    outline: none;
  }

  ${(p) =>
    scrollbar({
      track: "transparent",
      thumb: p.theme.bg.elevated,
      hover: p.theme.bg.highlighted,
    })}

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
  }
`;

const DialogTitle = styled(Dialog.Title)<{ theme?: Theme }>`
  margin: 0;
  font-weight: 500;
  color: ${(p) => p.theme.text.neutral};
  font-size: ${fontSize.lg};
`;

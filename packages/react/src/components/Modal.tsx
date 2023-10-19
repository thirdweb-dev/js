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
  modalCloseFadeOutDuration,
} from "../wallet/ConnectWallet/constants";
import { Overlay } from "./Overlay";
import { noScrollBar } from "./basic";
import { IconButton } from "./buttons";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DynamicHeight } from "./DynamicHeight";
import { useEffect, useRef, useState } from "react";

export const Modal: React.FC<{
  trigger?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hideCloseIcon?: boolean;
  size: "wide" | "compact";
  hide?: boolean;
}> = (props) => {
  const [open, setOpen] = useState(props.open);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!props.open) {
      if (contentRef.current) {
        const animationConfig = {
          duration: modalCloseFadeOutDuration,
          fill: "forwards",
          easing: "ease",
        } as const;

        contentRef.current.animate([{ opacity: 0 }], {
          ...animationConfig,
        }).onfinish = () => {
          setOpen(false);
        };

        overlayRef.current?.animate([{ opacity: 0 }], {
          ...animationConfig,
          duration: modalCloseFadeOutDuration + 100,
        });
      } else {
        setOpen(props.open);
      }
    } else {
      setOpen(props.open);
    }
  }, [props.open]);

  return (
    <Dialog.Root open={open} onOpenChange={props.setOpen}>
      {/* Trigger */}
      {props.trigger && (
        <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      )}

      {/* Dialog */}
      <Dialog.Portal>
        {/* Overlay */}
        {!props.hide && (
          <Dialog.Overlay asChild>
            <Overlay ref={overlayRef} />
          </Dialog.Overlay>
        )}

        <Dialog.Content asChild>
          <DialogContent
            ref={contentRef}
            style={
              props.hide
                ? { width: 0, height: 0, overflow: "hidden", opacity: 0 }
                : {
                    height:
                      props.size === "compact" ? "auto" : widemodalMaxHeight,
                    maxWidth:
                      props.size === "compact"
                        ? modalMaxWidthCompact
                        : modalMaxWidthWide,
                  }
            }
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
                  <IconButton type="button" aria-label="Close">
                    <Cross2Icon
                      width={iconSize.md}
                      height={iconSize.md}
                      style={{
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
  transform: translateX(15%);

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
  background: ${(p) => p.theme.colors.modalBg};
  --bg: ${(p) => p.theme.colors.modalBg};
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
  border: 1px solid ${(p) => p.theme.colors.borderColor};
  outline: none;
  overflow: hidden;
  font-family: ${(p) => p.theme.fontFamily};

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
    background-color: ${(p) => p.theme.colors.selectedTextBg};
    color: ${(p) => p.theme.colors.selectedTextColor};
  }
`;

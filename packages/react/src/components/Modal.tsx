import { media, spacing, shadow, radius, iconSize } from "../design-system";
import {
  wideModalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
  compactModalMaxHeight,
  modalCloseFadeOutDuration,
} from "../wallet/ConnectWallet/constants";
import { Overlay } from "./Overlay";
import { noScrollBar } from "./basic";
import { IconButton } from "./buttons";
import { keyframes } from "@emotion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DynamicHeight } from "./DynamicHeight";
import { useEffect, useRef, useState } from "react";
import { useCustomTheme } from "../design-system/CustomThemeProvider";
import { StyledDiv } from "../design-system/elements";

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
                      props.size === "compact" ? "auto" : wideModalMaxHeight,
                    maxWidth:
                      props.size === "compact"
                        ? modalMaxWidthCompact
                        : modalMaxWidthWide,
                  }
            }
          >
            {props.size === "compact" ? (
              <DynamicHeight maxHeight={compactModalMaxHeight}>
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

export const CrossContainer = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  top: spacing.lg,
  right: spacing.lg,
  transform: "translateX(15%)",
  [media.mobile]: {
    right: spacing.md,
  },
});

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

const DialogContent = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();

  return {
    zIndex: 10000,
    background: theme.colors.modalBg,
    "--bg": theme.colors.modalBg,
    color: theme.colors.primaryText,
    borderRadius: radius.xl,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw - 40px)",
    boxSizing: "border-box",
    animation: `${modalAnimationDesktop} 300ms ease`,
    boxShadow: shadow.lg,
    lineHeight: "normal",
    border: `1px solid ${theme.colors.borderColor}`,
    outline: "none",
    overflow: "hidden",
    fontFamily: theme.fontFamily,
    [media.mobile]: {
      top: "auto",
      bottom: 0,
      left: 0,
      right: 0,
      transform: "none",
      width: "100vw",
      animation: `${modalAnimationMobile} 0.35s cubic-bezier(0.15, 1.15, 0.6, 1)`,
      borderRadius: radius.xxl,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      maxWidth: "none !important",
    },
    "& *::selection": {
      backgroundColor: theme.colors.selectedTextBg,
      color: theme.colors.selectedTextColor,
    },
    ...noScrollBar,
  };
});

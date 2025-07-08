"use client";
import { keyframes } from "@emotion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  media,
  radius,
  shadow,
  spacing,
} from "../../../core/design-system/index.js";
import {
  compactModalMaxHeight,
  modalCloseFadeOutDuration,
  modalMaxWidthCompact,
  modalMaxWidthWide,
  wideModalMaxHeight,
} from "../ConnectWallet/constants.js";
import { StyledDiv } from "../design-system/elements.js";
import { noScrollBar } from "./basic.js";
import { IconButton } from "./buttons.js";
import { DynamicHeight } from "./DynamicHeight.js";
import { Overlay } from "./Overlay.js";

/**
 * @internal
 */
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
          easing: "ease",
          fill: "forwards",
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
    <Dialog.Root onOpenChange={props.setOpen} open={open}>
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

        <FocusScope trapped={!props.hide}>
          <Dialog.Content aria-describedby={undefined} asChild>
            <DialogContent
              ref={contentRef}
              style={
                props.hide
                  ? { height: 0, opacity: 0, overflow: "hidden", width: 0 }
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
              {/* Mimics Tailwind's sr-only tag */}
              <Dialog.Title
                style={{
                  borderWidth: 0,
                  clip: "rect(0, 0, 0, 0)",
                  height: "1px",
                  margin: "-1px",
                  overflow: "hidden",
                  padding: 0,
                  position: "absolute",
                  whiteSpace: "nowrap",
                  width: "1px",
                }}
              >
                Connect Modal
              </Dialog.Title>
              {props.size === "compact" ? (
                <DynamicHeight maxHeight={compactModalMaxHeight}>
                  {props.children}
                </DynamicHeight>
              ) : (
                props.children
              )}

              {/* Close Icon */}
              {!props.hideCloseIcon && (
                <CrossContainer>
                  <Dialog.Close asChild>
                    <IconButton aria-label="Close" autoFocus type="button">
                      <Cross2Icon
                        height={iconSize.md}
                        style={{
                          color: "inherit",
                        }}
                        width={iconSize.md}
                      />
                    </IconButton>
                  </Dialog.Close>
                </CrossContainer>
              )}
            </DialogContent>
          </Dialog.Content>
        </FocusScope>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const CrossContainer = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  right: spacing.lg,
  top: spacing.lg,
  transform: "translateX(6px)",
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

const DialogContent = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();

  return {
    "--bg": theme.colors.modalBg,
    "& *": {
      boxSizing: "border-box",
    },
    animation: `${modalAnimationDesktop} 300ms ease`,
    background: theme.colors.modalBg,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
    boxShadow: shadow.lg,
    boxSizing: "border-box",
    color: theme.colors.primaryText,
    fontFamily: theme.fontFamily,
    left: "50%",
    lineHeight: "normal",
    outline: "none",
    overflow: "hidden",
    position: "fixed",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw - 40px)",
    zIndex: 10000,
    [media.mobile]: {
      animation: `${modalAnimationMobile} 0.35s cubic-bezier(0.15, 1.15, 0.6, 1)`,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderRadius: radius.xl,
      bottom: 0,
      left: 0,
      maxWidth: "none !important",
      right: 0,
      top: "auto",
      transform: "none",
      width: "100vw",
    },
    "& *::selection": {
      backgroundColor: theme.colors.selectedTextBg,
      color: theme.colors.selectedTextColor,
    },
    ...noScrollBar,
  };
});

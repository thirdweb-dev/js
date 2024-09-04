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
import { DynamicHeight } from "./DynamicHeight.js";
import { Overlay } from "./Overlay.js";
import { noScrollBar } from "./basic.js";
import { IconButton } from "./buttons.js";

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

        <FocusScope trapped={!props.hide}>
          <Dialog.Content asChild aria-describedby={undefined}>
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
              {/* Mimics Tailwind's sr-only tag */}
              <Dialog.Title
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  borderWidth: 0,
                }}
              >
                Connect Modal
              </Dialog.Title>
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
                    <IconButton autoFocus type="button" aria-label="Close">
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
        </FocusScope>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const CrossContainer = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  top: spacing.lg,
  right: spacing.lg,
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
    zIndex: 10000,
    background: theme.colors.modalBg,
    "--bg": theme.colors.modalBg,
    color: theme.colors.primaryText,
    borderRadius: radius.lg,
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
    "& *": {
      boxSizing: "border-box",
    },
    [media.mobile]: {
      top: "auto",
      bottom: 0,
      left: 0,
      right: 0,
      transform: "none",
      width: "100vw",
      animation: `${modalAnimationMobile} 0.35s cubic-bezier(0.15, 1.15, 0.6, 1)`,
      borderRadius: radius.xl,
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

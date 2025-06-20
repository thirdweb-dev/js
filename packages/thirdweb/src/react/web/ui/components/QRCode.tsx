"use client";
import { keyframes } from "@emotion/react";
import type React from "react";
import { lazy, Suspense } from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../core/design-system/index.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";

const QRCodeRenderer = /* @__PURE__ */ lazy(
  () => import("./QRCode/QRCodeRenderer.js"),
);

/**
 * @internal
 */
export const QRCode = (props: {
  qrCodeUri?: string;
  QRIcon?: React.ReactNode;
  size?: number;
}) => {
  const size = props.size || 310;

  const placeholder = (
    <QRPlaceholder
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      <span data-v1 />
      <span data-v2 />
      <span data-v3 />
      <div />
    </QRPlaceholder>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {props.qrCodeUri ? (
        <Suspense fallback={placeholder}>
          <QRCodeContainer>
            <QRCodeRenderer
              clearSize={props.QRIcon ? 70 : undefined}
              ecl="M"
              size={size + 20}
              uri={props.qrCodeUri}
            />
          </QRCodeContainer>
        </Suspense>
      ) : (
        placeholder
      )}

      {props.QRIcon && <IconContainer>{props.QRIcon}</IconContainer>}
    </div>
  );
};

const IconContainer = /* @__PURE__ */ StyledDiv({
  alignContent: "center",
  display: "flex",
  justifyContent: "center",
  left: "50%",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1000,
});

const QRCodeContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    "--ck-body-background": theme.colors.modalBg,
    "--ck-qr-background": theme.colors.modalBg,
    "--ck-qr-dot-color": theme.colors.primaryText,
    animation: `${fadeInAnimation} 600ms ease`,
  };
});

const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;

const QRPlaceholder = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    "--bg": theme.colors.modalBg,
    "--color": theme.colors.skeletonBg,
    "&::after": {
      animation: `${PlaceholderKeyframes} 1000ms linear infinite both`,
      background:
        "linear-gradient(90deg, transparent 50%, var(--color), transparent)",
      backgroundSize: "200% 100%",
      content: '""',
      inset: 0,
      position: "absolute",
      transform: "scale(1.5) rotate(45deg)",
      zIndex: 100,
    },
    "&:before": {
      background: "repeat",
      backgroundImage: "radial-gradient(var(--color) 41%, transparent 41%)",
      backgroundSize: "1.888% 1.888%",
      content: '""',
      inset: 0,
      position: "absolute",
      zIndex: 3,
    },
    "> div": {
      background: "var(--bg)",
      borderRadius: "5px",
      boxShadow: "0 0 0 7px var(--bg)",
      height: "28%",
      position: "relative",
      width: "28%",
      zIndex: 4,
    },
    "> span": {
      "&:before": {
        borderRadius: "3px",
        boxShadow: "0 0 0 4px var(--bg)",
        content: '""',
        inset: "9px",
        position: "absolute",
      },
      "&[data-v1]": {
        left: 0,
        top: 0,
      },
      "&[data-v2]": {
        right: 0,
        top: 0,
      },
      "&[data-v3]": {
        bottom: 0,
        left: 0,
      },
      background: "var(--color)",
      borderRadius: "12px",
      boxShadow: "0 0 0 4px var(--bg)",
      height: "13.25%",
      position: "absolute",
      width: "13.25%",
      zIndex: 4,
    },
    alignItems: "center",
    borderRadius: radius.md,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  };
});

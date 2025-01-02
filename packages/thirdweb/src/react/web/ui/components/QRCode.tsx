"use client";
import { keyframes } from "@emotion/react";
import type React from "react";
import { Suspense, lazy } from "react";
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
        width: `${size}px`,
        height: `${size}px`,
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
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {props.qrCodeUri ? (
        <Suspense fallback={placeholder}>
          <QRCodeContainer>
            <QRCodeRenderer
              uri={props.qrCodeUri}
              size={size + 20}
              ecl="M"
              clearSize={props.QRIcon ? 70 : undefined}
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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  zIndex: 1000,
});

const QRCodeContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    animation: `${fadeInAnimation} 600ms ease`,
    "--ck-qr-dot-color": theme.colors.primaryText,
    "--ck-body-background": theme.colors.modalBg,
    "--ck-qr-background": theme.colors.modalBg,
  };
});

const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;

const QRPlaceholder = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    "--color": theme.colors.skeletonBg,
    "--bg": theme.colors.modalBg,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    "> div": {
      zIndex: 4,
      position: "relative",
      width: "28%",
      height: "28%",
      borderRadius: "5px",
      background: "var(--bg)",
      boxShadow: "0 0 0 7px var(--bg)",
    },
    "> span": {
      zIndex: 4,
      position: "absolute",
      background: "var(--color)",
      borderRadius: "12px",
      width: "13.25%",
      height: "13.25%",
      boxShadow: "0 0 0 4px var(--bg)",
      "&:before": {
        content: '""',
        position: "absolute",
        inset: "9px",
        borderRadius: "3px",
        boxShadow: "0 0 0 4px var(--bg)",
      },
      "&[data-v1]": {
        top: 0,
        left: 0,
      },
      "&[data-v2]": {
        top: 0,
        right: 0,
      },
      "&[data-v3]": {
        bottom: 0,
        left: 0,
      },
    },
    "&:before": {
      zIndex: 3,
      content: '""',
      position: "absolute",
      inset: 0,
      background: "repeat",
      backgroundSize: "1.888% 1.888%",
      backgroundImage: "radial-gradient(var(--color) 41%, transparent 41%)",
    },
    "&::after": {
      zIndex: 100,
      content: '""',
      position: "absolute",
      inset: 0,
      transform: "scale(1.5) rotate(45deg)",
      background:
        "linear-gradient(90deg, transparent 50%, var(--color), transparent)",
      backgroundSize: "200% 100%",
      animation: `${PlaceholderKeyframes} 1000ms linear infinite both`,
    },
  };
});

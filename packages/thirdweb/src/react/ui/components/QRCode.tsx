import { keyframes } from "@emotion/react";
import React, { type ReactElement, useMemo } from "react";
import QRCodeUtil from "qrcode";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";
import { radius } from "../design-system/index.js";

/**
 * @internal
 */
export const QRCode = (props: {
  qrCodeUri?: string;
  QRIcon?: React.ReactNode;
  size?: number;
}) => {
  const size = props.size || 310;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {props.qrCodeUri ? (
        <QRCodeContainer>
          <QRCodeRenderer
            uri={props.qrCodeUri}
            size={size + 20}
            ecl="M"
            clearSize={props.QRIcon ? 70 : undefined}
          />
        </QRCodeContainer>
      ) : (
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

/**
 * @internal
 */
const generateMatrix = (
  value: string,
  errorCorrectionLevel: QRCodeUtil.QRCodeErrorCorrectionLevel,
) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0,
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    [],
  );
};

type Props = {
  ecl?: QRCodeUtil.QRCodeErrorCorrectionLevel;
  size?: number;
  uri: string;
  clearSize?: number;
  image?: React.ReactNode;
  imageBackground?: string;
};

export const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;

export const QRPlaceholder = /* @__PURE__ */ StyledDiv(() => {
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

/**
 * @internal
 */
export function QRCodeRenderer({
  ecl = "M",
  size: sizeProp = 200,
  uri,
  clearSize = 0,
  image,
  imageBackground = "transparent",
}: Props) {
  const logoSize = clearSize;
  const size = sizeProp - 10 * 2;

  const dots = useMemo(() => {
    const dotsArray: ReactElement[] = [];
    const matrix = generateMatrix(uri, ecl);
    const cellSize = size / matrix.length;
    const qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        dotsArray.push(
          <rect
            key={`${i}-${x}-${y}`}
            fill={
              i % 2 !== 0
                ? "var(--ck-qr-background, var(--ck-body-background))"
                : "var(--ck-qr-dot-color)"
            }
            rx={(i - 2) * -5 + (i === 0 ? 2 : 3)}
            ry={(i - 2) * -5 + (i === 0 ? 2 : 3)}
            width={cellSize * (7 - i * 2)}
            height={cellSize * (7 - i * 2)}
            x={x1 + cellSize * i}
            y={y1 + cellSize * i}
          />,
        );
      }
    });

    if (image) {
      const x1 = (matrix.length - 7) * cellSize * 1;
      const y1 = (matrix.length - 7) * cellSize * 1;
      dotsArray.push(
        <>
          <rect
            fill={imageBackground}
            rx={(0 - 2) * -5 + 2}
            ry={(0 - 2) * -5 + 2}
            width={cellSize * (7 - 0 * 2)}
            height={cellSize * (7 - 0 * 2)}
            x={x1 + cellSize * 0}
            y={y1 + cellSize * 0}
          />
          <foreignObject
            width={cellSize * (7 - 0 * 2)}
            height={cellSize * (7 - 0 * 2)}
            x={x1 + cellSize * 0}
            y={y1 + cellSize * 0}
          >
            <div style={{ borderRadius: (0 - 2) * -5 + 2, overflow: "hidden" }}>
              {image}
            </div>
          </foreignObject>
        </>,
      );
    }

    const clearArenaSize = Math.floor((logoSize + 25) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

    matrix.forEach((row: QRCodeUtil.QRCode[], i: number) => {
      row.forEach((_: any, j: number) => {
        if (matrix[i][j]) {
          // Do not render dots under position squares
          if (
            !(
              (i < 7 && j < 7) ||
              (i > matrix.length - 8 && j < 7) ||
              (i < 7 && j > matrix.length - 8)
            )
          ) {
            //if (image && i > matrix.length - 9 && j > matrix.length - 9) return;
            if (
              image ||
              !(
                i > matrixMiddleStart &&
                i < matrixMiddleEnd &&
                j > matrixMiddleStart &&
                j < matrixMiddleEnd
              )
            ) {
              dotsArray.push(
                <circle
                  key={`circle-${i}-${j}`}
                  cx={i * cellSize + cellSize / 2}
                  cy={j * cellSize + cellSize / 2}
                  fill="var(--ck-qr-dot-color)"
                  r={cellSize / 3}
                />,
              );
            }
          }
        }
      });
    });

    return dotsArray;
  }, [ecl, image, imageBackground, logoSize, size, uri]);

  return (
    <svg
      height={size}
      width={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <rect fill="transparent" height={size} width={size} />
      {dots}
    </svg>
  );
}

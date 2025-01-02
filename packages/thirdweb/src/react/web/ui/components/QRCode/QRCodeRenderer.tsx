"use client";
import type React from "react";
import { type ReactElement, useMemo } from "react";
import { encode } from "uqr";

type QRCodeRendererProps = {
  ecl?: "L" | "M" | "Q" | "H";
  size?: number;
  uri: string;
  clearSize?: number;
  image?: React.ReactNode;
  imageBackground?: string;
};

/**
 * @internal
 */
function QRCodeRenderer({
  ecl = "M",
  size: sizeProp = 200,
  uri,
  clearSize = 0,
  image,
  imageBackground = "transparent",
}: QRCodeRendererProps) {
  const logoSize = clearSize;
  const size = sizeProp - 10 * 2;

  const dots = useMemo(() => {
    const dotsArray: ReactElement[] = [];
    const matrix = encode(uri, { ecc: ecl, border: 0 }).data;
    const cellSize = size / matrix.length;
    const qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    for (const { x, y } of qrList) {
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
    }

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

    matrix.forEach((row, i: number) => {
      row.forEach((_: boolean, j: number) => {
        if (matrix[i]?.[j]) {
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
                  key={`circle-${i}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: its the only thing available for the key here
                    j
                  }`}
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
      role="presentation"
    >
      <rect fill="transparent" height={size} width={size} />
      {dots}
    </svg>
  );
}

export default QRCodeRenderer;

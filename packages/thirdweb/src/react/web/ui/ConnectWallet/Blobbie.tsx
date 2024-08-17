"use client";
import { hexToNumber } from "@noble/curves/abstract/utils";
import { useId, useMemo } from "react";
import type { Address } from "viem";

const colorSet = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#ec4899",
  "#f43f5e",
];

// Distance between 2 colors (in RGB)
type Color = [number, number, number];
function distance(a: Color, b: Color) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2,
  );
}
function hexToRgb(hex: string) {
  return [
    Number(hexToNumber(hex.slice(0, 2))),
    Number(hexToNumber(hex.slice(2, 4))),
    Number(hexToNumber(hex.slice(4, 6))),
  ] satisfies [number, number, number];
}

function nearestColor(colorHex: string) {
  let lowest = Number.POSITIVE_INFINITY;
  let tmp: number;
  let index = 0;
  colorSet.forEach((el, i) => {
    tmp = distance(hexToRgb(colorHex), hexToRgb(el.replace("#", "")));
    if (tmp < lowest) {
      lowest = tmp;
      index = i;
    }
  });
  return colorSet[index] as string;
}

/**
 * A unique gradient avatar based on the provided address.
 * @param props The component props.
 * @param props.address The address to generate the gradient with.
 * @param props.size The size of each side of the square avatar (in pixels)
 */
export function Blobbie(props: { address: Address; size: number }) {
  const id = useId();
  const colors = useMemo(() => {
    const _colors: string[] = [];
    let i = 2;
    while (i <= 30) {
      const color = nearestColor(props.address.slice(i, i + 6));
      _colors.push(color);
      i += 6;
    }
    return _colors;
  }, [props.address]);

  return (
    <svg
      height={`${props.size}px`}
      style={{ background: "#FFFFFF" }}
      width={`${props.size}px`}
      role="presentation"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {colors.map((color, idx) => {
          return (
            <radialGradient
              id={`${id}_grad${idx + 1}`}
              cx="50%"
              cy="50%"
              r="50%"
              key={`grad${
                // biome-ignore lint/suspicious/noArrayIndexKey: Jonas said so
                idx
              }`}
            >
              <stop
                offset="0%"
                style={{ stopColor: `${color}`, stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: `${color}`, stopOpacity: 0 }}
              />
            </radialGradient>
          );
        })}
      </defs>
      <ellipse cx="100" cy="100" rx="600" ry="600" fill={`url(#${id}_grad1)`} />
      <ellipse cx="300" cy="0" rx="400" ry="400" fill={`url(#${id}_grad2)`} />
      <ellipse cx="100" cy="550" rx="200" ry="200" fill={`url(#${id}_grad3)`} />
      <ellipse cx="300" cy="450" rx="400" ry="400" fill={`url(#${id}_grad4)`} />
      <ellipse cx="50" cy="250" rx="200" ry="200" fill={`url(#${id}_grad5)`} />
      <ellipse cx="400" cy="220" rx="400" ry="400" fill={`url(#${id}_grad6)`} />
      <ellipse cx="100" cy="290" rx="500" ry="500" fill={`url(#${id}_grad7)`} />
    </svg>
  );
}

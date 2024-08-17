"use client";
import { hexToNumber } from "@noble/curves/abstract/utils";
import { useId, useMemo } from "react";
import { type Address, numberToHex } from "viem";

// Distance between 2 colors (in RGB)
type Color = [number, number, number];
function hexToRgb(hex: string) {
  return [
    Number(hexToNumber(hex.slice(0, 2))),
    Number(hexToNumber(hex.slice(2, 4))),
    Number(hexToNumber(hex.slice(4, 6))),
  ] satisfies [number, number, number];
}

/**
 * A unique gradient avatar based on the provided address.
 * @param props The component props.
 * @param props.address The address to generate the gradient with.
 * @param props.size The size of each side of the square avatar (in pixels)
 */
export function Blobbie(props: { address: Address; size: number }) {
  const id = useId();
  const colors: [string, string, string] = useMemo(() => {
    const color = props.address.slice(2, 8);
    const rgb = hexToRgb(color);

    // To get well-paired colors, we use the first rgb hex sequence as our main color then find its two best pairs (split color wheel into thirds)
    // To prevent extremely dark colors, which tend to clash, we don't allow values less than 55
    const pairing1 = rgb.map((n) => (n + 85 > 255 ? n + 85 - 200 : n + 85));
    const pairing2 = rgb.map((n) => (n - 85 < 55 ? n - 85 + 200 : n - 85));
    return [
      color,
      pairing1.map((n) => numberToHex(n).replace("0x", "")).join(""),
      pairing2.map((n) => numberToHex(n).replace("0x", "")).join(""),
    ];
  }, [props.address]);

  const positions: [Color, Color, Color, Color, Color] = useMemo(() => {
    const _positions: Color[] = [];
    let i = 8;
    while (i < 44) {
      const values = hexToRgb(props.address.slice(i, i + 6));
      _positions.push(values);
      i += 6;
    }
    return _positions as [Color, Color, Color, Color, Color];
  }, [props.address]);

  console.log(colors);

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
                style={{ stopColor: `#${color}`, stopOpacity: 0.9 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: `#${color}`, stopOpacity: 0 }}
              />
            </radialGradient>
          );
        })}
      </defs>

      <ellipse
        cx="250"
        cy="250"
        rx="500"
        ry="500"
        fill={`url(#${id}_grad1)`}
        opacity={0.5}
      />
      <ellipse
        cx={400 + positions[0][0]}
        cy={400 + positions[0][1]}
        rx={350 + positions[0][2]}
        ry={350 + positions[0][2]}
        fill={`url(#${id}_grad1)`}
      />
      <ellipse
        cx={positions[1][0]}
        cy={positions[1][1]}
        rx={350 + positions[1][2]}
        ry={350 + positions[1][2]}
        fill={`url(#${id}_grad2)`}
      />
      <ellipse
        cx={400 + positions[2][0]}
        cy={positions[2][1]}
        rx={350 + positions[2][2]}
        ry={350 + positions[2][2]}
        fill={`url(#${id}_grad3)`}
      />
      <ellipse
        cx={positions[3][0]}
        cy={positions[3][1]}
        rx={100 + positions[3][2]}
        ry={100 + positions[3][2]}
        fill={`url(#${id}_grad2)`}
        opacity={0.5}
      />
      <ellipse
        cx={positions[4][0]}
        cy={positions[4][1]}
        rx={100 + positions[4][2]}
        ry={100 + positions[4][2]}
        fill={`url(#${id}_grad3)`}
        opacity={0.5}
      />
    </svg>
  );
}

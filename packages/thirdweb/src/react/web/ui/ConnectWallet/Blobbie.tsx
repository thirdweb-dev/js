"use client";
import { hexToNumber } from "@noble/curves/abstract/utils";
import { useId, useMemo } from "react";

const COLOR_OPTIONS = [
  ["#fca5a5", "#b91c1c"],
  ["#fdba74", "#c2410c"],
  ["#fcd34d", "#b45309"],
  ["#fde047", "#a16207"],
  ["#a3e635", "#4d7c0f"],
  ["#86efac", "#15803d"],
  ["#67e8f9", "#0e7490"],
  ["#7dd3fc", "#0369a1"],
  ["#93c5fd", "#1d4ed8"],
  ["#a5b4fc", "#4338ca"],
  ["#c4b5fd", "#6d28d9"],
  ["#d8b4fe", "#7e22ce"],
  ["#f0abfc", "#a21caf"],
  ["#f9a8d4", "#be185d"],
  ["#fda4af", "#be123c"],
];

/**
 * Props for the Blobbie component
 * @component
 */
export type BlobbieProps = {
  address: string;
  style?: Omit<React.CSSProperties, "backgroundImage">;
  className?: string;
  size?: number;
};

/**
 * A unique gradient avatar based on the provided address.
 * @param props The component props.
 * @param props.address The address to generate the gradient with.
 * @param props.style The CSS style for the component - excluding `backgroundImage`
 * @param props.className The className for the component
 * @param props.size The size of each side of the square avatar (in pixels). This prop will override the `width` and `height` attributes from the `style` prop.
 * @component
 * @wallet
 * @example
 * ```tsx
 * import { Blobbie } from "thirdweb/react";
 *
 * <Blobbie address="0x...." className="w-10 h-10" />
 * ```
 */
export function Blobbie(props: BlobbieProps) {
  const id = useId();
  const colors = useMemo(
    () =>
      COLOR_OPTIONS[
        Number(hexToNumber(props.address.slice(2, 4))) % COLOR_OPTIONS.length
      ] as [string, string],
    [props.address],
  );

  return (
    <div
      id={id}
      style={{
        ...props.style,
        backgroundImage: `radial-gradient(ellipse at left bottom, ${colors[0]}, ${colors[1]})`,
        ...(props.size
          ? {
              width: `${props.size}px`,
              height: `${props.size}px`,
            }
          : undefined),
      }}
      className={props.className}
    />
  );
}

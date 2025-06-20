"use client";
import { hexToNumber } from "@noble/curves/abstract/utils";
import { useId, useMemo } from "react";
import { COLOR_OPTIONS } from "../../../core/utils/account.js";

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
      className={props.className}
      id={id}
      style={{
        ...props.style,
        backgroundImage: `radial-gradient(ellipse at left bottom, ${colors[0]}, ${colors[1]})`,
        ...(props.size
          ? {
              height: `${props.size}px`,
              width: `${props.size}px`,
            }
          : undefined),
      }}
    />
  );
}

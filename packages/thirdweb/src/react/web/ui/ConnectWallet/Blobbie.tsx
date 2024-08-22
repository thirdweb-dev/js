"use client";
import { hexToNumber } from "@noble/curves/abstract/utils";
import { useId, useMemo } from "react";
import type { Address } from "viem";

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
 * A unique gradient avatar based on the provided address.
 * @param props The component props.
 * @param props.address The address to generate the gradient with.
 * @param props.size The size of each side of the square avatar (in pixels)
 */
export function Blobbie(props: { address: Address; size: number }) {
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
        width: `${props.size}px`,
        height: `${props.size}px`,
        backgroundImage: `radial-gradient(ellipse at left bottom, ${colors[0]}, ${colors[1]})`,
      }}
    />
  );
}

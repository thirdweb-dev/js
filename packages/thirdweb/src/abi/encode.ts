import { concatHex, encodeAbiParameters } from "viem";
import { getFunctionSelector } from "./lib/getFunctionSelector.js";

import type { AbiFunction, AbiParametersToPrimitiveTypes } from "abitype";

/**
 * Encodes an ABI function with its arguments into a hexadecimal string.
 *
 * @param abiFn - The ABI function object.
 * @param args - The arguments to be encoded.
 * @returns The encoded ABI function as a hexadecimal string.
 * @internal
 */
export function encodeAbiFunction<const abiFn extends AbiFunction>(
  abiFn: abiFn,
  args: AbiParametersToPrimitiveTypes<abiFn["inputs"]> | readonly unknown[],
) {
  const signature = getFunctionSelector(abiFn);
  const data =
    "inputs" in abiFn && abiFn.inputs && abiFn.inputs.length > 0
      ? // @ts-expect-error - missing typecheck for inputs actually having a length etc
        encodeAbiParameters<abiFn["inputs"]>(abiFn.inputs, args ?? [])
      : undefined;
  return concatHex([signature, data ?? "0x"]);
}

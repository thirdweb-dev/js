import { concatHex } from "viem";
import { getFunctionSelector } from "./lib/getFunctionSelector.js";

import type {
  AbiFunction,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";

/**
 * Encodes an ABI function with its arguments into a hexadecimal string.
 *
 * @param abiFn - The ABI function object.
 * @param args - The arguments to be encoded.
 * @returns The encoded ABI function as a hexadecimal string.
 * @internal
 */
export function encodeAbiFunction<
  const TAbiFunction extends AbiFunction,
  const TParams = AbiParametersToPrimitiveTypes<TAbiFunction["inputs"]>,
>(
  abiFn: TAbiFunction,
  args: TParams extends readonly AbiParameter[] ? TParams : never,
) {
  const signature = getFunctionSelector(abiFn);
  // if there are no inputs, we can return the signature as is
  if (abiFn.inputs.length === 0) {
    return signature;
  }
  const data = encodeAbiParameters(abiFn.inputs, args ?? []);
  return concatHex([signature, data ?? "0x"]);
}

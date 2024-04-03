import type { AbiFunction } from "abitype";
import { decodeAbiParameters, type Hex } from "viem";

/**
 * Decodes the result of a function call based on the provided ABI function definition.
 * @param abiFn - The ABI function definition.
 * @param data - The encoded data to be decoded.
 * @returns The decoded result.
 * @internal
 */
export function decodeFunctionResult<const abiFn extends AbiFunction>(
  abiFn: abiFn,
  data: Hex,
) {
  return decodeAbiParameters<abiFn["outputs"]>(abiFn.outputs, data);
}

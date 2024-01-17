import type { AbiFunction } from "abitype";
import { decodeAbiParameters, type Hex } from "viem";

export function decodeFunctionResult<const abiFn extends AbiFunction>(
  abiFn: abiFn,
  data: Hex,
) {
  return decodeAbiParameters<abiFn["outputs"]>(abiFn.outputs, data);
}

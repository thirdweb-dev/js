import { concatHex, encodeAbiParameters } from "viem";
import { getFunctionSelector } from "./lib/getFunctionSelector.js";
import type { MethodType } from "./resolveAbiFunction.js";
import type { GetMethodInputs, ParseMethod } from "./types.js";

export function encodeAbiFunction<const method extends MethodType>(
  abiFn: ParseMethod<method>,
  args: GetMethodInputs<method>,
) {
  const signature = getFunctionSelector(abiFn);
  const data =
    "inputs" in abiFn && abiFn.inputs
      ? // @ts-expect-error - TODO: fix this
        encodeAbiParameters(abiFn.inputs, args ?? [])
      : undefined;
  return concatHex([signature, data ?? "0x"]);
}

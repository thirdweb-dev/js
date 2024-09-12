import type { Abi } from "abitype";

/**
 * Extra the function params from a contract's ABI
 * @param abi
 * @param functionName
 * @utils
 */
export function extractFunctionParamsFromAbi(abi: Abi, functionName: string) {
  for (const input of abi) {
    if (input.type === "function" && input.name === functionName) {
      return input.inputs || [];
    }
  }
  return [];
}

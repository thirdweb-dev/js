import { isHex, type Hex } from "../hex.js";

/**
 * Ensures that the given bytecode has the correct prefix.
 * If the bytecode already starts with "0x", it is returned as is.
 * Otherwise, the prefix "0x" is added to the bytecode.
 * @param bytecode - The bytecode to ensure the prefix for.
 * @returns The bytecode with the correct prefix.
 * @example
 * ```ts
 * import { ensureBytecodePrefix } from "thirdweb/utils/bytecode/prefix";
 * const bytecode = "363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3";
 * const prefixedBytecode = ensureBytecodePrefix(bytecode);
 * console.log(prefixedBytecode);
 * ```
 */
export function ensureBytecodePrefix(bytecode: string): Hex {
  if (isHex(bytecode, { strict: false })) {
    return bytecode;
  }
  return `0x${bytecode}`;
}

import type { Hex } from "viem";
import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import { keccackId } from "./keccack-id.js";

/**
 * Calculates the salt hash for a given bytecode.
 * @param bytecode - The bytecode to calculate the salt hash for.
 * @returns The salt hash of the bytecode.
 * @example
 * ```ts
 * import { getSaltHash } from "thirdweb";
 * const saltHash = getSaltHash(bytecode);
 * ```
 */
export function getSaltHash(bytecode: string): Hex {
  bytecode = ensureBytecodePrefix(bytecode);
  const bytecodeHash = keccackId(bytecode);
  const salt = `tw.${bytecodeHash}`;
  return keccackId(salt);
}

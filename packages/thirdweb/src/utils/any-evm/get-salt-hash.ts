import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import type { Hex } from "../encoding/hex.js";

import { keccakId } from "./keccak-id.js";

/**
 * Calculates the salt hash for a given bytecode.
 * @param bytecode - The bytecode to calculate the salt hash for.
 * @returns The salt hash of the bytecode.
 * @example
 * ```ts
 * import { getSaltHash } from "thirdweb";
 * const saltHash = getSaltHash(bytecode);
 * ```
 * @utils
 */
export function getSaltHash(bytecode: string): Hex {
  const bytecodeHash = keccakId(ensureBytecodePrefix(bytecode));
  const salt = `tw.${bytecodeHash}`;
  return keccakId(salt);
}

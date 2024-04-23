import { type Hex, encodePacked } from "viem";
import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import { uint8ArrayToHex } from "../encoding/hex.js";
import { getSaltHash } from "./get-salt-hash.js";
import { keccakId } from "./keccak-id.js";

type GetInitiBytecodeWithSaltOptions = {
  bytecode: string;
  encodedArgs: Hex | Uint8Array;
  salt?: string;
};

/**
 * Generates the initialization bytecode with salt for a contract deployment.
 * @param options - The options for generating the initialization bytecode.
 * @returns The initialization bytecode with salt.
 * @example
 * ```ts
 * import { getInitBytecodeWithSalt } from "thirdweb/utils";
 * const initBytecodeWithSalt = getInitBytecodeWithSalt({
 *  bytecode,
 *  encodedArgs,
 *  salt,
 * });
 * ```
 * @utils
 */
export function getInitBytecodeWithSalt(
  options: GetInitiBytecodeWithSaltOptions,
): Hex {
  const bytecode = ensureBytecodePrefix(options.bytecode);
  const saltHash = options.salt
    ? keccakId(options.salt)
    : getSaltHash(bytecode);

  const encodedArgs =
    typeof options.encodedArgs === "string"
      ? options.encodedArgs
      : uint8ArrayToHex(options.encodedArgs);

  return encodePacked(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, encodedArgs],
  );
}

import { encodePacked, type Hex } from "viem";
import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import { keccackId } from "./keccack-id.js";
import { getSaltHash } from "./get-salt-hash.js";
import { uint8ArrayToHex } from "../hex.js";

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
 */
export function getInitBytecodeWithSalt(
  options: GetInitiBytecodeWithSaltOptions,
): Hex {
  const bytecode = ensureBytecodePrefix(options.bytecode);
  const saltHash = options.salt
    ? keccackId(options.salt)
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

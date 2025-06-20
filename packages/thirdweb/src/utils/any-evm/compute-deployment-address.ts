import { encodePacked, type Hex } from "viem";
import { getAddress } from "../address.js";
import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import { isHex } from "../encoding/hex.js";
import { keccak256 } from "../hashing/keccak256.js";
import { getSaltHash } from "./get-salt-hash.js";
import { keccakId } from "./keccak-id.js";

type ComputeDeploymentAddressOptions = {
  bytecode: string;
  encodedArgs: Hex;
  create2FactoryAddress: string;
  salt?: string;
  extraDataWithUri?: Hex;
};

/**
 * Computes the deployment address for a contract based on the given options.
 * @param options - The options for computing the deployment address.
 * @returns The computed deployment address.
 * @example
 * ```ts
 * import { computeDeploymentAddress } from "thirdweb/utils";
 * const deploymentAddress = computeDeploymentAddress({
 *  bytecode,
 *  encodedArgs,
 *  create2FactoryAddress,
 *  salt,
 * });
 * ```
 * @utils
 */
export function computeDeploymentAddress(
  options: ComputeDeploymentAddressOptions,
) {
  const bytecode = ensureBytecodePrefix(options.bytecode);
  const saltHash = options.salt
    ? isHex(options.salt) && options.salt.length === 66
      ? options.salt
      : keccakId(options.salt)
    : getSaltHash(bytecode);

  // 1. create init bytecode hash with contract's bytecode and encoded args
  const initBytecode = options.extraDataWithUri
    ? encodePacked(
        ["bytes", "bytes", "bytes"],
        [bytecode, options.encodedArgs, options.extraDataWithUri],
      )
    : encodePacked(["bytes", "bytes"], [bytecode, options.encodedArgs]);

  // 2. abi-encode pack the deployer address, salt, and bytecode hash
  const deployInfoPacked = encodePacked(
    ["bytes1", "address", "bytes32", "bytes32"],
    [
      "0xff",
      getAddress(options.create2FactoryAddress),
      saltHash,
      keccak256(encodePacked(["bytes"], [initBytecode])),
    ],
  );

  // 3. hash the packed deploy info
  const hashedDeployInfo = keccak256(
    encodePacked(["bytes"], [deployInfoPacked]),
  );

  // 4. return last 20 bytes (40 characters) of the hash -- this is the predicted address
  return `0x${hashedDeployInfo.slice(26)}`;
}

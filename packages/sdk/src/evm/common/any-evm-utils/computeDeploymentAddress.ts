import { type BytesLike, utils } from "ethers";
import { getSaltHash } from "./getSaltHash";

/**
 * Pre-compute a contract's deployment address for a CREATE2 deployment.
 *
 * @public
 * @param bytecode - Creation bytecode of the contract to deploy
 * @param encodedArgs - Abi-encoded constructor params
 * @param create2FactoryAddress - The create2 factory address to use
 */
export function computeDeploymentAddress(
  bytecode: string,
  encodedArgs: BytesLike,
  create2FactoryAddress: string,
  salt?: string,
): string {
  const bytecodePrefixed = bytecode.startsWith("0x")
    ? bytecode
    : `0x${bytecode}`;
  const saltHash = salt ? utils.id(salt) : getSaltHash(bytecodePrefixed);

  // 1. create init bytecode hash with contract's bytecode and encoded args
  const initBytecode = utils.solidityPack(
    ["bytes", "bytes"],
    [bytecodePrefixed, encodedArgs],
  );

  // 2. abi-encode pack the deployer address, salt, and bytecode hash
  const deployInfoPacked = utils.solidityPack(
    ["bytes1", "address", "bytes32", "bytes32"],
    [
      "0xff",
      create2FactoryAddress,
      saltHash,
      utils.solidityKeccak256(["bytes"], [initBytecode]),
    ],
  );

  // 3. hash the packed deploy info
  const hashedDeployInfo = utils.solidityKeccak256(
    ["bytes"],
    [deployInfoPacked],
  );

  // 4. return last 20 bytes (40 characters) of the hash -- this is the predicted address
  return `0x${hashedDeployInfo.slice(26)}`;
}

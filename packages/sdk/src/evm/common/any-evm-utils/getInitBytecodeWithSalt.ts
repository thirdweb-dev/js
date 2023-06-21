import { type BytesLike, utils } from "ethers";
import { getSaltHash } from "./getSaltHash";

/**
 *
 * Construct init-bytecode, packed with salthash.
 * This hex data is intended to be sent to the CREATE2 factory address
 *
 * @internal
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 */
export function getInitBytecodeWithSalt(
  bytecode: string,
  encodedArgs: BytesLike,
  salt?: string,
): string {
  const saltHash = salt ? utils.id(salt) : getSaltHash(bytecode);

  const initBytecodeWithSalt = utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, encodedArgs],
  );

  return initBytecodeWithSalt;
}

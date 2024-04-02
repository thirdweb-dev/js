import { type BytesLike, utils } from "ethers";
import { create2Address, hashBytecode } from "zksync-ethers/build/utils";

/**
 * Pre-compute a contract's deployment address for a CREATE2 deployment.
 *
 * @public
 * @param bytecode - Creation bytecode of the contract to deploy
 * @param encodedArgs - Abi-encoded constructor params
 * @param create2FactoryAddress - The create2 factory address to use
 */
export function zkComputeDeploymentAddress(
  bytecode: string,
  encodedArgs: BytesLike,
  create2FactoryAddress: string,
  salt?: string,
): string {
  const bytecodePrefixed = bytecode.startsWith("0x")
    ? bytecode
    : `0x${bytecode}`;
  const saltHash = salt ? utils.id(salt) : utils.id("thirdweb");

  const bytecodeHash = utils.hexlify(hashBytecode(bytecodePrefixed));

  const addr = create2Address(
    create2FactoryAddress,
    bytecodeHash,
    saltHash,
    encodedArgs,
  );

  return addr;
}

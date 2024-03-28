import {
  BigNumber,
  type BytesLike,
  type PopulatedTransaction,
  type Signer,
} from "ethers";
import invariant from "tiny-invariant";
import type { DeployOptions } from "../../types/deploy/deploy-options";
import { isContractDeployed } from "./isContractDeployed";
import { getInitBytecodeWithSalt } from "./getInitBytecodeWithSalt";

/**
 * Deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address.
 *
 * @internal
 *
 * @param signer - The signer to use
 * @param bytecode - The bytecode to deploy
 * @param encodedArgs - The encoded constructor args to use
 * @param create2FactoryAddress - The create2 factory address to use
 */
export async function deployContractDeterministicRaw(
  signer: Signer,
  bytecode: string,
  encodedArgs: BytesLike,
  create2FactoryAddress: string,
  options?: DeployOptions,
  predictedAddress?: string,
  gasLimit: number = 7000000,
) {
  // Check if the implementation contract is already deployed
  invariant(signer.provider, "Provider required");
  const contractDeployed = predictedAddress
    ? await isContractDeployed(predictedAddress, signer.provider)
    : false;

  if (!contractDeployed) {
    console.debug(
      `deploying contract via create2 factory at: ${predictedAddress}`,
    );
    const initBytecodeWithSalt = getInitBytecodeWithSalt(bytecode, encodedArgs);

    const tx: PopulatedTransaction = {
      to: create2FactoryAddress,
      data: initBytecodeWithSalt,
    };

    try {
      await signer.estimateGas(tx);
    } catch (e) {
      console.debug("error estimating gas while deploying prebuilt: ", e);
      tx.gasLimit = BigNumber.from(gasLimit);
    }
    await (await signer.sendTransaction(tx)).wait();
  }
}

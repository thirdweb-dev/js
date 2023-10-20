import { BigNumber, type PopulatedTransaction, type Signer } from "ethers";
import invariant from "tiny-invariant";
import { PrecomputedDeploymentTransaction } from "../../types/any-evm/deploy-data";
import type { DeployOptions } from "../../types/deploy/deploy-options";
import { isContractDeployed } from "./isContractDeployed";

/**
 * Deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address.
 *
 * @public
 *
 * @param signer
 * @param bytecode
 * @param encodedArgs
 * @param create2FactoryAddress
 */
export async function deployContractDeterministic(
  signer: Signer,
  transaction: PrecomputedDeploymentTransaction,
  options?: DeployOptions,
  gasLimit: number = 7000000,
) {
  // Check if the implementation contract is already deployed
  invariant(signer.provider, "Provider required");
  const contractDeployed = await isContractDeployed(
    transaction.predictedAddress,
    signer.provider,
  );

  if (!contractDeployed) {
    console.debug(
      `deploying contract via create2 factory at: ${transaction.predictedAddress}`,
    );

    const tx: PopulatedTransaction = {
      to: transaction.to,
      data: transaction.data,
    };

    try {
      await signer.estimateGas(tx);
    } catch (e) {
      console.debug("error estimating gas while deploying prebuilt: ", e);
      tx.gasLimit = BigNumber.from(gasLimit);
    }
    options?.notifier?.("deploying", "preset");
    await (await signer.sendTransaction(tx)).wait();
    options?.notifier?.("deployed", "preset");
  }
}

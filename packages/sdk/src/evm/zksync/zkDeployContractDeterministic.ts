import { BigNumber, utils, type PopulatedTransaction } from "ethers";
import invariant from "tiny-invariant";

import { isZkContractDeployed } from "./isZkContractDeployed";
import { Contract, Signer } from "zksync-web3";
import { DeployOptions } from "../types/deploy/deploy-options";

/**
 * Deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address.
 *
 * @public
 *
 * @param signer - The signer to use
 * @param bytecode - The bytecode to deploy
 * @param encodedArgs - The encoded constructor args to use
 * @param create2FactoryAddress - The create2 factory address to use
 */
export async function zkDeployContractDeterministic(
  signer: Signer,
  transaction: any,
  options?: DeployOptions,
  gasLimit: number = 7000000,
) {
  // Check if the implementation contract is already deployed
  invariant(signer.provider, "Provider required");
  const contractDeployed = await isZkContractDeployed(
    transaction.predictedAddress,
    signer.provider,
  );

  if (!contractDeployed) {
    console.debug(
      `deploying contract via create2 factory at: ${transaction.predictedAddress}`,
    );

    const tx: any = {
      to: transaction.to,
      data: transaction.data,
    };

    const singletonAbi = [
      "function deploy(bytes32,bytes32,bytes) external payable",
    ];

    const singleton = new Contract(
      transaction.to || "0xa51baf6a9c0ef5Db8C1898d5aDD92Bf3227d6088",
      singletonAbi,
      signer,
    );

    const deployTx = await singleton.deploy(
      utils.id("thirdweb"),
      transaction.bytecodeHash,
      transaction.constructorCalldata,
    );

    // try {
    //   await signer.estimateGas(tx);
    // } catch (e) {
    //   console.debug("error estimating gas while deploying prebuilt: ", e);
    //   tx.gasLimit = BigNumber.from(gasLimit);
    // }
    // options?.notifier?.("deploying", "preset");
    // await (await signer.sendTransaction(tx)).wait();
    // options?.notifier?.("deployed", "preset");
  }
}

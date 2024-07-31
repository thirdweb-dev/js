import { Signer } from "ethers";
import invariant from "tiny-invariant";
import type { DeployOptions } from "../../types/deploy/deploy-options";
import { computeCreate2FactoryTransaction } from "./getCreate2FactoryAddress";

/**
 * Deploy Nick's Create2 factory on a given network.
 * Deployment is keyless. Signer is needed to fund the keyless signer address.
 * Ref: https://github.com/Arachnid/deterministic-deployment-proxy
 *
 * @deploy
 * @public
 * @param signer - The signer to use
 */
export async function deployCreate2Factory(
  signer: Signer,
  options?: DeployOptions,
): Promise<string> {
  invariant(signer.provider, "No provider");
  const deploymentInfo = await computeCreate2FactoryTransaction(
    signer.provider,
  );

  if (deploymentInfo.transaction.length > 0) {
    // send balance to the keyless signer
    if (
      (await signer.provider.getBalance(deploymentInfo.signer)).lt(
        deploymentInfo.valueToSend,
      )
    ) {
      await (
        await signer.sendTransaction({
          to: deploymentInfo.signer,
          value: deploymentInfo.valueToSend,
        })
      ).wait();
    }

    // deploy
    try {
      console.debug(
        `deploying CREATE2 factory at: ${deploymentInfo.deployment}`,
      );

      options?.notifier?.("deploying", "create2Factory");
      await (
        await signer.provider.sendTransaction(deploymentInfo.transaction)
      ).wait();
      options?.notifier?.("deployed", "create2Factory");
    } catch (err: any) {
      throw new Error(
        `Couldn't deploy CREATE2 factory: ${JSON.stringify(err)}`,
      );
    }
  }

  return deploymentInfo.deployment;
}

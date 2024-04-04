import { BigNumber, Signer } from "ethers";
import invariant from "tiny-invariant";
import type { DeployOptions } from "../../types/deploy/deploy-options";
import { CUSTOM_GAS_BINS, CUSTOM_GAS_FOR_CHAIN } from "../any-evm-constants";
import { COMMON_FACTORY } from "./constants";
import { isContractDeployed } from "./isContractDeployed";
import { isEIP155Enforced } from "./isEIP155Enforced";
import { getCreate2FactoryDeploymentInfo } from "./getCreate2FactoryDeploymentInfo";

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
  let factoryExists = await isContractDeployed(COMMON_FACTORY, signer.provider);
  if (factoryExists) {
    return COMMON_FACTORY;
  }

  const enforceEip155 = await isEIP155Enforced(signer.provider);
  const networkId = (await signer.provider.getNetwork()).chainId;
  const chainId = enforceEip155 ? networkId : 0;
  console.debug(`ChainId ${networkId} enforces EIP155: ${enforceEip155}`);
  let deploymentInfo = CUSTOM_GAS_FOR_CHAIN[networkId]
    ? getCreate2FactoryDeploymentInfo(chainId, {
        gasPrice: CUSTOM_GAS_FOR_CHAIN[networkId].gasPrice,
        gasLimit: CUSTOM_GAS_FOR_CHAIN[networkId].gasLimit,
      })
    : getCreate2FactoryDeploymentInfo(chainId, {});

  factoryExists = await isContractDeployed(
    deploymentInfo.deployment,
    signer.provider,
  );

  // deploy community factory if not already deployed
  let bin;
  if (!factoryExists) {
    const gasPriceFetched = (await signer.provider.getGasPrice()).toBigInt();
    bin = CUSTOM_GAS_BINS.find((e) => e >= gasPriceFetched) || gasPriceFetched;

    deploymentInfo = getCreate2FactoryDeploymentInfo(chainId, {
      gasPrice: bin,
    });
    factoryExists = await isContractDeployed(
      deploymentInfo.deployment,
      signer.provider,
    );
  }

  if (!factoryExists) {
    // send balance to the keyless signer
    const valueToSend = BigNumber.from(bin).mul(100_000n);

    if (
      (await signer.provider.getBalance(deploymentInfo.signer)).lt(valueToSend)
    ) {
      await (
        await signer.sendTransaction({
          to: deploymentInfo.signer,
          value: valueToSend,
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

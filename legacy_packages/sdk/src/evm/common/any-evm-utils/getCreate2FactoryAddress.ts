import { providers } from "ethers";
import { CUSTOM_GAS_BINS, CUSTOM_GAS_FOR_CHAIN } from "../any-evm-constants";
import { COMMON_FACTORY } from "./constants";
import { isContractDeployed } from "./isContractDeployed";
import { isEIP155Enforced } from "./isEIP155Enforced";
import { getCreate2FactoryDeploymentInfo } from "./getCreate2FactoryDeploymentInfo";

/**
 * Get the CREATE2 Factory address for a network
 * Source code of the factory:
 * https://github.com/Arachnid/deterministic-deployment-proxy/blob/master/source/deterministic-deployment-proxy.yul
 *
 * @internal
 * @param provider - The provider to use
 */
export async function getCreate2FactoryAddress(
  provider: providers.Provider,
): Promise<string> {
  let factoryExists = await isContractDeployed(COMMON_FACTORY, provider);
  if (factoryExists) {
    return COMMON_FACTORY;
  }

  const enforceEip155 = await isEIP155Enforced(provider);
  const networkId = (await provider.getNetwork()).chainId;
  const chainId = enforceEip155 ? networkId : 0;
  let deploymentInfo = CUSTOM_GAS_FOR_CHAIN[networkId]
    ? getCreate2FactoryDeploymentInfo(chainId, {
        gasPrice: CUSTOM_GAS_FOR_CHAIN[networkId].gasPrice,
        gasLimit: CUSTOM_GAS_FOR_CHAIN[networkId].gasLimit,
      })
    : getCreate2FactoryDeploymentInfo(chainId, {});

  factoryExists = await isContractDeployed(deploymentInfo.deployment, provider);

  let bin;
  if (!factoryExists) {
    const gasPriceFetched = (await provider.getGasPrice()).toBigInt();
    bin = CUSTOM_GAS_BINS.find((e) => e >= gasPriceFetched) || gasPriceFetched;

    deploymentInfo = getCreate2FactoryDeploymentInfo(chainId, {
      gasPrice: bin,
    });
  }

  return deploymentInfo.deployment;
}

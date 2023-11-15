import { providers } from "ethers";
import { CUSTOM_GAS_FOR_CHAIN } from "../any-evm-constants";
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
  const commonFactoryExists = await isContractDeployed(
    COMMON_FACTORY,
    provider,
  );
  if (commonFactoryExists) {
    return COMMON_FACTORY;
  }

  const enforceEip155 = await isEIP155Enforced(provider);
  const networkId = (await provider.getNetwork()).chainId;
  const chainId = enforceEip155 ? networkId : 0;
  const deploymentInfo = CUSTOM_GAS_FOR_CHAIN[networkId]
    ? getCreate2FactoryDeploymentInfo(chainId, {
        gasPrice: CUSTOM_GAS_FOR_CHAIN[networkId].gasPrice,
        gasLimit: CUSTOM_GAS_FOR_CHAIN[networkId].gasLimit,
      })
    : getCreate2FactoryDeploymentInfo(chainId, {});

  return deploymentInfo.deployment;
}

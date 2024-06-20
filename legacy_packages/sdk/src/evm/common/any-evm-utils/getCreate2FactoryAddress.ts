import { BigNumber, providers } from "ethers";
import { CUSTOM_GAS_BINS, CUSTOM_GAS_FOR_CHAIN } from "../any-evm-constants";
import { COMMON_FACTORY } from "./constants";
import { isContractDeployed } from "./isContractDeployed";
import { isEIP155Enforced } from "./isEIP155Enforced";
import { getCreate2FactoryDeploymentInfo } from "./getCreate2FactoryDeploymentInfo";
import { KeylessDeploymentInfo } from "../../types/any-evm/deploy-data";

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
  const deploymentInfo = await computeCreate2FactoryTransaction(provider);
  return deploymentInfo.deployment;
}

/**
 * @internal
 */
export async function computeCreate2FactoryTransaction(
  provider: providers.Provider,
): Promise<KeylessDeploymentInfo> {
  const networkId = (await provider.getNetwork()).chainId;

  // special handling for chains with hardcoded gasPrice and gasLimit
  if (CUSTOM_GAS_FOR_CHAIN[networkId]) {
    const enforceEip155 = await isEIP155Enforced(provider);
    const chainId = enforceEip155 ? networkId : 0;
    const gasPrice = CUSTOM_GAS_FOR_CHAIN[networkId]?.gasPrice;
    const gasLimit = CUSTOM_GAS_FOR_CHAIN[networkId]?.gasLimit;

    const deploymentInfo = getCreate2FactoryDeploymentInfo(chainId, {
      gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
      gasLimit: gasLimit ? BigNumber.from(gasLimit) : undefined,
    });

    if (await isContractDeployed(deploymentInfo.deployment, provider)) {
      deploymentInfo.transaction = "";
    }

    return deploymentInfo;
  }

  // default flow
  const allBinsInfo = [
    ...CUSTOM_GAS_BINS.map((b) =>
      // to generate EIP-155 transaction
      getCreate2FactoryDeploymentInfo(networkId, {
        gasPrice: BigNumber.from(b),
      }),
    ),
    // to generate pre-EIP-155 transaction, hence chainId 0
    ...CUSTOM_GAS_BINS.map((b) =>
      getCreate2FactoryDeploymentInfo(0, { gasPrice: BigNumber.from(b) }),
    ),
  ];

  const allFactories = await Promise.all(
    allBinsInfo.map((b) => isContractDeployed(b.deployment, provider)),
  );

  const indexOfCommonFactory = allBinsInfo.findIndex(
    (b) => b.deployment === COMMON_FACTORY,
  );
  if (indexOfCommonFactory && allFactories[indexOfCommonFactory]) {
    return { ...allBinsInfo[indexOfCommonFactory], transaction: "" };
  }

  const indexOfExistingDeployment = allFactories.findIndex((b) => b);
  if (indexOfExistingDeployment && allBinsInfo[indexOfExistingDeployment]) {
    return { ...allBinsInfo[indexOfExistingDeployment], transaction: "" };
  }

  const [enforceEip155, gasPriceFetched] = await Promise.all([
    isEIP155Enforced(provider),
    provider.getGasPrice(),
  ]);
  const chainId = enforceEip155 ? networkId : 0;
  const bin = _getNearestGasPriceBin(gasPriceFetched);

  return getCreate2FactoryDeploymentInfo(chainId, {
    gasPrice: bin,
  });
}

function _getNearestGasPriceBin(gasPrice: BigNumber): BigNumber {
  const bin = CUSTOM_GAS_BINS.find((e) => BigNumber.from(e).gte(gasPrice));
  return bin ? BigNumber.from(bin) : gasPrice;
}

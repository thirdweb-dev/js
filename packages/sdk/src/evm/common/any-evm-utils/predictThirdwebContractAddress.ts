import { ThirdwebStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";
import { getChainProvider } from "../../constants/urls";
import { fetchAndCachePublishedContractURI } from "./fetchAndCachePublishedContractURI";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { computeDeploymentInfo } from "./computeDeploymentInfo";
import { getDeploymentInfo } from "./getDeploymentInfo";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";

/**
 *
 * @public
 * @param contractName
 * @param chainId
 * @param storage
 */
export async function predictThirdwebContractAddress(
  contractName: string,
  chainId: number,
  storage: ThirdwebStorage,
  clientId?: string,
  secretKey?: string,
): Promise<string> {
  const provider = getChainProvider(chainId, {
    clientId,
    secretKey,
  });
  const publishUri = await fetchAndCachePublishedContractURI(contractName);
  const create2Factory = await getCreate2FactoryAddress(provider);
  invariant(create2Factory, "Thirdweb stack not found");

  const { extendedMetadata } = await fetchAndCacheDeployMetadata(
    publishUri,
    storage,
  );

  if (
    extendedMetadata?.routerType === "plugin" ||
    extendedMetadata?.routerType === "dynamic"
  ) {
    const deploymentInfo = await getDeploymentInfo(
      publishUri,
      storage,
      provider,
      create2Factory,
      { clientId, secretKey },
    );

    const implementation = deploymentInfo.find(
      (contract) => contract.type === "implementation",
    )?.transaction.predictedAddress;
    invariant(implementation, "Error computing address for plugin router");

    return implementation;
  }

  const implementation = await computeDeploymentInfo(
    "implementation",
    provider,
    storage,
    create2Factory,
    { contractName: contractName },
  );

  return implementation.transaction.predictedAddress;
}

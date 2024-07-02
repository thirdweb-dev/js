import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import {
  ConstructorParamMap,
  DeploymentPreset,
} from "../../types/any-evm/deploy-data";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { caches } from "./caches";
import { computeDeploymentInfo } from "./computeDeploymentInfo";
import { fetchPublishedContractFromPolygon } from "./fetchPublishedContractFromPolygon";
/**
 *
 * Returns txn data for keyless deploys as well as signer deploys.
 * Also provides a list of infra contracts to deploy.
 *
 * @internal
 *
 * @param metadataUri - The metadata uri to use
 * @param storage - The storage to use
 * @param provider - The provider to use
 * @param create2Factory - The create2 factory to use
 */
export async function getModularDeploymentInfo(
  metadataUri: string,
  storage: ThirdwebStorage,
  provider: providers.Provider,
  create2Factory?: string,
  clientId?: string,
  secretKey?: string
): Promise<DeploymentPreset[]> {
  caches.deploymentPresets = {};
  const [create2FactoryAddress, { compilerMetadata, extendedMetadata }] =
    await Promise.all([
      create2Factory ? create2Factory : getCreate2FactoryAddress(provider),
      fetchAndCacheDeployMetadata(metadataUri, storage),
    ]);
  const customParams: ConstructorParamMap = {};
  const finalDeploymentInfo: DeploymentPreset[] = [];
  const defaultExtensions = extendedMetadata?.defaultExtensions;

  // get clone factory
  const factoryInfo = await computeDeploymentInfo(
    "infra",
    provider,
    storage,
    create2FactoryAddress,
    { contractName: "TWCloneFactory" },
    clientId,
    secretKey
  );
  finalDeploymentInfo.push(factoryInfo);

  if (defaultExtensions) {
    const publishedExtensions = await Promise.all(
      defaultExtensions.map((e) => {
        return fetchPublishedContractFromPolygon(
          e.publisherAddress,
          e.extensionName,
          e.extensionVersion,
          storage,
          clientId,
          secretKey
        );
      })
    );
    const extensionMetadata = await Promise.all(
      publishedExtensions.map((e) =>
        fetchAndCacheDeployMetadata(e.metadataUri, storage)
      )
    );

    // computeDeploymentInfo for extension impl -> push into finalDeploymentInfo
    const extensionDeploymentInfo = await Promise.all(
      extensionMetadata.map((m) =>
        computeDeploymentInfo(
          "extension",
          provider,
          storage,
          create2FactoryAddress,
          { metadata: m.compilerMetadata },
          clientId,
          secretKey
        )
      )
    );
    finalDeploymentInfo.push(...extensionDeploymentInfo);
  }

  const implementationDeployInfo = await computeDeploymentInfo(
    "implementation",
    provider,
    storage,
    create2FactoryAddress,
    {
      metadata: compilerMetadata,
      constructorParams: customParams,
    },
    clientId,
    secretKey
  );

  finalDeploymentInfo.push(...Object.values(caches.deploymentPresets));
  finalDeploymentInfo.push(implementationDeployInfo);

  return finalDeploymentInfo;
}

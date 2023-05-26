import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import {
  ConstructorParamMap,
  DeploymentPreset,
} from "../../types/any-evm/deploy-data";
import { generatePluginFunctions, getMetadataForPlugins } from "../plugin";
import { Plugin } from "../../types/plugins";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { caches } from "./caches";
import { computeDeploymentInfo } from "./computeDeploymentInfo";
/**
 *
 * Returns txn data for keyless deploys as well as signer deploys.
 * Also provides a list of infra contracts to deploy.
 *
 * @internal
 *
 * @param metadataUri
 * @param storage
 * @param provider
 * @param create2Factory
 */
export async function getDeploymentInfo(
  metadataUri: string,
  storage: ThirdwebStorage,
  provider: providers.Provider,
  create2Factory?: string,
): Promise<DeploymentPreset[]> {
  caches.deploymentPresets = {};

  const create2FactoryAddress = create2Factory
    ? create2Factory
    : await getCreate2FactoryAddress(provider);

  const customParams: ConstructorParamMap = {};
  const finalDeploymentInfo: DeploymentPreset[] = [];
  const { compilerMetadata } = await fetchAndCacheDeployMetadata(
    metadataUri,
    storage,
  );
  const pluginMetadata = await getMetadataForPlugins(metadataUri, storage);

  // if pluginMetadata is not empty, then it's a plugin-pattern router contract
  if (pluginMetadata.length > 0) {
    // get deployment info for all plugins
    const pluginDeploymentInfo = await Promise.all(
      pluginMetadata.map(async (metadata) => {
        const info = await computeDeploymentInfo(
          "plugin",
          provider,
          storage,
          create2FactoryAddress,
          { metadata: metadata },
        );
        return info;
      }),
    );

    // create constructor param input for PluginMap
    const mapInput: Plugin[] = [];
    pluginMetadata.forEach((metadata, index) => {
      const input = generatePluginFunctions(
        pluginDeploymentInfo[index].transaction.predictedAddress,
        metadata.abi,
      );
      mapInput.push(...input);
    });

    // get PluginMap deployment transaction
    const pluginMapTransaction = await computeDeploymentInfo(
      "plugin",
      provider,
      storage,
      create2FactoryAddress,
      {
        contractName: "PluginMap",
        constructorParams: { _pluginsToAdd: { value: mapInput } },
      },
    );

    // address of PluginMap is input for MarketplaceV3's constructor
    customParams["_pluginMap"] = {
      value: pluginMapTransaction.transaction.predictedAddress,
    };

    finalDeploymentInfo.push(...pluginDeploymentInfo, pluginMapTransaction);
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
  );

  // get clone factory
  const factoryInfo = await computeDeploymentInfo(
    "infra",
    provider,
    storage,
    create2FactoryAddress,
    { contractName: "TWCloneFactory" },
  );

  finalDeploymentInfo.push(factoryInfo);
  finalDeploymentInfo.push(...Object.values(caches.deploymentPresets));
  finalDeploymentInfo.push(implementationDeployInfo);

  return finalDeploymentInfo;
}

import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import {
  ConstructorParamMap,
  DeploymentPreset,
} from "../../types/any-evm/deploy-data";
import { Plugin } from "../../types/plugins";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { caches } from "./caches";
import { computeDeploymentInfo } from "./computeDeploymentInfo";
import {
  generateExtensionFunctions,
  generatePluginFunctions,
} from "../plugin/generatePluginFunctions";
import { Extension } from "../../types/extensions";
import { fetchPublishedContractFromPolygon } from "./fetchPublishedContractFromPolygon";
import invariant from "tiny-invariant";
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
export async function getDeploymentInfo(
  metadataUri: string,
  storage: ThirdwebStorage,
  provider: providers.Provider,
  create2Factory?: string,
  clientId?: string,
  secretKey?: string,
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

  if (extendedMetadata?.routerType === "plugin" && defaultExtensions) {
    invariant(clientId || secretKey, "Require Client Id / Secret Key");
    const publishedExtensions = await Promise.all(
      defaultExtensions.map((e) => {
        return fetchPublishedContractFromPolygon(
          e.publisherAddress,
          e.extensionName,
          e.extensionVersion,
          storage,
          clientId,
          secretKey,
        );
      }),
    );

    const pluginMetadata = (
      await Promise.all(
        publishedExtensions.map((c) =>
          fetchAndCacheDeployMetadata(c.metadataUri, storage),
        ),
      )
    ).map((fetchedMetadata) => fetchedMetadata.compilerMetadata);

    // get deployment info for all plugins
    const pluginDeploymentInfo = await Promise.all(
      pluginMetadata.map((metadata) =>
        computeDeploymentInfo(
          "plugin",
          provider,
          storage,
          create2FactoryAddress,
          { metadata: metadata },
          clientId,
          secretKey,
        ),
      ),
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
      clientId,
      secretKey,
    );

    // address of PluginMap is input for MarketplaceV3's constructor
    customParams["_pluginMap"] = {
      value: pluginMapTransaction.transaction.predictedAddress,
    };

    finalDeploymentInfo.push(...pluginDeploymentInfo, pluginMapTransaction);
  } else if (extendedMetadata?.routerType === "dynamic" && defaultExtensions) {
    invariant(clientId || secretKey, "Require Client Id / Secret Key");
    const publishedExtensions = await Promise.all(
      defaultExtensions.map((e) => {
        return fetchPublishedContractFromPolygon(
          e.publisherAddress,
          e.extensionName,
          e.extensionVersion,
          storage,
          clientId,
          secretKey,
        );
      }),
    );

    const extensionMetadata = (
      await Promise.all(
        publishedExtensions.map(async (c) => {
          return fetchAndCacheDeployMetadata(c.metadataUri, storage);
        }),
      )
    ).map((fetchedMetadata) => fetchedMetadata.compilerMetadata);

    // get deployment info for all extensions
    const extensionDeploymentInfo = await Promise.all(
      extensionMetadata.map((metadata) =>
        computeDeploymentInfo(
          "extension",
          provider,
          storage,
          create2FactoryAddress,
          { metadata: metadata },
          clientId,
          secretKey,
        ),
      ),
    );

    // create constructor param input for BaseRouter
    const routerInput: Extension[] = [];
    extensionMetadata.forEach((metadata, index) => {
      const extensionFunctions = generateExtensionFunctions(metadata.abi);
      routerInput.push({
        metadata: {
          name: metadata.name,
          metadataURI: "",
          implementation:
            extensionDeploymentInfo[index].transaction.predictedAddress,
        },
        functions: extensionFunctions,
      });
    });

    // routerInput as constructor param for BaseRouter
    customParams["_extensions"] = {
      value: routerInput,
    };

    finalDeploymentInfo.push(...extensionDeploymentInfo);
  }

  const [implementationDeployInfo, factoryInfo] = await Promise.all([
    computeDeploymentInfo(
      "implementation",
      provider,
      storage,
      create2FactoryAddress,
      {
        metadata: compilerMetadata,
        constructorParams: customParams,
      },
      clientId,
      secretKey,
    ),
    // get clone factory
    computeDeploymentInfo(
      "infra",
      provider,
      storage,
      create2FactoryAddress,
      { contractName: "TWCloneFactory" },
      clientId,
      secretKey,
    ),
  ]);

  finalDeploymentInfo.push(factoryInfo);
  finalDeploymentInfo.push(...Object.values(caches.deploymentPresets));
  finalDeploymentInfo.push(implementationDeployInfo);

  return finalDeploymentInfo;
}

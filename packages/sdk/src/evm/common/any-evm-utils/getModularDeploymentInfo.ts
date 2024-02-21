import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import {
  ConstructorParamMap,
  DeploymentPreset,
  HookOptions,
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
import { extractConstructorParamsFromAbi } from "../feature-detection/extractConstructorParamsFromAbi";
import { isAddress } from "ethers/lib/utils";
import { computeHookProxyAddress } from "./computeHookProxyAddress";
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
  secretKey?: string,
  hooks?: HookOptions[],
): Promise<DeploymentPreset[]> {
  caches.deploymentPresets = {};
  const [create2FactoryAddress, { compilerMetadata, extendedMetadata }] =
    await Promise.all([
      create2Factory ? create2Factory : getCreate2FactoryAddress(provider),
      fetchAndCacheDeployMetadata(metadataUri, storage),
    ]);
  const customParams: ConstructorParamMap = {};
  const finalDeploymentInfo: DeploymentPreset[] = [];

  // get modular factory
  const factoryInfo = await computeDeploymentInfo(
    "infra",
    provider,
    storage,
    create2FactoryAddress,
    { contractName: "CloneFactory" },
    clientId,
    secretKey,
  );
  finalDeploymentInfo.push(factoryInfo);

  if (hooks) {
    const hookAddresses = hooks.filter((h) => isAddress(h.extensionName));
    const publishedHooks = hooks.filter((h) => !isAddress(h.extensionName));
    const publishedHooksFetched = await Promise.all(
      publishedHooks.map((h) => {
        invariant(h.publisherAddress, "Require publisher address");
        return fetchPublishedContractFromPolygon(
          h.publisherAddress,
          h.extensionName,
          h.extensionVersion, // TODO: get oldest version
          storage,
          clientId,
          secretKey,
        );
      }),
    );
    const publishedHooksMetadata = await Promise.all(
      publishedHooksFetched.map((h) =>
        fetchAndCacheDeployMetadata(h.metadataUri, storage),
      ),
    );

    // computeDeploymentInfo for hook impl -> push into finalDeploymentInfo
    const hookImplDeployInfo = await Promise.all(
      publishedHooksMetadata.map((m) =>
        computeDeploymentInfo(
          "hookImpl",
          provider,
          storage,
          create2FactoryAddress,
          { metadata: m.compilerMetadata },
          clientId,
          secretKey,
        ),
      ),
    );
    finalDeploymentInfo.push(...hookImplDeployInfo);

    // with address of impl and factory above -> computeDeploymentInfo for hook proxy -> push into finalDeploymentInfo
    const hookAddressesComputed = hookImplDeployInfo.map((h, i) => {
      const proxy = computeHookProxyAddress(
        h.transaction.predictedAddress,
        factoryInfo.transaction.predictedAddress,
      );

      finalDeploymentInfo.push({
        type: "hookProxy",
        transaction: { predictedAddress: "", to: "", data: "" }, // empty transaction because we'll deploy ERC1967 proxy through a factory
        hooks: {
          impl: h.transaction.predictedAddress,
          proxy: proxy,
          admin: publishedHooks[i].publisherAddress as string,
        },
      });

      return proxy;
    });

    hookAddresses.forEach((h) => {
      finalDeploymentInfo.push({
        type: "hookProxy",
        transaction: { predictedAddress: "", to: "", data: "" }, // empty transaction because we'll deploy ERC1967 proxy through a factory
        hooks: {
          impl: "",
          proxy: h.extensionName,
          admin: "",
        },
      });
    });
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
    secretKey,
  );

  finalDeploymentInfo.push(...Object.values(caches.deploymentPresets));
  finalDeploymentInfo.push(implementationDeployInfo);

  return finalDeploymentInfo;
}

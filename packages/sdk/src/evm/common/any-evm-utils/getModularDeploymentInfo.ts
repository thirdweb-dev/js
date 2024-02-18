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
import { extractConstructorParamsFromAbi } from "../feature-detection/extractConstructorParamsFromAbi";
import { isAddress } from "ethers/lib/utils";
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
  constructorParamValues: any[],
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

  // get modular factory
  const factoryInfo = await computeDeploymentInfo(
    "infra",
    provider,
    storage,
    create2FactoryAddress,
    { contractName: "ModularFactory" },
    clientId,
    secretKey,
  );
  finalDeploymentInfo.push(factoryInfo);

  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );

  const hooksParamName =
    extendedMetadata?.factoryDeploymentData?.modularFactoryInput
      ?.hooksParamName;

  if (hooksParamName) {
    const hooksParamIndex = constructorParams.findIndex(
      (p) => p.name === hooksParamName,
    );

    let hookParams = hooksParamIndex
      ? constructorParamValues[hooksParamIndex]
      : [];

    customParams[hooksParamName] = {
      value: hookParams.map(async (p: string) => {
        if (!isAddress(p)) {
          // computeDeploymentInfo for hook impl -> push into finalDeploymentInfo
          // with address of impl and factory above -> computeDeploymentInfo for hook proxy -> push into finalDeploymentInfo
          // return predicted address of hook proxy
        }

        return p;
      }),
    };
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

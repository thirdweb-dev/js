import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { DeployMetadata } from "../types/deploy/deploy-options";
import { Provider } from "zksync-web3";
import { SINGLETON_FACTORY } from "./constants";
import { caches } from "./caches";
import { ConstructorParamMap } from "../types/any-evm/deploy-data";
import { zkComputeDeploymentInfo } from "./zkComputeDeploymentInfo";

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
export async function getZkDeploymentInfo(
  deployMetadata: DeployMetadata,
  storage: ThirdwebStorage,
  provider: Provider,
  create2Factory?: string,
  clientId?: string,
  secretKey?: string,
): Promise<any[]> {
  caches.deploymentPresets = {};
  const create2FactoryAddress = create2Factory
    ? create2Factory
    : SINGLETON_FACTORY;

  const compilerMetadata = deployMetadata.compilerMetadata;
  const extendedMetadata = deployMetadata.extendedMetadata;
  const customParams: ConstructorParamMap = {};
  const finalDeploymentInfo: any[] = [];

  const implementationDeployInfo = await zkComputeDeploymentInfo(
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

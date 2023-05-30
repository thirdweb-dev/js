import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BytesLike } from "ethers";
import invariant from "tiny-invariant";
import { getChainProvider } from "../../constants/urls";
import { ConstructorParamMap } from "../../types/any-evm/deploy-data";
import { getMetadataForPlugins } from "../plugin/getMetadataForPlugins";
import { DEFAULT_API_KEY } from "../../../core/constants/urls";
import { fetchAndCachePublishedContractURI } from "./fetchAndCachePublishedContractURI";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { encodeConstructorParamsForImplementation } from "./encodeConstructorParamsForImplementation";
import { getDeploymentInfo } from "./getDeploymentInfo";

/**
 *
 * @internal
 * @param contractName
 * @param chainId
 * @param storage
 */
export async function getEncodedConstructorParamsForThirdwebContract(
  contractName: string,
  chainId: number,
  storage: ThirdwebStorage,
  constructorParamMap?: ConstructorParamMap,
): Promise<BytesLike | undefined> {
  const provider = getChainProvider(chainId, {
    thirdwebApiKey: DEFAULT_API_KEY,
  });
  const publishUri = await fetchAndCachePublishedContractURI(contractName);
  const metadata = await fetchAndCacheDeployMetadata(publishUri, storage);
  const create2Factory = await getCreate2FactoryAddress(provider);
  invariant(create2Factory, "Thirdweb stack not found");

  const pluginMetadata = await getMetadataForPlugins(publishUri, storage);

  let encodedArgs;

  // if pluginMetadata is not empty, then it's a plugin-pattern router contract
  if (pluginMetadata.length > 0) {
    const deploymentInfo = await getDeploymentInfo(
      publishUri,
      storage,
      provider,
      create2Factory,
    );
    encodedArgs = deploymentInfo.find(
      (contract) => contract.type === "implementation",
    )?.encodedArgs;
  } else {
    encodedArgs = await encodeConstructorParamsForImplementation(
      metadata.compilerMetadata,
      provider,
      storage,
      create2Factory,
      constructorParamMap,
    );
  }

  return encodedArgs;
}

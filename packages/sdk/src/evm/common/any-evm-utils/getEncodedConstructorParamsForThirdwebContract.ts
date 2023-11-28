import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BytesLike } from "ethers";
import invariant from "tiny-invariant";
import { getChainProvider } from "../../constants/urls";
import { ConstructorParamMap } from "../../types/any-evm/deploy-data";
import {
  THIRDWEB_DEPLOYER,
  fetchPublishedContractFromPolygon,
} from "./fetchPublishedContractFromPolygon";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { encodeConstructorParamsForImplementation } from "./computeDeploymentInfo";
import { getDeploymentInfo } from "./getDeploymentInfo";

/**
 *
 * @internal
 * @param contractName - The name of the contract to predict the address for
 * @param chainId - The chain id to use
 * @param storage - The storage to use
 */
export async function getEncodedConstructorParamsForThirdwebContract(
  contractName: string,
  chainId: number,
  storage: ThirdwebStorage,
  contractVersion: string = "latest",
  clientId?: string,
  secretKey?: string,
  constructorParamMap?: ConstructorParamMap,
): Promise<BytesLike | undefined> {
  const provider = getChainProvider(chainId, {
    clientId,
    secretKey,
  });
  const publishedContract = await fetchPublishedContractFromPolygon(
    THIRDWEB_DEPLOYER,
    contractName,
    contractVersion,
    storage,
    clientId,
    secretKey,
  );
  const publishUri = publishedContract.metadataUri;
  const metadata = await fetchAndCacheDeployMetadata(publishUri, storage);
  const create2Factory = await getCreate2FactoryAddress(provider);
  invariant(create2Factory, "Thirdweb stack not found");

  const { extendedMetadata } = await fetchAndCacheDeployMetadata(
    publishUri,
    storage,
  );

  let encodedArgs;

  // if pluginMetadata is not empty, then it's a plugin-pattern router contract
  if (
    extendedMetadata?.routerType === "plugin" ||
    extendedMetadata?.routerType === "dynamic"
  ) {
    const deploymentInfo = await getDeploymentInfo(
      publishUri,
      storage,
      provider,
      create2Factory,
      clientId,
      secretKey,
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
      clientId,
      secretKey,
    );
  }

  return encodedArgs;
}

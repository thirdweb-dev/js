import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import invariant from "tiny-invariant";
import { bytecode as WETHBytecode } from "../WETH9";
import {
  ContractOptions,
  DeployedContractType,
  DeploymentPreset,
} from "../../types/any-evm/deploy-data";
import { caches } from "./caches";
import { isContractDeployed } from "./isContractDeployed";
import { getInitBytecodeWithSalt } from "./getInitBytecodeWithSalt";
import { computeDeploymentAddress } from "./computeDeploymentAddress";
import { encodeConstructorParamsForImplementation } from "./encodeConstructorParamsForImplementation";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { fetchAndCachePublishedContractURI } from "./fetchAndCachePublishedContractURI";

export async function computeDeploymentInfo(
  contractType: DeployedContractType,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  contractOptions?: ContractOptions,
): Promise<DeploymentPreset> {
  let contractName = contractOptions && contractOptions.contractName;
  let metadata = contractOptions && contractOptions.metadata;
  invariant(contractName || metadata, "Require contract name or metadata");

  if (contractName && caches.deploymentPresets[contractName]) {
    return caches.deploymentPresets[contractName];
  }

  // Different treatment for WETH contract
  if (contractName === "WETH9") {
    const address = computeDeploymentAddress(WETHBytecode, [], create2Factory);
    const contractDeployed = await isContractDeployed(address, provider);
    let initBytecodeWithSalt = "";

    if (!contractDeployed) {
      initBytecodeWithSalt = getInitBytecodeWithSalt(WETHBytecode, []);
    }
    return {
      name: contractName,
      type: contractType,
      transaction: {
        predictedAddress: address,
        to: create2Factory,
        data: initBytecodeWithSalt,
      },
    };
  }

  if (!metadata) {
    invariant(contractName, "Require contract name");
    const uri = await fetchAndCachePublishedContractURI(contractName);
    metadata = (await fetchAndCacheDeployMetadata(uri, storage))
      .compilerMetadata;
  }

  const encodedArgs = await encodeConstructorParamsForImplementation(
    metadata,
    provider,
    storage,
    create2Factory,
    contractOptions?.constructorParams,
  );
  const address = computeDeploymentAddress(
    metadata.bytecode,
    encodedArgs,
    create2Factory,
  );
  const contractDeployed = await isContractDeployed(address, provider);

  let initBytecodeWithSalt = "";
  if (!contractDeployed) {
    initBytecodeWithSalt = getInitBytecodeWithSalt(
      metadata.bytecode,
      encodedArgs,
    );
  }

  return {
    name: contractName,
    type: contractType,
    transaction: {
      predictedAddress: address,
      to: create2Factory,
      data: initBytecodeWithSalt,
    },
    encodedArgs,
  };
}

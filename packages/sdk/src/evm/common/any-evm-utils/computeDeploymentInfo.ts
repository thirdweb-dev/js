import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import invariant from "tiny-invariant";
import { bytecode as WETHBytecode } from "../WETH9";
import { DeployedContractType } from "../../types/any-evm/deploy-data";
import {
  ContractOptions,
  DeploymentPreset,
} from "../../types/any-evm/deploy-data";
import { fetchAndCachePublishedContractURI } from "./fetchAndCachePublishedContractURI";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { isContractDeployed } from "./isContractDeployed";
import { getInitBytecodeWithSalt } from "./getInitBytecodeWithSalt";
import { computeDeploymentAddress } from "./computeDeploymentAddress";
import { BytesLike, ethers } from "ethers";
import { getNativeTokenByChainId } from "../../constants/currency";
import { PreDeployMetadataFetched } from "../../schema/contracts/custom";
import { ConstructorParamMap } from "../../types/any-evm/deploy-data";
import { extractConstructorParamsFromAbi } from "../feature-detection/extractConstructorParamsFromAbi";
import { caches } from "./caches";

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

/**
 * @internal
 *
 * Determine constructor params required by an implementation contract.
 * Return abi-encoded params.
 */
export async function encodeConstructorParamsForImplementation(
  compilerMetadata: PreDeployMetadataFetched,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  constructorParamMap?: ConstructorParamMap,
): Promise<BytesLike> {
  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );
  let constructorParamTypes = constructorParams.map((p) => {
    if (p.type === "tuple[]") {
      return ethers.utils.ParamType.from(p);
    } else {
      return p.type;
    }
  });

  const constructorParamValues = await Promise.all(
    constructorParams.map(async (p) => {
      if (constructorParamMap && constructorParamMap[p.name]) {
        if (constructorParamMap[p.name].type) {
          invariant(
            constructorParamMap[p.name].type === p.type,
            `Provided type ${
              constructorParamMap[p.name].type
            } doesn't match the actual type ${p.type} from Abi`,
          );
        }
        return constructorParamMap[p.name].value;
      }
      if (p.name && p.name.includes("nativeTokenWrapper")) {
        const chainId = (await provider.getNetwork()).chainId;
        let nativeTokenWrapperAddress =
          getNativeTokenByChainId(chainId).wrapped.address;

        if (nativeTokenWrapperAddress === ethers.constants.AddressZero) {
          const deploymentInfo = await computeDeploymentInfo(
            "infra",
            provider,
            storage,
            create2Factory,
            {
              contractName: "WETH9",
            },
          );
          if (!caches.deploymentPresets["WETH9"]) {
            caches.deploymentPresets["WETH9"] = deploymentInfo;
          }

          nativeTokenWrapperAddress =
            deploymentInfo.transaction.predictedAddress;
        }

        return nativeTokenWrapperAddress;
      } else if (p.name && p.name.includes("trustedForwarder")) {
        if (compilerMetadata.name === "Pack") {
          // EOAForwarder for Pack
          const deploymentInfo = await computeDeploymentInfo(
            "infra",
            provider,
            storage,
            create2Factory,
            {
              contractName: "ForwarderEOAOnly",
            },
          );
          if (!caches.deploymentPresets["ForwarderEOAOnly"]) {
            caches.deploymentPresets["ForwarderEOAOnly"] = deploymentInfo;
          }
          return deploymentInfo.transaction.predictedAddress;
        }

        const deploymentInfo = await computeDeploymentInfo(
          "infra",
          provider,
          storage,
          create2Factory,
          {
            contractName: "Forwarder",
          },
        );
        if (!caches.deploymentPresets["Forwarder"]) {
          caches.deploymentPresets["Forwarder"] = deploymentInfo;
        }

        return deploymentInfo.transaction.predictedAddress;
      } else {
        throw new Error("Can't resolve constructor arguments");
      }
    }),
  );

  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    constructorParamTypes,
    constructorParamValues,
  );
  return encodedArgs;
}

import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import invariant from "tiny-invariant";
import { bytecode as WETHBytecode } from "../WETH9";
import { DeployedContractType } from "../../types/any-evm/deploy-data";
import {
  ContractOptions,
  DeploymentPreset,
} from "../../types/any-evm/deploy-data";
import {
  THIRDWEB_DEPLOYER,
  fetchPublishedContractFromPolygon,
} from "./fetchPublishedContractFromPolygon";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { isContractDeployed } from "./isContractDeployed";
import { getInitBytecodeWithSalt } from "./getInitBytecodeWithSalt";
import { computeDeploymentAddress } from "./computeDeploymentAddress";
import { type BytesLike, utils, constants } from "ethers";
import { getNativeTokenByChainId } from "../../constants/currency";
import { PreDeployMetadataFetched } from "../../schema/contracts/custom";
import { ConstructorParamMap } from "../../types/any-evm/deploy-data";
import { extractConstructorParamsFromAbi } from "../feature-detection/extractConstructorParamsFromAbi";
import { caches } from "./caches";
import { getRoyaltyEngineV1ByChainId } from "../../constants/royaltyEngine";

export async function computeDeploymentInfo(
  contractType: DeployedContractType,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  contractOptions?: ContractOptions,
  clientId?: string,
  secretKey?: string,
): Promise<DeploymentPreset> {
  const contractName = contractOptions && contractOptions.contractName;
  const version = contractOptions && contractOptions.version;
  let publisherAddress = contractOptions && contractOptions.publisherAddress;
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
    if (!publisherAddress) {
      publisherAddress = THIRDWEB_DEPLOYER;
    }
    const publishedContract = await fetchPublishedContractFromPolygon(
      publisherAddress,
      contractName,
      version,
      storage,
      clientId,
      secretKey,
    );
    metadata = (
      await fetchAndCacheDeployMetadata(publishedContract.metadataUri, storage)
    ).compilerMetadata;
  }

  const encodedArgs = await encodeConstructorParamsForImplementation(
    metadata,
    provider,
    storage,
    create2Factory,
    contractOptions?.constructorParams,
    clientId,
    secretKey,
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
  clientId?: string,
  secretKey?: string,
): Promise<BytesLike> {
  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );
  const constructorParamTypes = constructorParams.map((p) => {
    if (p.type === "tuple[]" || p.type === "tuple") {
      return utils.ParamType.from(p);
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
        return await nativeTokenInputArg(
          provider,
          storage,
          create2Factory,
          clientId,
          secretKey,
        );
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
            clientId,
            secretKey,
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
          clientId,
          secretKey,
        );
        if (!caches.deploymentPresets["Forwarder"]) {
          caches.deploymentPresets["Forwarder"] = deploymentInfo;
        }

        return deploymentInfo.transaction.predictedAddress;
      } else if (p.name && p.name.includes("royaltyEngineAddress")) {
        const chainId = (await provider.getNetwork()).chainId;
        return getRoyaltyEngineV1ByChainId(chainId);
      } else if (p.name && p.name.includes("marketplaceV3Params")) {
        const chainId = (await provider.getNetwork()).chainId;
        const royaltyEngineAddress = getRoyaltyEngineV1ByChainId(chainId);

        const nativeTokenWrapper = await nativeTokenInputArg(
          provider,
          storage,
          create2Factory,
          clientId,
          secretKey,
        );

        const extensions = constructorParamMap
          ? constructorParamMap["_extensions"].value
          : [];

        return {
          extensions: extensions,
          royaltyEngineAddress: royaltyEngineAddress,
          nativeTokenWrapper: nativeTokenWrapper,
        };
      } else {
        throw new Error("Can't resolve constructor arguments");
      }
    }),
  );

  const encodedArgs = utils.defaultAbiCoder.encode(
    constructorParamTypes,
    constructorParamValues,
  );
  return encodedArgs;
}

async function nativeTokenInputArg(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  clientId?: string,
  secretKey?: string,
): Promise<string> {
  const chainId = (await provider.getNetwork()).chainId;
  let nativeTokenWrapperAddress =
    getNativeTokenByChainId(chainId).wrapped.address;

  if (nativeTokenWrapperAddress === constants.AddressZero) {
    const deploymentInfo = await computeDeploymentInfo(
      "infra",
      provider,
      storage,
      create2Factory,
      {
        contractName: "WETH9",
      },
      clientId,
      secretKey,
    );
    if (!caches.deploymentPresets["WETH9"]) {
      caches.deploymentPresets["WETH9"] = deploymentInfo;
    }

    nativeTokenWrapperAddress = deploymentInfo.transaction.predictedAddress;
  }

  return nativeTokenWrapperAddress;
}

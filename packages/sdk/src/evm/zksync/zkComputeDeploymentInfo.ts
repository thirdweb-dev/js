import { ContractFactory, Provider } from "zksync-web3";
import {
  ConstructorParamMap,
  ContractOptions,
  DeployedContractType,
} from "../types/any-evm/deploy-data";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";
import {
  THIRDWEB_DEPLOYER,
  fetchPublishedContractFromPolygon,
} from "../common/any-evm-utils/fetchPublishedContractFromPolygon";
import { fetchAndCacheDeployMetadata } from "../common/any-evm-utils/fetchAndCacheDeployMetadata";
import { zkComputeDeploymentAddress } from "./zkComputeDeploymentAddress";
import { isZkContractDeployed } from "./isZkContractDeployed";
import { BytesLike, utils } from "ethers";
import { extractConstructorParamsFromAbi } from "../common/feature-detection/extractConstructorParamsFromAbi";
import { getRoyaltyEngineV1ByChainId } from "../constants/royaltyEngine";
import { getZkNativeTokenByChainId } from "./constants/addresses";
import { PreDeployMetadataFetched } from "../schema/contracts/custom";
import { Interface } from "ethers/lib/utils";
import { hashBytecode } from "zksync-web3/build/src/utils";
import { caches } from "./caches";

export async function zkComputeDeploymentInfo(
  contractType: DeployedContractType,
  provider: Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  contractOptions?: ContractOptions,
  clientId?: string,
  secretKey?: string,
): Promise<any> {
  const contractName = contractOptions && contractOptions.contractName;
  const version = contractOptions && contractOptions.version;
  let publisherAddress = contractOptions && contractOptions.publisherAddress;
  let metadata = contractOptions && contractOptions.metadata;
  invariant(contractName || metadata, "Require contract name or metadata");

  if (contractName && caches.deploymentPresets[contractName]) {
    return caches.deploymentPresets[contractName];
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
      await fetchAndCacheDeployMetadata(
        publishedContract.metadataUri,
        storage,
        { compilerType: "zksolc" },
      )
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
  const address = zkComputeDeploymentAddress(
    metadata.bytecode,
    encodedArgs,
    create2Factory,
  );
  const contractDeployed = await isZkContractDeployed(address, provider);

  let constructorCalldata;
  let bytecodeHash;
  if (!contractDeployed) {
    const contractInterface = new Interface(metadata.abi);

    const bytecodePrefixed = metadata.bytecode.startsWith("0x")
      ? metadata.bytecode
      : `0x${metadata.bytecode}`;
    bytecodeHash = Buffer.from(hashBytecode(bytecodePrefixed)).toString("hex");
    constructorCalldata = utils.arrayify(encodedArgs);
  }

  return {
    name: contractName,
    type: contractType,
    transaction: {
      predictedAddress: address,
      to: create2Factory,
      constructorCalldata: constructorCalldata,
      bytecodeHash: bytecodeHash,
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
  provider: Provider,
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
        const chainId = (await provider.getNetwork()).chainId;
        let nativeTokenWrapperAddress =
          getZkNativeTokenByChainId(chainId).wrapped.address;
        return nativeTokenWrapperAddress;
      } else if (p.name && p.name.includes("royaltyEngineAddress")) {
        const chainId = (await provider.getNetwork()).chainId;
        return getRoyaltyEngineV1ByChainId(chainId);
      } else if (p.name && p.name.includes("marketplaceV3Params")) {
        const chainId = (await provider.getNetwork()).chainId;
        const royaltyEngineAddress = getRoyaltyEngineV1ByChainId(chainId);

        const nativeTokenWrapper =
          getZkNativeTokenByChainId(chainId).wrapped.address;

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

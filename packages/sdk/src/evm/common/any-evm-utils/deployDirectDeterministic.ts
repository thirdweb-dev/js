import {
  BigNumber,
  type PopulatedTransaction,
  type Signer,
  utils,
  type providers,
} from "ethers";
import invariant from "tiny-invariant";
import { isContractDeployed } from "./isContractDeployed";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { extractConstructorParamsFromAbi } from "../feature-detection/extractConstructorParamsFromAbi";
import { computeDeploymentAddress } from "./computeDeploymentAddress";
import { getInitBytecodeWithSalt } from "./getInitBytecodeWithSalt";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { deployCreate2Factory } from "./deployCreate2Factory";
import { convertParamValues } from "./convertParamValues";
import { AbiInput } from "../../schema";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { fetchPublishedContractFromPolygon } from "./fetchPublishedContractFromPolygon";

/**
 * Direct deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address and salt (if provided).
 *
 * @public
 *
 * @param bytecode
 * @param abi
 * @param signer
 * @param constructorArgs
 * @param saltForCreate2
 */
export async function directDeployDeterministic(
  bytecode: string,
  abi: AbiInput,
  signer: Signer,
  constructorArgs: any[],
  saltForCreate2?: string,
  gasLimit: number = 7000000,
): Promise<string> {
  invariant(signer.provider, "Provider is required");

  const bytecodePrefixed = bytecode.startsWith("0x")
    ? bytecode
    : `0x${bytecode}`;

  // 1. Deploy CREATE2 factory (if not already exists)
  const create2Factory = await deployCreate2Factory(signer);

  // 2. Encode constructor params
  const constructorParams = extractConstructorParamsFromAbi(abi);
  const constructorParamTypes = constructorParams.map((p) => {
    return p.type;
  });
  const paramValues = convertParamValues(
    constructorParamTypes,
    constructorArgs,
  );

  const paramTypesForEncoder = constructorParams.map((p) => {
    if (p.type === "tuple[]") {
      return utils.ParamType.from(p);
    } else {
      return p.type;
    }
  });
  const encodedArgs = utils.defaultAbiCoder.encode(
    paramTypesForEncoder,
    paramValues,
  );

  // 3. Construct deployment transaction
  const address = computeDeploymentAddress(
    bytecodePrefixed,
    encodedArgs,
    create2Factory,
    saltForCreate2,
  );
  const contractDeployed = await isContractDeployed(address, signer.provider);

  let initBytecodeWithSalt = "";
  if (!contractDeployed) {
    console.debug(`deploying contract via create2 factory at: ${address}`);

    initBytecodeWithSalt = getInitBytecodeWithSalt(
      bytecodePrefixed,
      encodedArgs,
      saltForCreate2,
    );

    const tx: PopulatedTransaction = {
      to: create2Factory,
      data: initBytecodeWithSalt,
    };

    try {
      await signer.estimateGas(tx);
    } catch (e) {
      console.debug("error estimating gas while deploying prebuilt: ", e);
      tx.gasLimit = BigNumber.from(gasLimit);
    }

    // 4. Deploy
    await (await signer.sendTransaction(tx)).wait();
  } else {
    throw new Error(`Contract already deployed at ${address}`);
  }

  return address;
}

/**
 * Direct deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address and salt (if provided).
 *
 * @public
 *
 * @param publishMetadataUri
 * @param signer
 * @param storage
 * @param constructorArgs
 * @param saltForCreate2
 */
export async function directDeployDeterministicWithUri(
  publishMetadataUri: string,
  signer: Signer,
  storage: ThirdwebStorage,
  constructorArgs: any[],
  saltForCreate2?: string,
  gasLimit: number = 7000000,
): Promise<string> {
  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishMetadataUri, storage);

  invariant(
    extendedMetadata?.deployType === "standard",
    "Must be direct deploy",
  );

  return await directDeployDeterministic(
    compilerMetadata.bytecode,
    compilerMetadata.abi,
    signer,
    constructorArgs,
    saltForCreate2,
    gasLimit,
  );
}

/**
 * Direct deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address and salt (if provided).
 *
 * @public
 *
 * @param contractName
 * @param publisherAddress
 * @param contractVersion
 * @param constructorArgs
 * @param signer
 * @param storage
 * @param clientId
 * @param secretKey
 * @param constructorArgs
 * @param saltForCreate2
 */
export async function directDeployDeterministicPublished(
  contractName: string,
  publisherAddress: string,
  contractVersion: string = "latest",
  constructorArgs: any[],
  signer: Signer,
  storage: ThirdwebStorage,
  clientId?: string,
  secretKey?: string,
  saltForCreate2?: string,
  gasLimit: number = 7000000,
): Promise<string> {
  const publishMetadataUri = (
    await fetchPublishedContractFromPolygon(
      publisherAddress,
      contractName,
      contractVersion,
      storage,
      clientId,
      secretKey,
    )
  ).metadataUri;
  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishMetadataUri, storage);

  invariant(
    extendedMetadata?.deployType === "standard",
    "Must be direct deploy",
  );

  return await directDeployDeterministic(
    compilerMetadata.bytecode,
    compilerMetadata.abi,
    signer,
    constructorArgs,
    saltForCreate2,
    gasLimit,
  );
}

export async function predictAddressDeterministic(
  bytecode: string,
  abi: AbiInput,
  provider: providers.Provider,
  constructorArgs: any[],
  saltForCreate2?: string,
): Promise<string> {
  const bytecodePrefixed = bytecode.startsWith("0x")
    ? bytecode
    : `0x${bytecode}`;

  // 1. Deploy CREATE2 factory (if not already exists)
  const create2Factory = await getCreate2FactoryAddress(provider);

  // 2. Encode constructor params
  const constructorParams = extractConstructorParamsFromAbi(abi);
  const constructorParamTypes = constructorParams.map((p) => {
    return p.type;
  });
  const paramValues = convertParamValues(
    constructorParamTypes,
    constructorArgs,
  );

  const paramTypesForEncoder = constructorParams.map((p) => {
    if (p.type === "tuple[]") {
      return utils.ParamType.from(p);
    } else {
      return p.type;
    }
  });
  const encodedArgs = utils.defaultAbiCoder.encode(
    paramTypesForEncoder,
    paramValues,
  );

  // 3. Construct deployment transaction
  const address = computeDeploymentAddress(
    bytecodePrefixed,
    encodedArgs,
    create2Factory,
    saltForCreate2,
  );

  return address;
}

export async function predictAddressDeterministicWithUri(
  publishMetadataUri: string,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  constructorArgs: any[],
  saltForCreate2?: string,
): Promise<string> {
  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishMetadataUri, storage);

  invariant(
    extendedMetadata?.deployType === "standard",
    "Must be direct deploy",
  );

  return await predictAddressDeterministic(
    compilerMetadata.bytecode,
    compilerMetadata.abi,
    provider,
    constructorArgs,
    saltForCreate2,
  );
}

export async function predictAddressDeterministicPublished(
  contractName: string,
  publisherAddress: string,
  contractVersion: string = "latest",
  constructorArgs: any[],
  provider: providers.Provider,
  storage: ThirdwebStorage,
  clientId?: string,
  secretKey?: string,
  saltForCreate2?: string,
): Promise<string> {
  const publishMetadataUri = (
    await fetchPublishedContractFromPolygon(
      publisherAddress,
      contractName,
      contractVersion,
      storage,
      clientId,
      secretKey,
    )
  ).metadataUri;
  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishMetadataUri, storage);

  invariant(
    extendedMetadata?.deployType === "standard",
    "Must be direct deploy",
  );

  return await predictAddressDeterministic(
    compilerMetadata.bytecode,
    compilerMetadata.abi,
    provider,
    constructorArgs,
    saltForCreate2,
  );
}

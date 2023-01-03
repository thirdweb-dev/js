import {
  Feature,
  FeatureName,
  FeatureWithEnabled,
  SUPPORTED_FEATURES,
} from "../constants/contract-features";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { DetectableFeature } from "../core/interfaces/DetectableFeature";
import { decode } from "../lib/cbor-decode.js";
import {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiSchema,
  AbiTypeSchema,
  ContractInfoSchema,
  ContractSource,
  FullPublishMetadata,
  FullPublishMetadataSchemaOutput,
  PreDeployMetadata,
  PreDeployMetadataFetched,
  PreDeployMetadataFetchedSchema,
  PublishedMetadata,
} from "../schema/contracts/custom";
import { ExtensionNotImplementedError } from "./error";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import bs58 from "bs58";
import { BaseContract, BigNumber, ethers } from "ethers";
import { z } from "zod";

/**
 * @internal
 * @param abi
 * @param feature
 */
function matchesAbiInterface(abi: Abi, feature: Feature): boolean {
  // returns true if all the functions in `interfaceToMatch` are found in `contract` (removing any duplicates)
  return hasMatchingAbi(abi, feature.abis);
}

/**
 * @internal
 * @param contractWrapper
 * @param abi
 * @returns
 */
export function matchesPrebuiltAbi<T extends BaseContract>(
  contractWrapper: ContractWrapper<BaseContract>,
  abi: Abi,
): contractWrapper is ContractWrapper<T> {
  return hasMatchingAbi(contractWrapper.abi as Abi, [abi]);
}

/**
 * @internal
 * @param contractAbi
 * @param featureAbis
 * @returns
 */
export function hasMatchingAbi(contractAbi: Abi, featureAbis: readonly Abi[]) {
  const contractFn = extractFunctionsFromAbi(contractAbi);
  const interfaceFn = featureAbis.flatMap((i: any) =>
    extractFunctionsFromAbi(i),
  );
  // match every function and their arguments
  const intersection = contractFn.filter((fn) => {
    const match = interfaceFn.find(
      (iFn) =>
        iFn.name === fn.name &&
        iFn.inputs.length === fn.inputs.length &&
        iFn.inputs.every((i, index) => {
          if (i.type === "tuple" || i.type === "tuple[]") {
            // check that all properties in the tuple are the same type
            return (
              i.type === fn.inputs[index].type &&
              i.components?.every((c, cIndex) => {
                return c.type === fn.inputs[index].components?.[cIndex]?.type;
              })
            );
          }
          return i.type === fn.inputs[index].type;
        }),
    );
    return match !== undefined;
  });
  return intersection.length === interfaceFn.length;
}

/**
 * @internal
 */
export async function extractConstructorParams(
  predeployMetadataUri: string,
  storage: ThirdwebStorage,
) {
  const meta = await fetchPreDeployMetadata(predeployMetadataUri, storage);
  return extractConstructorParamsFromAbi(meta.abi);
}

/**
 * @internal
 * @param predeployMetadataUri
 * @param storage
 */
export async function extractFunctions(
  predeployMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<AbiFunction[]> {
  const metadata = await fetchPreDeployMetadata(predeployMetadataUri, storage);
  return extractFunctionsFromAbi(metadata.abi, metadata.metadata);
}

/**
 * @internal
 * @param name
 * @param metadata
 * @param type
 */
function extractCommentFromMetadata(
  name: string | undefined,
  metadata: Record<string, any> | undefined,
  type: "methods" | "events",
) {
  return (
    metadata?.output?.userdoc?.[type]?.[
      Object.keys(metadata?.output?.userdoc[type] || {}).find((fn) =>
        fn.includes(name || "unknown"),
      ) || ""
    ]?.notice ||
    metadata?.output?.devdoc?.[type]?.[
      Object.keys(metadata?.output?.devdoc[type] || {}).find((fn) =>
        fn.includes(name || "unknown"),
      ) || ""
    ]?.details
  );
}

/**
 *
 * @param abi
 * @returns
 * @internal
 */
export function extractConstructorParamsFromAbi(
  abi: z.input<typeof AbiSchema>,
) {
  for (const input of abi) {
    if (input.type === "constructor") {
      return input.inputs || [];
    }
  }
  return [];
}

/**
 *
 * @param abi
 * @param functionName
 * @returns
 * @internal
 */
export function extractFunctionParamsFromAbi(
  abi: z.input<typeof AbiSchema>,
  functionName: string,
) {
  for (const input of abi) {
    if (input.type === "function" && input.name === functionName) {
      return input.inputs || [];
    }
  }
  return [];
}

/**
 * @internal
 * @param abi
 * @param metadata
 */
export function extractFunctionsFromAbi(
  abi: Abi,
  metadata?: Record<string, any>,
): AbiFunction[] {
  const functions = (abi || []).filter((el) => el.type === "function");

  const parsed: AbiFunction[] = [];
  for (const f of functions) {
    const doc = extractCommentFromMetadata(f.name, metadata, "methods");
    const args =
      f.inputs?.map((i) => `${i.name || "key"}: ${toJSType(i)}`)?.join(", ") ||
      "";
    const fargs = args ? `, ${args}` : "";
    const out = f.outputs?.map((o) => toJSType(o, true))?.join(", ");
    const promise = out ? `: Promise<${out}>` : `: Promise<TransactionResult>`;
    const signature = `contract.call("${f.name}"${fargs})${promise}`;
    parsed.push({
      inputs: f.inputs || [],
      outputs: f.outputs || [],
      name: f.name || "unknown",
      signature,
      stateMutability: f.stateMutability || "",
      comment: doc,
    });
  }
  return parsed;
}

/**
 * @internal
 * @param abi
 * @param metadata
 */
export function extractEventsFromAbi(
  abi: Abi,
  metadata?: Record<string, any>,
): AbiEvent[] {
  const events = (abi || []).filter((el) => el.type === "event");
  const parsed: AbiEvent[] = [];
  for (const e of events) {
    const doc = extractCommentFromMetadata(e.name, metadata, "events");
    parsed.push({
      inputs: e.inputs || [],
      outputs: e.outputs || [],
      name: e.name || "unknown",
      comment: doc,
    });
  }
  return parsed;
}

function toJSType(
  contractType: z.input<typeof AbiTypeSchema>,
  isReturnType = false,
  withName = false,
): string {
  let jsType = contractType.type;
  let isArray = false;
  if (jsType.endsWith("[]")) {
    isArray = true;
    jsType = jsType.slice(0, -2);
  }
  if (jsType.startsWith("bytes")) {
    jsType = "BytesLike";
  }
  if (jsType.startsWith("uint") || jsType.startsWith("int")) {
    jsType = isReturnType ? "BigNumber" : "BigNumberish";
  }
  if (jsType.startsWith("bool")) {
    jsType = "boolean";
  }
  if (jsType === "address") {
    jsType = "string";
  }
  if (jsType === "tuple") {
    if (contractType.components) {
      jsType = `{ ${contractType.components
        .map((a) => toJSType(a, false, true))
        .join(", ")} }`;
    }
  }
  if (isArray) {
    jsType += "[]";
  }
  if (withName) {
    jsType = `${contractType.name}: ${jsType}`;
  }
  return jsType;
}

/**
 * @internal
 * @param bytecode
 */
export function extractMinimalProxyImplementationAddress(
  bytecode: string,
): string | undefined {
  // EIP-1167 clone minimal proxy - https://eips.ethereum.org/EIPS/eip-1167
  if (bytecode.startsWith("0x363d3d373d3d3d363d73")) {
    const implementationAddress = bytecode.slice(22, 62);
    return `0x${implementationAddress}`;
  }

  // Minimal Proxy with receive() from 0xSplits - https://github.com/0xSplits/splits-contracts/blob/c7b741926ec9746182d0d1e2c4c2046102e5d337/contracts/libraries/Clones.sol
  if (bytecode.startsWith("0x36603057343d5230")) {
    // +40 = size of addr
    const implementationAddress = bytecode.slice(122, 122 + 40);
    return `0x${implementationAddress}`;
  }

  // 0age's minimal proxy - https://medium.com/coinmonks/the-more-minimal-proxy-5756ae08ee48
  if (bytecode.startsWith("0x3d3d3d3d363d3d37363d73")) {
    // +40 = size of addr
    const implementationAddress = bytecode.slice(24, 24 + 40);
    return `0x${implementationAddress}`;
  }

  // vyper's minimal proxy (uniswap v1) - https://etherscan.io/address/0x09cabec1ead1c0ba254b09efb3ee13841712be14#code
  if (bytecode.startsWith("0x366000600037611000600036600073")) {
    const implementationAddress = bytecode.slice(32, 32 + 40);
    return `0x${implementationAddress}`;
  }

  return undefined;
}

/**
 * @internal
 * @param address
 * @param provider
 */
export async function resolveContractUriFromAddress(
  address: string,
  provider: ethers.providers.Provider,
): Promise<string | undefined> {
  const bytecode = await provider.getCode(address);
  if (bytecode === "0x") {
    const chain = await provider.getNetwork();
    throw new Error(
      `Contract at ${address} does not exist on chain '${chain.name}' (chainId: ${chain.chainId})`,
    );
  }

  try {
    const implementationAddress =
      extractMinimalProxyImplementationAddress(bytecode);
    if (implementationAddress) {
      return await resolveContractUriFromAddress(
        implementationAddress,
        provider,
      );
    }
  } catch (e) {
    // ignore
  }

  // EIP-1967 proxy storage slots - https://eips.ethereum.org/EIPS/eip-1967
  try {
    const proxyStorage = await provider.getStorageAt(
      address,
      BigNumber.from(
        "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
      ),
    );
    const implementationAddress = ethers.utils.hexStripZeros(proxyStorage);
    if (implementationAddress !== "0x") {
      return await resolveContractUriFromAddress(
        implementationAddress,
        provider,
      );
    }
  } catch (e) {
    // ignore
  }
  // TODO support other types of proxies
  return await extractIPFSHashFromBytecode(bytecode);
}

/**
 * @internal
 * @param bytecode
 */
export function extractIPFSHashFromBytecode(
  bytecode: string,
): string | undefined {
  const numericBytecode = hexToBytes(bytecode);
  const cborLength: number =
    numericBytecode[numericBytecode.length - 2] * 0x100 +
    numericBytecode[numericBytecode.length - 1];
  const bytecodeBuffer = Uint8Array.from(
    numericBytecode.slice(numericBytecode.length - 2 - cborLength, -2),
  );

  const cborData = decode(bytecodeBuffer);
  if ("ipfs" in cborData && cborData["ipfs"]) {
    try {
      return `ipfs://${bs58.encode(cborData["ipfs"])}`;
    } catch (e) {
      console.warn("feature-detection ipfs cbor failed", e);
    }
  }
  return undefined;
}

/**
 * @internal
 * @param hex
 */
function hexToBytes(hex: string | number) {
  hex = hex.toString(16);
  if (!hex.startsWith("0x")) {
    hex = `0x${hex}`;
  }
  if (!isHexStrict(hex)) {
    throw new Error(`Given value "${hex}" is not a valid hex string.`);
  }
  hex = hex.replace(/^0x/i, "");
  const bytes: number[] = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  }
  return bytes;
}

/**
 * @internal
 * @param hex
 */
function isHexStrict(hex: string | number) {
  return (
    (typeof hex === "string" || typeof hex === "number") &&
    /^(-)?0x[0-9a-f]*$/i.test(hex.toString())
  );
}

/**
 * @internal
 * @param address
 * @param provider
 * @param storage
 */
export async function fetchContractMetadataFromAddress(
  address: string,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
) {
  const compilerMetadataUri = await resolveContractUriFromAddress(
    address,
    provider,
  );
  if (!compilerMetadataUri) {
    throw new Error(`Could not resolve metadata for contract at ${address}`);
  }
  return await fetchContractMetadata(compilerMetadataUri, storage);
}

/**
 * @internal
 * @param address
 * @param provider
 * @param storage
 * @returns
 */
export async function fetchAbiFromAddress(
  address: string,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
): Promise<Abi | undefined> {
  try {
    const metadata = await fetchContractMetadataFromAddress(
      address,
      provider,
      storage,
    );
    if (metadata && metadata.abi) {
      return metadata.abi;
    }
  } catch (e) {
    // unit tests using mock storage will always fail, so ignore the error
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (!process.env.tests_running) {
      console.warn(`Couldn't fetch ABI for address '${address}'`, e);
    }
  }
  return undefined;
}

/**
 * @internal
 * @param compilerMetadataUri
 * @param storage
 */
export async function fetchContractMetadata(
  compilerMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PublishedMetadata> {
  const metadata = await storage.downloadJSON(compilerMetadataUri);
  if (!metadata || !metadata.output) {
    throw new Error(
      `Could not resolve metadata for contract at ${compilerMetadataUri}`,
    );
  }
  const abi = AbiSchema.parse(metadata.output.abi);
  const compilationTarget = metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = compilationTarget[targets[0]];
  const info = ContractInfoSchema.parse({
    title: metadata.output.devdoc.title,
    author: metadata.output.devdoc.author,
    details: metadata.output.devdoc.detail,
    notice: metadata.output.userdoc.notice,
  });
  const licenses: string[] = [
    ...new Set(
      Object.entries(metadata.sources).map(([, src]) => (src as any).license),
    ),
  ];
  return {
    name,
    abi,
    metadata,
    info,
    licenses,
  };
}

/**
 * @internal
 * @param publishedMetadata
 * @param storage
 */
export async function fetchSourceFilesFromMetadata(
  publishedMetadata: PublishedMetadata,
  storage: ThirdwebStorage,
): Promise<ContractSource[]> {
  return await Promise.all(
    Object.entries(publishedMetadata.metadata.sources).map(
      async ([path, info]) => {
        const urls = (info as any).urls as string[];
        const ipfsLink = urls
          ? urls.find((url) => url.includes("ipfs"))
          : undefined;
        if (ipfsLink) {
          const ipfsHash = ipfsLink.split("ipfs/")[1];
          // 5 sec timeout for sources that haven't been uploaded to ipfs
          const timeout = new Promise<string>((_r, rej) =>
            setTimeout(() => rej("timeout"), 5000),
          );
          const source = await Promise.race([
            (await storage.download(`ipfs://${ipfsHash}`)).text(),
            timeout,
          ]);
          return {
            filename: path,
            source,
          };
        } else {
          return {
            filename: path,
            source:
              (info as any).content ||
              "Could not find source for this contract",
          };
        }
      },
    ),
  );
}

/**
 * @internal
 * @param publishMetadataUri
 * @param storage
 */
export async function fetchRawPredeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
) {
  return PreDeployMetadata.parse(
    JSON.parse(await (await storage.download(publishMetadataUri)).text()),
  );
}

/**
 * Fetch the metadata coming from CLI, this is before deploying or releasing the contract.
 * @internal
 * @param publishMetadataUri
 * @param storage
 */
export async function fetchPreDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PreDeployMetadataFetched> {
  const rawMeta = await fetchRawPredeployMetadata(publishMetadataUri, storage);
  const deployBytecode = await (
    await storage.download(rawMeta.bytecodeUri)
  ).text();
  const parsedMeta = await fetchContractMetadata(rawMeta.metadataUri, storage);
  return PreDeployMetadataFetchedSchema.parse({
    ...rawMeta,
    ...parsedMeta,
    bytecode: deployBytecode,
  });
}

/**
 * Fetch and parse the full metadata AFTER creating a release, with all the extra information (version, readme, etc)
 * @internal
 * @param publishMetadataUri
 * @param storage
 */
export async function fetchExtendedReleaseMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<FullPublishMetadata> {
  const meta = await (await storage.download(publishMetadataUri)).text();
  return FullPublishMetadataSchemaOutput.parse(JSON.parse(meta));
}

/**
 * Processes ALL supported features and sets whether the passed in abi supports each individual feature
 * @internal
 * @param abi
 * @param features
 * @returns the nested struct of all features and whether they're detected in the abi
 */
export function detectFeatures(
  abi: Abi,
  features: Record<string, Feature> = SUPPORTED_FEATURES,
): Record<string, FeatureWithEnabled> {
  const results: Record<string, FeatureWithEnabled> = {};
  for (const featureKey in features) {
    const feature = features[featureKey];
    const enabled = matchesAbiInterface(abi, feature);
    const childResults = detectFeatures(abi, feature.features);
    results[featureKey] = {
      ...feature,
      features: childResults,
      enabled,
    } as FeatureWithEnabled;
  }
  return results;
}

function extractFeatures(
  input: Record<string, FeatureWithEnabled>,
  enabledExtensions: FeatureWithEnabled[],
) {
  if (!input) {
    return;
  }
  for (const extensionKey in input) {
    const extension = input[extensionKey];
    // if extension is enabled, then add it to enabledFeatures
    if (extension.enabled) {
      enabledExtensions.push(extension);
    }
    // recurse
    extractFeatures(extension.features, enabledExtensions);
  }
}

/**
 * Return all the detected features in the abi
 * @param abi - parsed array of abi entries
 * @returns array of all detected extensions with full information on each feature
 * @public
 */
export function getAllDetectedFeatures(abi: Abi): FeatureWithEnabled[] {
  const features: FeatureWithEnabled[] = [];
  extractFeatures(detectFeatures(abi), features);
  return features;
}

/**
 * Return all the detected features names in the abi
 * @param abi - parsed array of abi entries
 * @returns array of all detected features names
 * @public
 */
export function getAllDetectedFeatureNames(abi: Abi): string[] {
  const features: FeatureWithEnabled[] = [];
  extractFeatures(detectFeatures(abi), features);
  return features.map((f) => f.name);
}

/**
 * Checks whether the given ABI supports a given feature
 * @internal
 * @param abi
 * @param featureName
 */
export function isFeatureEnabled(
  abi: z.input<typeof AbiSchema>,
  featureName: FeatureName,
): boolean {
  const features = detectFeatures(abi);
  return _featureEnabled(features, featureName);
}

/**
 * Checks whether the given DetectableFeature is defined
 * @internal
 * @param namespace The namespace to check
 * @param feature The corresponding feature
 */
export function assertEnabled<T extends DetectableFeature>(
  namespace: T | undefined,
  feature: Feature,
) {
  if (!namespace) {
    throw new ExtensionNotImplementedError(feature);
  }
  return namespace as T;
}

/**
 * Type guard for contractWrappers depending on passed feature name
 * @internal
 * @param contractWrapper
 * @param featureName
 */
export function detectContractFeature<T extends BaseContract>(
  contractWrapper: ContractWrapper<BaseContract>,
  featureName: FeatureName,
): contractWrapper is ContractWrapper<T> {
  return isFeatureEnabled(AbiSchema.parse(contractWrapper.abi), featureName);
}

/**
 * Searches the feature map for featureName and returns whether its enabled
 * @internal
 * @param features
 * @param featureName
 */
function _featureEnabled(
  features: Record<string, FeatureWithEnabled>,
  featureName: FeatureName,
): boolean {
  const keys = Object.keys(features);
  if (!keys.includes(featureName)) {
    let found = false;
    for (const key of keys) {
      const f = features[key];
      found = _featureEnabled(
        f.features as Record<string, FeatureWithEnabled>,
        featureName,
      );
      if (found) {
        break;
      }
    }
    return found;
  }
  const feature = features[featureName];
  return feature.enabled;
}

/**
 * @internal
 * @param contractWrapper
 * @param functionName
 */
export function hasFunction<TContract extends BaseContract>(
  functionName: string,
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<TContract> {
  return functionName in contractWrapper.readContract.functions;
}

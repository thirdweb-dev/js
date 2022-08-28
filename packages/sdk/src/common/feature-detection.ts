import { BaseContract, ethers } from "ethers";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { IStorage } from "@thirdweb-dev/storage";
import {
  AbiEvent,
  AbiFunction,
  AbiSchema,
  AbiTypeSchema,
  ContractInfoSchema,
  ContractSource,
  FullPublishMetadata,
  FullPublishMetadataSchema,
  PreDeployMetadata,
  PreDeployMetadataFetched,
  PreDeployMetadataFetchedSchema,
  PublishedMetadata,
} from "../schema/contracts/custom";
import { z } from "zod";
import {
  Feature,
  FeatureName,
  FeatureWithEnabled,
  SUPPORTED_FEATURES,
} from "../constants/contract-features";
import { decodeFirstSync } from "cbor";
import { toB58String } from "multihashes";

/**
 * @internal
 * @param abi
 * @param feature
 */
function matchesAbiInterface(
  abi: z.input<typeof AbiSchema>,
  feature: Feature,
): boolean {
  // returns true if all the functions in `interfaceToMatch` are found in `contract` (removing any duplicates)
  const contractFn = [
    ...new Set(extractFunctionsFromAbi(abi).map((f) => f.name)),
  ];
  const interfaceFn = [
    ...new Set(
      feature.abis
        .flatMap((i) => extractFunctionsFromAbi(i))
        .map((f) => f.name),
    ),
  ];

  return (
    contractFn.filter((k) => interfaceFn.includes(k)).length ===
    interfaceFn.length
  );
}

/**
 * @internal
 */
export async function extractConstructorParams(
  predeployMetadataUri: string,
  storage: IStorage,
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
  storage: IStorage,
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
      return input.inputs ?? [];
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
      return input.inputs ?? [];
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
  abi: z.input<typeof AbiSchema>,
  metadata?: Record<string, any>,
): AbiFunction[] {
  const functions = abi.filter((el) => el.type === "function");

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
      inputs: f.inputs ?? [],
      outputs: f.outputs ?? [],
      name: f.name ?? "unknown",
      signature,
      stateMutability: f.stateMutability ?? "",
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
  abi: z.input<typeof AbiSchema>,
  metadata?: Record<string, any>,
): AbiEvent[] {
  const events = abi.filter((el) => el.type === "event");
  const parsed: AbiEvent[] = [];
  for (const e of events) {
    const doc = extractCommentFromMetadata(e.name, metadata, "events");
    parsed.push({
      inputs: e.inputs ?? [],
      outputs: e.outputs ?? [],
      name: e.name ?? "unknown",
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
  // EIP-1167 clone proxy - https://eips.ethereum.org/EIPS/eip-1167
  if (bytecode.startsWith("0x363d3d373d3d3d363d")) {
    const implementationAddress = bytecode.slice(22, 62);
    return resolveContractUriFromAddress(
      `0x${implementationAddress}`,
      provider,
    );
  }
  // TODO support other types of proxies like erc1967
  return extractIPFSHashFromBytecode(bytecode);
}

/**
 * @internal
 * @param bytecode
 */
function extractIPFSHashFromBytecode(bytecode: string): string | undefined {
  const numericBytecode = hexToBytes(bytecode);
  const cborLength: number =
    numericBytecode[numericBytecode.length - 2] * 0x100 +
    numericBytecode[numericBytecode.length - 1];
  const bytecodeBuffer = Buffer.from(
    numericBytecode.slice(numericBytecode.length - 2 - cborLength, -2),
  );

  const cborData = decodeFirstSync(bytecodeBuffer);
  if (cborData["ipfs"]) {
    return `ipfs://${toB58String(cborData["ipfs"])}`;
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
  const bytes = [];
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
  storage: IStorage,
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
 * @param compilerMetadataUri
 * @param storage
 */
export async function fetchContractMetadata(
  compilerMetadataUri: string,
  storage: IStorage,
): Promise<PublishedMetadata> {
  const metadata = await storage.get(compilerMetadataUri);
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
      Object.entries(metadata.sources).map(([_, src]) => (src as any).license),
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
  storage: IStorage,
): Promise<ContractSource[]> {
  return await Promise.all(
    Object.entries(publishedMetadata.metadata.sources).map(
      async ([path, info]) => {
        const urls = (info as any).urls as string[];
        const ipfsLink = urls.find((url) => url.includes("ipfs"));
        if (ipfsLink) {
          const ipfsHash = ipfsLink.split("ipfs/")[1];
          // 5 sec timeout for sources that haven't been uploaded to ipfs
          const timeout = new Promise<string>((_r, rej) =>
            setTimeout(() => rej("timeout"), 5000),
          );
          const source = await Promise.race([
            storage.getRaw(`ipfs://${ipfsHash}`),
            timeout,
          ]);
          return {
            filename: path,
            source,
          };
        } else {
          return {
            filename: path,
            source: "Could not find source for this contract",
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
  storage: IStorage,
) {
  return PreDeployMetadata.parse(
    JSON.parse(await storage.getRaw(publishMetadataUri)),
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
  storage: IStorage,
): Promise<PreDeployMetadataFetched> {
  const rawMeta = await fetchRawPredeployMetadata(publishMetadataUri, storage);
  const deployBytecode = await storage.getRaw(rawMeta.bytecodeUri);
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
  storage: IStorage,
): Promise<FullPublishMetadata> {
  const meta = await storage.getRaw(publishMetadataUri);
  return FullPublishMetadataSchema.parse(JSON.parse(meta));
}

/**
 * Processes ALL supported features and sets whether the passed in abi supports each individual feature
 * @internal
 * @param abi
 * @param features
 * @returns the nested struct of all features and whether they're detected in the abi
 */
export function detectFeatures(
  abi: z.input<typeof AbiSchema>,
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

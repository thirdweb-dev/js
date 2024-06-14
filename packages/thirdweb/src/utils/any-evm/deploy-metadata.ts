import type { Abi } from "abitype";
import type { ThirdwebClient } from "../../client/client.js";
import { download } from "../../storage/download.js";
import type { Hex } from "../encoding/hex.js";
import type { Prettify } from "../type-utils.js";

export type FetchDeployMetadataOptions = {
  uri: string;
  client: ThirdwebClient;
};

export type FetchDeployMetadataResult = {
  compilerMetadata: CompilerMetadata;
  extendedMetadata: ExtendedMetadata | undefined;
};

/**
 * Fetches the deployment metadata.
 * @param options - The options for fetching the deploy metadata.
 * @returns An object containing the compiler metadata and extended metadata.
 * @internal
 */
export async function fetchDeployMetadata(
  options: FetchDeployMetadataOptions,
): Promise<FetchDeployMetadataResult> {
  const [compilerMetadata, extendedMetadata] = await Promise.all([
    fetchCompilerMetadata(options),
    fetchExtendedMetadata(options).catch(() => undefined),
  ]);
  return { compilerMetadata, extendedMetadata };
}

// helpers
/**
 * Fetches the published metadata.
 * @param options - The options for fetching the published metadata.
 * @internal
 */
async function fetchExtendedMetadata(
  options: FetchDeployMetadataOptions,
): Promise<ExtendedMetadata> {
  return download({
    uri: options.uri,
    client: options.client,
  }).then((r) => r.json());
}

async function fetchCompilerMetadata(
  options: FetchDeployMetadataOptions,
): Promise<CompilerMetadata> {
  const rawMeta: RawCompilerMetadata = await download({
    uri: options.uri,
    client: options.client,
  }).then((r) => r.json());
  const [deployBytecode, parsedMeta] = await Promise.all([
    download({ uri: rawMeta.bytecodeUri, client: options.client }).then(
      (res) => res.text() as Promise<Hex>,
    ),
    fetchAndParseCompilerMetadata({
      client: options.client,
      uri: rawMeta.metadataUri,
    }),
  ]);

  return {
    ...rawMeta,
    ...parsedMeta,
    bytecode: deployBytecode,
  };
}

const CONTRACT_METADATA_TIMEOUT_SEC = 2 * 1000;

async function fetchAndParseCompilerMetadata(
  options: FetchDeployMetadataOptions,
): Promise<ParsedCompilerMetadata> {
  // short timeout to avoid hanging on unpinned contract metadata CIDs
  const metadata = await (
    await download({
      ...options,
      requestTimeoutMs: CONTRACT_METADATA_TIMEOUT_SEC,
    })
  ).json();
  if (!metadata || !metadata.output) {
    throw new Error(
      `Could not resolve metadata for contract at ${options.uri}`,
    );
  }
  return formatCompilerMetadata(metadata);
}

// biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
function formatCompilerMetadata(metadata: any): ParsedCompilerMetadata {
  const abi = metadata.output.abi;
  const compilationTarget = metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = compilationTarget[targets[0] as keyof typeof compilationTarget];
  const info = {
    title: metadata.output.devdoc.title,
    author: metadata.output.devdoc.author,
    details: metadata.output.devdoc.detail,
    notice: metadata.output.userdoc.notice,
  };
  const licenses: string[] = [
    ...new Set(
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      Object.entries(metadata.sources).map(([, src]) => (src as any).license),
    ),
  ];
  return {
    name,
    abi,
    metadata,
    info,
    licenses,
    isPartialAbi: metadata.isPartialAbi,
  };
}

// types

type RawCompilerMetadata = {
  name: string;
  metadataUri: string;
  bytecodeUri: string;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  analytics?: any;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  [key: string]: any;
};

type ParsedCompilerMetadata = {
  name: string;
  abi: Abi;
  metadata: Record<string, unknown>;
  info: {
    title?: string;
    author?: string;
    details?: string;
    notice?: string;
  };
  licenses: string[];
  isPartialAbi?: boolean;
};

export type CompilerMetadata = Prettify<
  ParsedCompilerMetadata & {
    bytecode: Hex;
  }
>;

export type ExtendedMetadata = {
  name: string;
  version: string;
  metadataUri: string;
  bytecodeUri: string;
  description?: string | undefined;
  defaultExtensions?:
    | {
        extensionName: string;
        extensionVersion: string;
        publisherAddress: string;
      }[]
    | undefined;
  publisher?: string | undefined;
  audit?: string | undefined;
  logo?: string | undefined;
  displayName?: string | undefined;
  readme?: string | undefined;
  tags?: string[] | undefined;
  changelog?: string | undefined;
  isDeployableViaFactory?: boolean | undefined;
  isDeployableViaProxy?: boolean | undefined;
  factoryDeploymentData?:
    | {
        implementationAddresses: Record<string, string>;
        implementationInitializerFunction: string;
        customFactoryInput?: {
          factoryFunction: string;
          params: Array<{ name: string; type: string }>;
          customFactoryAddresses: Record<string, string>;
        };
        modularFactoryInput?: {
          hooksParamName: string;
        };
        factoryAddresses?: Record<string, string>;
      }
    | undefined;
  deployType?: "standard" | "autoFactory" | "customFactory";
  routerType?: "none" | "plugin" | "dynamic" | "modular";
  networksForDeployment?: {
    allNetworks?: boolean;
    networksEnabled?: number[];
  };
  constructorParams?: Record<
    string,
    {
      displayName?: string;
      description?: string;
      defaultValue?: string;
      hidden?: boolean;
    }
  >;
  compositeAbi?: Abi;
  [key: string]: unknown;
};

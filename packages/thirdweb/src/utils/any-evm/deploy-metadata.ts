import type { Abi } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { formatCompilerMetadata } from "../../contract/actions/compiler-metadata.js";
import { download } from "../../storage/download.js";
import type { Hex } from "../encoding/hex.js";
import { withCache } from "../promise/withCache.js";
import type { Prettify } from "../type-utils.js";
import { isZkSyncChain } from "./zksync/isZkSyncChain.js";

type FetchDeployMetadataOptions = {
  uri: string;
  client: ThirdwebClient;
};

export type FetchDeployMetadataResult = Partial<ExtendedMetadata> &
  CompilerMetadata;

/**
 * Fetches the deployment metadata.
 * @param options - The options for fetching the deploy metadata.
 * @returns An object containing the compiler metadata and extended metadata.
 * @internal
 */
export async function fetchDeployMetadata(
  options: FetchDeployMetadataOptions,
): Promise<FetchDeployMetadataResult> {
  const rawMeta: RawCompilerMetadata = await download({
    client: options.client,
    uri: options.uri,
  }).then((r) => r.json());

  const metadataUri = rawMeta.metadataUri;
  const parsedMeta = await fetchAndParseCompilerMetadata({
    client: options.client,
    uri: metadataUri,
  });

  return {
    ...rawMeta,
    ...parsedMeta,
    name: rawMeta.name,
    version: rawMeta.version,
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
  if (
    (!metadata || !metadata.output) &&
    (!metadata.source_metadata || !metadata.source_metadata.output)
  ) {
    throw new Error(
      `Could not resolve metadata for contract at ${options.uri}`,
    );
  }
  return {
    ...metadata,
    ...formatCompilerMetadata(metadata),
  };
}

export async function fetchBytecodeFromCompilerMetadata(options: {
  compilerMetadata: FetchDeployMetadataResult;
  client: ThirdwebClient;
  chain: Chain;
}) {
  const { compilerMetadata, client, chain } = options;
  return withCache(
    async () => {
      const isZksolc = await isZkSyncChain(chain);
      const bytecodeUri = isZksolc
        ? compilerMetadata.compilers?.zksolc?.[0]?.bytecodeUri
        : compilerMetadata.bytecodeUri;

      if (!bytecodeUri) {
        throw new Error(
          `No bytecode URI found in compiler metadata for ${compilerMetadata.name} on chain ${chain.name}`,
        );
      }
      const deployBytecode = await download({
        client,
        uri: bytecodeUri,
      }).then((res) => res.text() as Promise<Hex>);

      return deployBytecode;
    },
    {
      cacheKey: `bytecode:${compilerMetadata.name}:${compilerMetadata.publisher}:${compilerMetadata.version}:${chain.id}`,
      cacheTime: 24 * 60 * 60 * 1000,
    },
  );
}

// types

type RawCompilerMetadata = {
  name: string;
  metadataUri: string;
  bytecodeUri: string;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  analytics?: any;
  version?: string;
  [key: string]: unknown;
};

type ParsedCompilerMetadata = {
  name: string;
  abi: Abi;
  metadata: {
    compiler: {
      version: string;
    };
    language: string;
    output: {
      abi: Abi;
      devdoc: Record<string, unknown>;
      userdoc: Record<string, unknown>;
    };
    settings: {
      compilationTarget: Record<string, unknown>;
      evmVersion: string;
      libraries: Record<string, string>;
      optimizer: Record<string, unknown>;
      remappings: string[];
    };
    sources: Record<
      string,
      { keccak256: string } & (
        | {
            content: string;
          }
        | {
            urls: string[];
            license?: string;
          }
      )
    >;
    [key: string]: unknown;
  };
  info: {
    title?: string;
    author?: string;
    details?: string;
    notice?: string;
  };
  licenses: string[];
  isPartialAbi?: boolean;
  zk_version?: string;
};

export type DynamicParams = {
  type: "address" | "address[]" | "bytes" | "bytes[]";

  // use for address types
  refContracts?: Array<{
    contractId: string;
    publisherAddress: string;
    version: string;
    salt?: string;
  }>;

  // use for bytes
  paramsToEncode?: Array<
    Array<{
      type: string;
      defaultValue?: string;
      dynamicValue?: DynamicParams; // can have address type which may need ref
    }>
  >;
};

export type CompilerMetadata = Prettify<
  RawCompilerMetadata & ParsedCompilerMetadata
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
  defaultModules?:
    | Array<{
        moduleName: string;
        moduleVersion: string;
        publisherAddress: string;
      }>
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
      dynamicValue?: DynamicParams;
    }
  >;
  implConstructorParams?: Record<
    string,
    {
      defaultValue?: string;
      dynamicValue?: DynamicParams;
    }
  >;
  compositeAbi?: Abi;
  compilers?: Record<
    "solc" | "zksolc" | "stylus",
    {
      evmVersion: string;
      compilerVersion: string;
      metadataUri: string;
      bytecodeUri: string;
    }[]
  >;
  externalLinks?: Array<{
    name: string;
    url: string;
  }>;
  [key: string]: unknown;
};

import type { Abi } from "abitype";
import type { Hex } from "viem";
import { download } from "../../../storage/download.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { ThirdwebClient } from "../../../client/client.js";

type FetchDeployMetadataOptions = {
  uri: string;
  client: ThirdwebClient;
};

type FetchDeployMetadataResult = {
  compilerMetadata: PreDeployMetadata;
  extendedMetadata: FullPublishMetadata | undefined;
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
    fetchPreDeployMetadata(options),
    fetchExtendedReleaseMetadata(options).catch(() => undefined),
  ]);
  return { compilerMetadata, extendedMetadata };
}

// helpers
async function fetchExtendedReleaseMetadata(
  options: FetchDeployMetadataOptions,
): Promise<FullPublishMetadata> {
  return JSON.parse(
    await (
      await download({
        uri: options.uri,
        client: options.client,
      })
    ).text(),
  );
}

async function fetchPreDeployMetadata(
  options: FetchDeployMetadataOptions,
): Promise<PreDeployMetadata> {
  const rawMeta = JSON.parse(
    await (await download({ uri: options.uri, client: options.client })).text(),
  ) as RawPredeployMetadata;
  const [deployBytecode, parsedMeta] = await Promise.all([
    download({ uri: rawMeta.bytecodeUri, client: options.client }).then(
      (res) => res.text() as Promise<Hex>,
    ),
    fetchContractMetadata({ client: options.client, uri: rawMeta.metadataUri }),
  ]);

  return {
    ...rawMeta,
    ...parsedMeta,
    bytecode: deployBytecode,
  };
}

const CONTRACT_METADATA_TIMEOUT_SEC = 2 * 1000;

async function fetchContractMetadata(
  options: FetchDeployMetadataOptions,
): Promise<PublishedMetadata> {
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

function formatCompilerMetadata(metadata: any): PublishedMetadata {
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

type RawPredeployMetadata = {
  name: string;
  metadataUri: string;
  bytecodeUri: string;
  analytics?: any;
  [key: string]: any;
};

type PublishedMetadata = {
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

type PreDeployMetadata = Prettify<
  PublishedMetadata & {
    bytecode: Hex;
  }
>;

type FullPublishMetadata = {
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
        factoryAddresses?: Record<string, string>;
      }
    | undefined;
  deployType?: "standard" | "autoFactory" | "customFactory";
  routerType?: "none" | "plugin" | "dynamic";
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

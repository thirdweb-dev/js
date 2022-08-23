import { Abi, ContractId } from "./types";
import { isContractIdBuiltInContract } from "./utils";
import { contractKeys, networkKeys } from "@3rdweb-sdk/react";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import { contractTypeFromContract } from "@3rdweb-sdk/react/hooks/useCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useActiveChainId,
  useAddress,
  useChainId,
  useContract,
  useSDK,
} from "@thirdweb-dev/react";
import {
  ChainId,
  ContractType,
  SUPPORTED_CHAIN_ID,
  SmartContract,
  ThirdwebSDK,
  detectFeatures,
  extractConstructorParamsFromAbi,
  extractEventsFromAbi,
  extractFunctionParamsFromAbi,
  extractFunctionsFromAbi,
  fetchPreDeployMetadata,
  resolveContractUriFromAddress,
} from "@thirdweb-dev/sdk";
import { FeatureWithEnabled } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import {
  ContractInfoSchema,
  ExtraPublishMetadata,
  ProfileMetadata,
  PublishedContract,
} from "@thirdweb-dev/sdk/dist/src/schema/contracts/custom";
import {
  StorageSingleton,
  alchemyUrlMap,
} from "components/app-layouts/providers";
import { BuiltinContractMap } from "constants/mappings";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { ENSResolveResult, isEnsName } from "lib/ens";
import { StaticImageData } from "next/image";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { isBrowser } from "utils/isBrowser";
import { z } from "zod";

export interface ContractPublishMetadata {
  image: string | StaticImageData;
  name: string;
  description?: string;
  abi?: Abi;
  bytecode?: string;
  deployDisabled?: boolean;
  info?: z.infer<typeof ContractInfoSchema>;
  licenses?: string[];
  compilerMetadata?: Record<string, any>;
  analytics?: Record<string, any>;
}

function removeUndefinedFromObject(obj: Record<string, any>) {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// metadata PRE release, only has the compiler output info (from CLI)
export async function fetchContractPublishMetadataFromURI(
  contractId: ContractId,
) {
  const contractIdIpfsHash = toContractIdIpfsHash(contractId);

  if (isContractIdBuiltInContract(contractId)) {
    const details = BuiltinContractMap[contractIdIpfsHash as ContractType];
    return {
      image: details.icon,
      name: details.title,
      deployDisabled: details.comingSoon,
      description: details.description,
    };
  }

  invariant(contractId !== "ipfs://undefined", "uri can't be undefined");
  let resolved;
  try {
    resolved = await fetchPreDeployMetadata(
      contractIdIpfsHash,
      StorageSingleton,
    );
  } catch (err) {
    console.error("failed to resolvePreDeployMetadata", err);
  }

  if (!resolved) {
    return {
      name: "",
      image: "custom",
    };
  }

  return {
    image: (resolved as any)?.image || "custom",
    name: resolved.name,
    description: resolved.info?.title || "",
    abi: resolved.abi,
    info: removeUndefinedFromObject(resolved.info),
    licenses: resolved.licenses,
    compilerMetadata: resolved.metadata,
    analytics: removeUndefinedFromObject(resolved.analytics),
  };
}

export function useContractPublishMetadataFromURI(contractId: ContractId) {
  return useQuery<ContractPublishMetadata>(
    ["publish-metadata", contractId],
    () => fetchContractPublishMetadataFromURI(contractId),
    {
      enabled: !!contractId,
    },
  );
}

// metadata PRE release, only contains the compiler output
// if passing an addres, also fetches the latest version of the matching contract
export function useContractPrePublishMetadata(uri: string, address?: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(uri);
  const sdk = useSDK();
  return useQuery(
    ["pre-publish-metadata", uri, address],
    async () => {
      invariant(
        !isContractIdBuiltInContract(uri),
        "Skipping publish metadata fetch for built-in contract",
      );
      invariant(address, "address is not defined");
      // TODO: Make this nicer.
      invariant(uri !== "ipfs://undefined", "uri can't be undefined");
      return await sdk
        ?.getPublisher()
        .fetchPrePublishMetadata(contractIdIpfsHash, address);
    },
    {
      enabled: !!uri && !!address,
    },
  );
}

// Metadata POST release, contains all the extra information filled in by the user
export function useContractFullPublishMetadata(uri: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(uri);
  const sdk = useSDK();
  return useQuery(
    ["full-publish-metadata", uri],
    async () => {
      invariant(
        !isContractIdBuiltInContract(uri),
        "Skipping publish metadata fetch for built-in contract",
      );
      // TODO: Make this nicer.
      invariant(uri !== "ipfs://undefined", "uri can't be undefined");
      return await sdk
        ?.getPublisher()
        .fetchFullPublishMetadata(contractIdIpfsHash);
    },
    {
      enabled: !!uri,
    },
  );
}

export async function fetchReleaserProfile(
  sdk?: ThirdwebSDK,
  publisherAddress?: string | null,
) {
  invariant(publisherAddress, "address is not defined");
  invariant(sdk, "sdk not provided");
  return await sdk.getPublisher().getPublisherProfile(publisherAddress);
}

export function useReleaserProfile(publisherAddress?: string) {
  const sdk = useSDK();
  return useQuery(
    ["releaser-profile", publisherAddress],
    () => fetchReleaserProfile(sdk, publisherAddress),
    {
      enabled: !!publisherAddress,
    },
  );
}

export function useLatestRelease(
  publisherAddress?: string,
  contractName?: string,
) {
  const sdk = useSDK();
  return useQuery(
    ["latest-release", publisherAddress, contractName],
    async () => {
      invariant(publisherAddress, "address is not defined");
      invariant(contractName, "contract name is not defined");
      invariant(sdk, "sdk not provided");

      const latestRelease = await sdk
        .getPublisher()
        .getLatest(publisherAddress, contractName);

      invariant(latestRelease, "latest release is not defined");

      const contractInfo = await sdk
        .getPublisher()
        .fetchPublishedContractInfo(latestRelease);

      return {
        ...latestRelease,
        version: contractInfo.publishedMetadata.version || "",
        name: contractInfo.publishedMetadata.name || "",
        description: contractInfo.publishedMetadata.description || "",
        releaser: contractInfo.publishedMetadata.publisher || "",
        tags: contractInfo.publishedMetadata.tags || [],
      };
    },
    {
      enabled: !!publisherAddress && !!contractName,
    },
  );
}

export async function fetchAllVersions(
  sdk?: ThirdwebSDK,
  publisherAddress?: string,
  contractName?: string,
) {
  invariant(publisherAddress, "address is not defined");
  invariant(contractName, "contract name is not defined");
  invariant(sdk, "sdk not provided");
  const allVersions = await sdk
    .getPublisher()
    .getAllVersions(publisherAddress, contractName);

  const releasedVersions = [];

  for (let i = 0; i < allVersions.length; i++) {
    const contractInfo = await sdk
      .getPublisher()
      .fetchPublishedContractInfo(allVersions[i]);

    releasedVersions.unshift({
      ...allVersions[i],
      version: contractInfo.publishedMetadata.version,
      name: contractInfo.publishedMetadata.name,
      description: contractInfo.publishedMetadata.description || "",
      releaser: contractInfo.publishedMetadata.publisher || "",
      tags: contractInfo.publishedMetadata.tags || [],
    });
  }

  return releasedVersions;
}

export function useAllVersions(
  publisherAddress?: string,
  contractName?: string,
) {
  const sdk = useSDK();
  return useQuery(
    ["all-releases", publisherAddress, contractName],
    () => fetchAllVersions(sdk, publisherAddress, contractName),
    {
      enabled: !!publisherAddress && !!contractName && !!sdk,
    },
  );
}

export function useReleasesFromDeploy(
  contractAddress?: string,
  chainId?: SUPPORTED_CHAIN_ID,
) {
  const activeChainId = useActiveChainId();
  const cId = chainId || activeChainId;

  const provider = cId
    ? new ethers.providers.StaticJsonRpcProvider(alchemyUrlMap[cId])
    : undefined;

  const polygonSdk = new ThirdwebSDK(
    alchemyUrlMap[ChainId.Polygon],
    {
      readonlySettings: {
        chainId: ChainId.Polygon,
        rpcUrl: alchemyUrlMap[ChainId.Polygon],
      },
    },
    StorageSingleton,
  );
  return useQuery(
    (networkKeys.chain(cId) as readonly unknown[]).concat([
      "release-from-deploy",
      contractAddress,
    ]),
    async () => {
      invariant(contractAddress, "contractAddress is not defined");
      invariant(provider, "provider is not defined");
      const compilerMetaUri = await resolveContractUriFromAddress(
        contractAddress,
        provider,
      );

      if (compilerMetaUri) {
        return await polygonSdk
          .getPublisher()
          .resolvePublishMetadataFromCompilerMetadata(compilerMetaUri);
      }

      return undefined;
    },
    {
      enabled: !!contractAddress && !!provider,
    },
  );
}

export async function fetchReleasedContractInfo(
  sdk?: ThirdwebSDK,
  contract?: PublishedContract,
) {
  invariant(contract, "contract is not defined");
  invariant(sdk, "sdk not provided");
  return await sdk.getPublisher().fetchPublishedContractInfo(contract);
}

export function useReleasedContractInfo(contract: PublishedContract) {
  const sdk = useSDK();
  return useQuery(
    ["released-contract", contract],
    () => fetchReleasedContractInfo(sdk, contract),
    {
      enabled: !!contract,
    },
  );
}
export function useReleasedContractFunctions(contract: PublishedContract) {
  const { data: meta } = useContractPublishMetadataFromURI(
    contract.metadataUri,
  );
  return meta
    ? extractFunctionsFromAbi(meta.abi as Abi, meta?.compilerMetadata)
    : undefined;
}
export function useReleasedContractEvents(contract: PublishedContract) {
  const { data: meta } = useContractPublishMetadataFromURI(
    contract.metadataUri,
  );
  return meta
    ? extractEventsFromAbi(meta.abi as Abi, meta?.compilerMetadata)
    : undefined;
}

export function useReleasedContractCompilerMetadata(
  contract: PublishedContract,
) {
  return useContractPublishMetadataFromURI(contract.metadataUri);
}

export function useConstructorParamsFromABI(abi?: Abi) {
  return useMemo(() => {
    return abi ? extractConstructorParamsFromAbi(abi) : [];
  }, [abi]);
}

export function useFunctionParamsFromABI(abi?: any, functionName?: string) {
  return useMemo(() => {
    return abi && functionName
      ? extractFunctionParamsFromAbi(abi, functionName)
      : [];
  }, [abi, functionName]);
}

export function toContractIdIpfsHash(contractId: ContractId) {
  if (
    isContractIdBuiltInContract(contractId) ||
    contractId?.startsWith("ipfs://")
  ) {
    return contractId;
  }
  return `ipfs://${contractId}`;
}

interface PublishMutationData {
  predeployUri: string;
  extraMetadata: ExtraPublishMetadata;
  contractName?: string;
}

export function usePublishMutation() {
  const sdk = useSDK();

  const address = useAddress();

  return useMutationWithInvalidate(
    async ({ predeployUri, extraMetadata }: PublishMutationData) => {
      invariant(
        sdk && "getPublisher" in sdk,
        "sdk is not ready or does not support publishing",
      );
      const contractIdIpfsHash = toContractIdIpfsHash(predeployUri);
      await sdk.getPublisher().publish(contractIdIpfsHash, extraMetadata);
    },
    {
      onSuccess: (_data, variables, _options, invalidate) => {
        return Promise.all([
          invalidate([["pre-publish-metadata", variables.predeployUri]]),
          fetch(
            `/api/revalidate/release?address=${address}&contractName=${variables.contractName}`,
          ).catch((err) => console.error("failed to revalidate", err)),
        ]);
      },
    },
  );
}

export function useEditProfileMutation() {
  const sdk = useSDK();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (data: ProfileMetadata) => {
      invariant(sdk, "sdk not provided");
      await sdk.getPublisher().updatePublisherProfile(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return Promise.all([
          invalidate([["releaser-profile", address]]),
          fetch(`/api/revalidate/release?address=${address}`).catch((err) =>
            console.error("failed to revalidate", err),
          ),
        ]);
      },
    },
  );
}

interface ContractDeployMutationParams {
  constructorParams: unknown[];
  addToDashboard?: boolean;
}

export function useCustomContractDeployMutation(ipfsHash: string) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  const chainId = useChainId();

  return useMutation(
    async (data: ContractDeployMutationParams) => {
      invariant(
        sdk && "getPublisher" in sdk,
        "sdk is not ready or does not support publishing",
      );
      const contractAddress = await sdk.deployer.deployContractFromUri(
        ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`,
        data.constructorParams,
      );
      if (data.addToDashboard) {
        const registry = await sdk?.deployer.getRegistry();
        await registry?.addContract(contractAddress);
      }
      return contractAddress;
    },
    {
      onSuccess: async () => {
        return await queryClient.invalidateQueries([
          ...networkKeys.chain(chainId),
          ...contractKeys.list(walletAddress),
        ]);
      },
    },
  );
}

export async function fetchPublishedContracts(
  sdk?: ThirdwebSDK,
  address?: string | null,
) {
  invariant(sdk, "sdk not provided");
  invariant(address, "address is not defined");
  return ((await sdk.getPublisher().getAll(address)) || []).filter((c) => c.id);
}

export function usePublishedContractsQuery(address?: string) {
  const sdk = useSDK();
  return useQuery(
    ["published-contracts", address],
    () => fetchPublishedContracts(sdk, address),
    {
      enabled: !!address && !!sdk,
    },
  );
}

export function usePublishedMetadataQuery(contractAddress: string) {
  const contractQuery = useContract(contractAddress);
  return useQuery(
    ["published-metadata", contractAddress],
    async () => {
      if (contractQuery?.contract instanceof SmartContract) {
        return await contractQuery.contract.publishedMetadata.get();
      }
      if (contractQuery?.contract) {
        return BuiltinContractMap[
          contractTypeFromContract(contractQuery.contract)
        ];
      }
      return undefined;
    },
    {
      enabled: !!contractAddress && !!contractQuery?.contract,
    },
  );
}

export function useContractFeatures(abi?: any) {
  return useMemo(() => {
    return abi ? detectFeatures(abi) : undefined;
  }, [abi]);
}

const ALWAYS_SUGGESTED = ["ContractMetadata", "Permissions"];

function extractExtensions(
  input: ReturnType<typeof detectFeatures>,
  enabledExtensions: FeatureWithEnabled[] = [],
  suggestedExtensions: FeatureWithEnabled[] = [],
  parent = "__ROOT__",
) {
  if (!input) {
    return {
      enabledExtensions,
      suggestedExtensions,
    };
  }
  for (const extensionKey in input) {
    const extension = input[extensionKey];
    // if extension is enabled, then add it to enabledFeatures
    if (extension.enabled) {
      enabledExtensions.push(extension);
    }
    // otherwise if it is disabled, but it's parent is enabled or suggested, then add it to suggestedFeatures
    else if (
      enabledExtensions.findIndex((f) => f.name === parent) > -1 ||
      ALWAYS_SUGGESTED.includes(extension.name)
    ) {
      suggestedExtensions.push(extension);
    }
    // recurse
    extractExtensions(
      extension.features,
      enabledExtensions,
      suggestedExtensions,
      extension.name,
    );
  }

  return {
    enabledExtensions,
    suggestedExtensions,
  };
}

export function useContractDetectedExtensions(abi?: any) {
  const features = useMemo(() => {
    if (abi) {
      return extractExtensions(detectFeatures(abi));
    }
    return undefined;
  }, [abi]);
  return features;
}

export function useContractEnabledExtensions(abi?: any) {
  const extensions = useContractDetectedExtensions(abi);
  return extensions ? extensions.enabledExtensions : [];
}

function getAbsoluteUrlForSSR(path: string) {
  if (isBrowser()) {
    return path;
  }
  const url = new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  );
  url.pathname = path;
  return url;
}

async function fetchEns(addressOrEnsName: string): Promise<ENSResolveResult> {
  const res = await fetch(getAbsoluteUrlForSSR(`/api/ens/${addressOrEnsName}`));
  return await res.json();
}

const ensQueryKey = (addressOrEnsName: string) => {
  return ["ens", addressOrEnsName] as const;
};

function useEns(addressOrEnsName?: string) {
  return useQuery(
    ensQueryKey(addressOrEnsName || ""),
    () =>
      addressOrEnsName
        ? fetchEns(addressOrEnsName)
        : { address: null, ensName: null },
    {
      enabled:
        !!addressOrEnsName &&
        (isAddress(addressOrEnsName) || isEnsName(addressOrEnsName)),
      // 24h
      cacheTime: 60 * 60 * 24 * 1000,
      // 1h
      staleTime: 60 * 60 * 1000,
      // default to the one we know already
      placeholderData: {
        address: isAddress(addressOrEnsName || "") ? addressOrEnsName : null,
        ensName: isEnsName(addressOrEnsName || "") ? addressOrEnsName : null,
      },
    },
  );
}

export const ens = {
  queryKey: ensQueryKey,
  useQuery: useEns,
  fetch: fetchEns,
};

export function useContractEvents(contract: SmartContract | null) {
  const sdk = useSDK();
  const activeChainId = useActiveChainId();
  return useQueryWithNetwork(
    ["contract-events", contract?.getAddress(), activeChainId],
    async () => {
      if (contract instanceof SmartContract) {
        return contract.publishedMetadata.extractEvents();
      }
      return null;
    },
    {
      enabled: !!contract?.getAddress() || !!sdk,
      // functions are based on publish metadata (abi), so this is immutable
      staleTime: Infinity,
    },
  );
}

export function useContractFunctions(contract: SmartContract | null) {
  const sdk = useSDK();
  const activeChainId = useActiveChainId();
  return useQueryWithNetwork(
    ["contract-functions", contract?.getAddress(), activeChainId],
    async () => {
      if (contract instanceof SmartContract) {
        return contract.publishedMetadata.extractFunctions();
      }
      return null;
    },
    {
      enabled: !!contract?.getAddress() || !!sdk,
      // functions are based on publish metadata (abi), so this is immutable
      staleTime: Infinity,
    },
  );
}

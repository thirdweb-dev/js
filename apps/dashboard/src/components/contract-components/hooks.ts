import { thirdwebClient } from "@/constants/client";
import { networkKeys, useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useMutationWithInvalidate } from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type ExtraPublishMetadata,
  type FeatureName,
  type FeatureWithEnabled,
  type PublishedContract,
  type ThirdwebSDK,
  detectFeatures,
  fetchContractMetadata,
  fetchPreDeployMetadata,
  isExtensionEnabled,
} from "@thirdweb-dev/sdk";
import type { Abi } from "abitype";
import type { ProfileMetadataInput } from "constants/schemas";
import { useSupportedChain } from "hooks/chains/configureChains";
import { isEnsName, resolveEns } from "lib/ens";
import { getDashboardChainRpc } from "lib/rpc";
import {
  StorageSingleton,
  getPolygonGaslessSDK,
  getThirdwebSDK,
} from "lib/sdk";
import { useMemo } from "react";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { resolveContractAbi } from "thirdweb/contract";
import { useActiveAccount } from "thirdweb/react";
import { isAddress } from "thirdweb/utils";
import invariant from "tiny-invariant";
import { useV5DashboardChain } from "../../lib/v5-adapter";
import { useEthersSigner } from "../app-layouts/provider-setup";
import {
  type PublishedContractWithVersion,
  fetchPublishedContractVersions,
  fetchPublisherProfile,
} from "./fetch-contracts-with-versions";
import type { ContractId } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: FIXME
function removeUndefinedFromObject(obj: Record<string, any>) {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// metadata PRE publish, only has the compiler output info (from CLI)
async function fetchContractPublishMetadataFromURI(contractId: ContractId) {
  const contractIdIpfsHash = toContractIdIpfsHash(contractId);

  invariant(contractId !== "ipfs://undefined", "uri can't be undefined");
  let resolved: Awaited<ReturnType<typeof fetchPreDeployMetadata>> | undefined =
    undefined;
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
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
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
  return useQuery({
    queryKey: ["publish-metadata", contractId],
    queryFn: () => fetchContractPublishMetadataFromURI(contractId),
    enabled: !!contractId,
  });
}

// metadata PRE publish, only contains the compiler output
// if passing an address, also fetches the latest version of the matching contract
export function useContractPrePublishMetadata(uri: string, address?: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(uri);

  return useQuery({
    queryKey: ["pre-publish-metadata", uri, address],
    queryFn: async () => {
      invariant(address, "address is not defined");
      // TODO: Make this nicer.
      invariant(uri !== "ipfs://undefined", "uri can't be undefined");
      const sdk = getThirdwebSDK(
        polygon.id,
        getDashboardChainRpc(polygon.id, undefined),
      );
      return await sdk
        ?.getPublisher()
        .fetchPrePublishMetadata(contractIdIpfsHash, address);
    },

    enabled: !!uri && !!address,
  });
}

async function fetchFullPublishMetadata(
  sdk: ThirdwebSDK,
  uri: string,
  queryClient: QueryClient,
) {
  const rawPublishMetadata = await sdk
    .getPublisher()
    .fetchFullPublishMetadata(uri);

  const ensResult = rawPublishMetadata.publisher
    ? await queryClient.fetchQuery(ensQuery(rawPublishMetadata.publisher))
    : undefined;

  return {
    ...rawPublishMetadata,
    publisher:
      ensResult?.ensName || ensResult?.address || rawPublishMetadata.publisher,
  };
}

// Metadata POST publish, contains all the extra information filled in by the user
export function useContractFullPublishMetadata(uri: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(uri);

  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["full-publish-metadata", uri],
    queryFn: async () => {
      const sdk = getThirdwebSDK(
        polygon.id,
        getDashboardChainRpc(polygon.id, undefined),
      );
      // TODO: Make this nicer.
      invariant(uri !== "ipfs://undefined", "uri can't be undefined");
      return await fetchFullPublishMetadata(
        sdk,
        contractIdIpfsHash,
        queryClient,
      );
    },

    enabled: !!uri,
  });
}

export function publisherProfileQuery(publisherAddress?: string) {
  return {
    queryKey: ["releaser-profile", publisherAddress],
    queryFn: () => {
      if (!publisherAddress) {
        throw new Error("publisherAddress is not defined");
      }
      return fetchPublisherProfile(publisherAddress);
    },
    enabled: !!publisherAddress,
    // 24h
    cacheTime: 60 * 60 * 24 * 1000,
    // 1h
    staleTime: 60 * 60 * 1000,
  };
}

export function usePublisherProfile(publisherAddress?: string) {
  return useQuery(publisherProfileQuery(publisherAddress));
}

export function useAllVersions(
  publisherAddress: string | undefined,
  contractId: string | undefined,
) {
  return useQuery({
    queryKey: ["all-releases", publisherAddress, contractId],
    queryFn: () => {
      if (!publisherAddress || !contractId) {
        // should never happen because we check for this in the enabled check
        throw new Error("publisherAddress or contractId is not defined");
      }
      return fetchPublishedContractVersions(publisherAddress, contractId);
    },

    enabled: !!publisherAddress && !!contractId,
  });
}

export function usePublishedContractsFromDeploy(
  contractAddress?: string,
  chainId?: number,
) {
  const activeChainId = useDashboardEVMChainId();
  const cId = chainId || activeChainId;
  const chainInfo = useSupportedChain(cId || -1);

  return useQuery({
    queryKey: (networkKeys.chain(cId) as readonly unknown[]).concat([
      "release-from-deploy",
      contractAddress,
    ]),
    queryFn: async () => {
      invariant(contractAddress, "contractAddress is not defined");
      invariant(cId, "chain not defined");

      const rpcUrl = chainInfo
        ? getDashboardChainRpc(cId, chainInfo)
        : undefined;

      invariant(rpcUrl, "rpcUrl not defined");
      const sdk = getThirdwebSDK(cId, rpcUrl);

      const contractUri = await sdk
        .getPublisher()
        .resolveContractUriFromAddress(contractAddress);

      const polygonSdk = getThirdwebSDK(
        polygon.id,
        getDashboardChainRpc(polygon.id, undefined),
      );

      return await polygonSdk
        .getPublisher()
        .resolvePublishMetadataFromCompilerMetadata(contractUri);
    },

    enabled: !!contractAddress && !!cId && !!chainInfo,
    retry: false,
  });
}

function publishedContractWithVersionToLegacy(
  input: PublishedContractWithVersion,
) {
  return {
    ...input,
    timestamp: input.publishTimestamp.toString(),
    id: input.contractId,
    metadataUri: input.publishMetadataUri,
  } satisfies PublishedContract;
}

export async function fetchPublishedContractInfo(
  sdk?: ThirdwebSDK,
  contract?: PublishedContractWithVersion,
) {
  invariant(contract, "contract is not defined");
  invariant(sdk, "sdk not provided");
  return await sdk
    .getPublisher()
    .fetchPublishedContractInfo(publishedContractWithVersionToLegacy(contract));
}

export function usePublishedContractInfo(
  contract: PublishedContractWithVersion,
) {
  const sdk = getThirdwebSDK(
    polygon.id,
    getDashboardChainRpc(polygon.id, undefined),
  );
  return useQuery({
    queryKey: ["released-contract", contract],
    queryFn: () =>
      fetchPublishedContractInfo(
        sdk,
        publishedContractWithVersionToLegacy(contract),
      ),
    enabled: !!contract,
  });
}
export function usePublishedContractFunctions(
  publishedContract: PublishedContractWithVersion,
) {
  const compositeAbi = publishedContract.compositeAbi;

  const dynamicContractType = publishedContract.routerType;
  if (
    compositeAbi &&
    (dynamicContractType === "plugin" ||
      dynamicContractType === "dynamic" ||
      !publishedContract.deployType ||
      publishedContract.name.includes("MarketplaceV3"))
  ) {
    return compositeAbi.filter((f) => f.type === "function");
  }

  return publishedContract?.abi?.filter((f) => f.type === "function") || [];
}
export function usePublishedContractEvents(
  publishedContract: PublishedContractWithVersion,
) {
  const compositeAbi = publishedContract.compositeAbi;

  const dynamicContractType = publishedContract.routerType;
  if (
    compositeAbi &&
    (dynamicContractType === "plugin" ||
      dynamicContractType === "dynamic" ||
      !publishedContract.deployType ||
      publishedContract.name.includes("MarketplaceV3"))
  ) {
    return compositeAbi.filter((f) => f.type === "event");
  }

  return publishedContract?.abi?.filter((f) => f.type === "event") || [];
}

export function usePublishedContractCompilerMetadata(
  contract: PublishedContractWithVersion,
) {
  return useContractPublishMetadataFromURI(contract.publishMetadataUri);
}

export function useFunctionParamsFromABI(abi?: Abi, functionName?: string) {
  return useMemo(() => {
    return abi && functionName
      ? abi
          .filter((a) => a.type === "function")
          .find((a) => a.name === functionName)?.inputs || []
      : [];
  }, [abi, functionName]);
}

function toContractIdIpfsHash(contractId: ContractId) {
  if (contractId?.startsWith("ipfs://")) {
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
  const address = useActiveAccount()?.address;
  // TODO: remove this obviously
  const signer = useEthersSigner();

  return useMutationWithInvalidate(
    async ({ predeployUri, extraMetadata }: PublishMutationData) => {
      if (!signer) {
        throw new Error("Signer not found");
      }
      const sdk = getPolygonGaslessSDK(signer);
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
            `/api/revalidate/publish?address=${address}&contractName=${variables.contractName}`,
          ).catch((err) => console.error("failed to revalidate", err)),
        ]);
      },
    },
  );
}

export function useEditProfileMutation() {
  const address = useActiveAccount()?.address;
  // TODO: remove this obviously
  const signer = useEthersSigner();

  return useMutationWithInvalidate(
    async (data: ProfileMetadataInput) => {
      if (!signer) {
        throw new Error("Signer not found");
      }
      const sdk = getPolygonGaslessSDK(signer);
      await sdk.getPublisher().updatePublisherProfile(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return Promise.all([
          invalidate([["releaser-profile", address]]),
          fetch(`/api/revalidate/publish?address=${address}`).catch((err) =>
            console.error("failed to revalidate", err),
          ),
        ]);
      },
    },
  );
}

export async function fetchPublishedContracts(
  sdk: ThirdwebSDK,
  queryClient: QueryClient,
  address?: string | null,
) {
  invariant(sdk, "sdk not provided");
  invariant(address, "address is not defined");
  const tempResult = ((await sdk.getPublisher().getAll(address)) || []).filter(
    (c) => c.id,
  );
  return await Promise.all(
    tempResult.map(async (c) => ({
      ...c,
      metadata: await fetchFullPublishMetadata(sdk, c.metadataUri, queryClient),
    })),
  );
}

export async function fetchPublishedContractsWithFeature(
  sdk: ThirdwebSDK,
  queryClient: QueryClient,
  feature: FeatureName,
  address?: string | null,
) {
  invariant(sdk, "sdk not provided");
  invariant(address, "address is not defined");
  const tempResult = ((await sdk.getPublisher().getAll(address)) || []).filter(
    (c) => c.id,
  );
  const tempResultWithMetadata = await Promise.all(
    tempResult.map(async (c) => ({
      ...c,
      metadata: await fetchFullPublishMetadata(sdk, c.metadataUri, queryClient),
    })),
  );

  const resultWithFeature = await Promise.all(
    tempResultWithMetadata.map(async (c) => ({
      ...c,
      deployMetadata: await fetchContractMetadata(
        c.metadata.metadataUri,
        StorageSingleton,
      ),
    })),
  );

  return resultWithFeature.filter((c) => {
    // @ts-expect-error - this is the "wrong" abi type, but it works fine
    const extensions = detectFeatures(c.deployMetadata.abi as Abi);
    // @ts-expect-error - this is the "wrong" abi type, but it works fine
    return isExtensionEnabled(c.deployMetadata.abi as Abi, feature, extensions);
  });
}

export type PublishedContractDetails = Awaited<
  ReturnType<typeof fetchPublishedContracts>
>[number];

export function usePublishedContractsQuery(
  address?: string,
  feature?: FeatureName,
) {
  const queryClient = useQueryClient();
  return useQuery<PublishedContractDetails[]>({
    queryKey: ["published-contracts", address, feature],
    queryFn: () => {
      const sdk = getThirdwebSDK(
        polygon.id,
        getDashboardChainRpc(polygon.id, undefined),
      );
      return feature && feature.length > 0
        ? fetchPublishedContractsWithFeature(sdk, queryClient, feature, address)
        : fetchPublishedContracts(sdk, queryClient, address);
    },
    enabled: !!address,
  });
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

function useContractDetectedExtensions(abi?: Abi) {
  const features = useMemo(() => {
    if (abi) {
      // @ts-expect-error - this is the "wrong" abi type, but it works fine
      return extractExtensions(detectFeatures(abi));
    }
    return undefined;
  }, [abi]);
  return features;
}

export function useContractEnabledExtensions(abi?: Abi) {
  const extensions = useContractDetectedExtensions(abi);
  return extensions ? extensions.enabledExtensions : [];
}

export function ensQuery(addressOrEnsName?: string) {
  // if the address is `thirdweb.eth` we actually want `deployer.thirdweb.eth` here...
  if (addressOrEnsName === "thirdweb.eth") {
    // biome-ignore lint/style/noParameterAssign: FIXME
    addressOrEnsName = "deployer.thirdweb.eth";
  }
  const placeholderData = {
    address: isAddress(addressOrEnsName || "")
      ? addressOrEnsName || null
      : null,
    ensName: null,
  };
  return {
    queryKey: ["ens", addressOrEnsName],
    queryFn: async () => {
      if (!addressOrEnsName) {
        return placeholderData;
      }
      // if it is neither an address or an ens name then return the placeholder data only
      if (!isAddress(addressOrEnsName) && !isEnsName(addressOrEnsName)) {
        throw new Error("Invalid address or ENS name.");
      }

      const { address, ensName } = await resolveEns(addressOrEnsName).catch(
        () => ({
          address: isAddress(addressOrEnsName || "")
            ? addressOrEnsName || null
            : null,
          ensName: null,
        }),
      );

      if (isEnsName(addressOrEnsName) && !address) {
        throw new Error("Failed to resolve ENS name.");
      }

      return {
        address,
        ensName,
      };
    },
    enabled:
      !!addressOrEnsName &&
      (isAddress(addressOrEnsName) || isEnsName(addressOrEnsName)),
    // 24h
    cacheTime: 60 * 60 * 24 * 1000,
    // 1h
    staleTime: 60 * 60 * 1000,
    // default to the one we know already
    placeholderData,
    retry: false,
  } as const;
}

export function useEns(addressOrEnsName?: string) {
  return useQuery(ensQuery(addressOrEnsName));
}

export function useContractFunctions(abi: Abi) {
  return abi
    .filter((a) => a.type === "function")
    .map((f) => ({
      ...f,
      // fake "field" for the "signature"
      signature: `${f.name}(${f.inputs.map((i) => i.type).join(",")})`,
    }));
}

export function useContractEvents(abi: Abi) {
  return abi.filter((a) => a.type === "event");
}

export function useCustomFactoryAbi(contractAddress: string, chainId: number) {
  const chain = useV5DashboardChain(chainId);
  const contract = useMemo(() => {
    return getContract({
      client: thirdwebClient,
      address: contractAddress,
      chain,
    });
  }, [contractAddress, chain]);
  return useQuery({
    queryKey: ["custom-factory-abi", contract],
    queryFn: () => resolveContractAbi<Abi>(contract),
    enabled: !!contract,
  });
}

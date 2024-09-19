import { useThirdwebClient } from "@/constants/thirdweb.client";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Abi } from "abitype";
import { isEnsName, resolveEns } from "lib/ens";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { type ThirdwebContract, getContract } from "thirdweb";
import {
  getBytecode,
  resolveContractAbi,
  fetchDeployMetadata as sdkFetchDeployMetadata,
} from "thirdweb/contract";
import {
  getAllPublishedContracts,
  getContractPublisher,
  getPublishedUriFromCompilerUri,
} from "thirdweb/extensions/thirdweb";
import { extractIPFSUri, isAddress } from "thirdweb/utils";
import invariant from "tiny-invariant";
import {
  type PublishedContractWithVersion,
  fetchPublishedContractVersions,
  fetchPublisherProfile,
} from "./fetch-contracts-with-versions";
import type { ContractId } from "./types";

function isAnyObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function removeUndefinedFromObjectDeep<T extends Record<string, unknown>>(
  obj: T,
): T {
  const newObj = {} as T;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    } else if (isAnyObject(obj[key])) {
      newObj[key] = removeUndefinedFromObjectDeep(obj[key]);
    }
  }
  return newObj;
}

// metadata PRE publish, only has the compiler output info (from CLI)
async function fetchDeployMetadata(contractId: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(contractId);

  return removeUndefinedFromObjectDeep(
    await sdkFetchDeployMetadata({
      client: getThirdwebClient(),
      uri: contractIdIpfsHash,
    }),
  );
}

export function useFetchDeployMetadata(contractId: ContractId) {
  return useQuery({
    queryKey: ["publish-metadata", contractId],
    queryFn: () => fetchDeployMetadata(contractId),
    enabled: !!contractId,
  });
}

function publisherProfileQuery(publisherAddress?: string) {
  return queryOptions({
    queryKey: ["releaser-profile", publisherAddress],
    queryFn: () => {
      if (!publisherAddress) {
        throw new Error("publisherAddress is not defined");
      }
      return fetchPublisherProfile(publisherAddress);
    },
    enabled: !!publisherAddress,
    // 24h
    gcTime: 60 * 60 * 24 * 1000,
    // 1h
    staleTime: 60 * 60 * 1000,
  });
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

export function usePublishedContractsFromDeploy(contract: ThirdwebContract) {
  const client = useThirdwebClient();
  return useQuery({
    queryKey: [
      "published-contracts-from-deploy",
      contract.chain.id,
      contract.address,
    ],
    queryFn: async () => {
      const bytecode = await getBytecode(contract);
      const contractUri = extractIPFSUri(bytecode);
      if (!contractUri) {
        throw new Error("No IPFS URI found in bytecode");
      }

      const publishURIs = await getPublishedUriFromCompilerUri({
        contract: getContractPublisher(client),
        compilerMetadataUri: contractUri,
      });

      return await Promise.all(
        publishURIs.map((uri) => fetchDeployMetadata(uri)),
      );
    },

    enabled: !!contract,
    retry: false,
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

async function fetchPublishedContracts(address?: string | null) {
  invariant(address, "address is not defined");
  const tempResult = (
    (await getAllPublishedContracts({
      contract: getContractPublisher(getThirdwebClient()),
      publisher: address,
    })) || []
  ).filter((c) => c.contractId);
  return await Promise.all(
    tempResult.map(async (c) => ({
      ...c,
      metadata: await fetchDeployMetadata(c.publishMetadataUri),
    })),
  );
}

export type PublishedContractDetails = Awaited<
  ReturnType<typeof fetchPublishedContracts>
>[number];

export function usePublishedContractsQuery(address?: string) {
  return useQuery<PublishedContractDetails[]>({
    queryKey: ["published-contracts", address],
    queryFn: () => fetchPublishedContracts(address),
    enabled: !!address,
  });
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
  return queryOptions({
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
    gcTime: 60 * 60 * 24 * 1000,
    // 1h
    staleTime: 60 * 60 * 1000,
    // default to the one we know already
    placeholderData,
    retry: false,
  });
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
  const client = useThirdwebClient();
  const contract = useMemo(() => {
    return getContract({
      client,
      address: contractAddress,
      chain,
    });
  }, [contractAddress, chain, client]);
  return useQuery({
    queryKey: ["custom-factory-abi", contract],
    queryFn: () => resolveContractAbi<Abi>(contract),
    enabled: !!contract,
  });
}

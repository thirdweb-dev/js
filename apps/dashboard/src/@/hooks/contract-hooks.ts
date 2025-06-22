"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Abi } from "abitype";
import { useMemo } from "react";
import type { ThirdwebClient, ThirdwebContract } from "thirdweb";
import { getContract, resolveContractAbi } from "thirdweb/contract";
import { isAddress, isValidENSName } from "thirdweb/utils";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { resolveEns } from "@/lib/ens";
import {
  fetchPublishedContractVersions,
  type PublishedContractWithVersion,
} from "../components/contract-components/fetch-contracts-with-versions";
import { fetchPublishedContracts } from "../components/contract-components/fetchPublishedContracts";
import { fetchPublishedContractsFromDeploy } from "../components/contract-components/fetchPublishedContractsFromDeploy";

export function useAllVersions(
  publisherAddress: string | undefined,
  contractId: string | undefined,
  client: ThirdwebClient,
) {
  return useQuery({
    enabled: !!publisherAddress && !!contractId,
    queryFn: () => {
      if (!publisherAddress || !contractId) {
        // should never happen because we check for this in the enabled check
        throw new Error("publisherAddress or contractId is not defined");
      }
      return fetchPublishedContractVersions(
        publisherAddress,
        contractId,
        client,
      );
    },
    queryKey: ["all-releases", publisherAddress, contractId],
  });
}

export function usePublishedContractsFromDeploy(contract: ThirdwebContract) {
  return useQuery({
    enabled: !!contract,
    queryFn: () =>
      fetchPublishedContractsFromDeploy({
        contract,
      }),
    queryKey: [
      "published-contracts-from-deploy",
      contract.chain.id,
      contract.address,
    ],
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

export type PublishedContractDetails = Awaited<
  ReturnType<typeof fetchPublishedContracts>
>[number];

export function usePublishedContractsQuery(params: {
  client: ThirdwebClient;
  address?: string;
}) {
  const { client, address } = params;
  return useQuery<PublishedContractDetails[]>({
    enabled: !!address,
    queryFn: () => fetchPublishedContracts({ address, client }),
    queryKey: ["published-contracts", address],
  });
}

function ensQuery(params: {
  addressOrEnsName?: string;
  client: ThirdwebClient;
}) {
  let addressOrEnsName = params.addressOrEnsName;

  // if the address is `thirdweb.eth` we actually want `deployer.thirdweb.eth` here...
  if (addressOrEnsName === "thirdweb.eth") {
    addressOrEnsName = "deployer.thirdweb.eth";
  }
  const placeholderData = {
    address: isAddress(addressOrEnsName || "")
      ? addressOrEnsName || null
      : null,
    ensName: null,
  };
  return queryOptions({
    enabled:
      !!addressOrEnsName &&
      (isAddress(addressOrEnsName) || isValidENSName(addressOrEnsName)),
    // 24h
    gcTime: 60 * 60 * 24 * 1000,
    // default to the one we know already
    placeholderData,
    queryFn: async () => {
      if (!addressOrEnsName) {
        return placeholderData;
      }
      // if it is neither an address or an ens name then return the placeholder data only
      if (!isAddress(addressOrEnsName) && !isValidENSName(addressOrEnsName)) {
        throw new Error("Invalid address or ENS name.");
      }

      const { address, ensName } = await resolveEns(
        addressOrEnsName,
        params.client,
      ).catch(() => ({
        address: isAddress(addressOrEnsName || "")
          ? addressOrEnsName || null
          : null,
        ensName: null,
      }));

      if (isValidENSName(addressOrEnsName) && !address) {
        throw new Error("Failed to resolve ENS name.");
      }

      return {
        address,
        ensName,
      };
    },
    queryKey: ["ens", addressOrEnsName],
    retry: false,
    // 1h
    staleTime: 60 * 60 * 1000,
  });
}

export function useEns(params: {
  client: ThirdwebClient;
  addressOrEnsName?: string;
}) {
  const { client, addressOrEnsName } = params;
  return useQuery(ensQuery({ addressOrEnsName, client }));
}

export function useContractEvents(abi: Abi) {
  return abi.filter((a) => a.type === "event");
}

export function useCustomFactoryAbi(
  client: ThirdwebClient,
  contractAddress: string,
  chainId: number | undefined,
) {
  const chain = useV5DashboardChain(chainId);

  return useQuery({
    enabled: !!contractAddress && !!chainId,
    queryFn: () => {
      const contract = chain
        ? getContract({
            address: contractAddress,
            chain,
            client,
          })
        : undefined;

      if (!contract) {
        throw new Error("Contract not found");
      }

      return resolveContractAbi<Abi>(contract);
    },
    queryKey: ["custom-factory-abi", { chainId, contractAddress }],
  });
}

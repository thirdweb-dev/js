import { ContractId } from "./types";
import { isContractIdBuiltInContract } from "./utils";
import { contractKeys, networkKeys } from "@3rdweb-sdk/react";
import { useMutationWithInvalidate } from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import { contractTypeFromContract } from "@3rdweb-sdk/react/hooks/useCommon";
import {
  useAddress,
  useChainId,
  useContract,
  useSDK,
} from "@thirdweb-dev/react";
import {
  ContractType,
  SmartContract,
  detectFeatures,
  extractConstructorParamsFromAbi,
  fetchPreDeployMetadata,
} from "@thirdweb-dev/sdk";
import { ExtraPublishMetadata } from "@thirdweb-dev/sdk/dist/src/schema/contracts/custom";
import { StorageSingleton } from "components/app-layouts/providers";
import { BuiltinContractMap, FeatureIconMap } from "constants/mappings";
import { StaticImageData } from "next/image";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import invariant from "tiny-invariant";

interface ContractPublishMetadata {
  image: string | StaticImageData;
  name: string;
  description?: string;
  abi?: unknown;
  bytecode?: string;
  deployDisabled?: boolean;
}

export function useContractPublishMetadataFromURI(contractId: ContractId) {
  const contractIdIpfsHash = useContractIdIpfsHash(contractId);
  return useQuery<ContractPublishMetadata>(
    ["publish-metadata", contractId],
    async () => {
      if (isContractIdBuiltInContract(contractId)) {
        const details = BuiltinContractMap[contractIdIpfsHash as ContractType];
        return {
          image: details.icon,
          name: details.title,
          deployDisabled: details.comingSoon,
          description: details.description,
        };
      }
      // TODO: Make this nicer.
      invariant(contractId !== "ipfs://undefined", "uri can't be undefined");
      const resolved = await fetchPreDeployMetadata(
        contractIdIpfsHash,
        StorageSingleton,
      );
      if (!resolved) {
        return {
          name: "Loading...",
          image: FeatureIconMap.custom,
        };
      }
      return {
        image: (resolved as any)?.image || FeatureIconMap.custom,
        name: resolved.name,
        abi: resolved.abi,
      };
    },
    {
      enabled: !!contractId,
    },
  );
}

export function useContractPrePublishMetadata(uri: string, address?: string) {
  const contractIdIpfsHash = useContractIdIpfsHash(uri);
  const sdk = useSDK();
  return useQuery(
    ["pre-publish-metadata", uri, address],
    async () => {
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

export function useConstructorParamsFromABI(abi?: any) {
  return useMemo(() => {
    return abi ? extractConstructorParamsFromAbi(abi) : [];
  }, [abi]);
}

export function useContractIdIpfsHash(contractId: ContractId) {
  if (
    isContractIdBuiltInContract(contractId) ||
    contractId.startsWith("ipfs://")
  ) {
    return contractId;
  }
  return `ipfs://${contractId}`;
}

interface PublishMutationData {
  predeployUri: string;
  extraMetadata: ExtraPublishMetadata;
}

export function usePublishMutation() {
  const sdk = useSDK();

  return useMutationWithInvalidate(
    async ({ predeployUri, extraMetadata }: PublishMutationData) => {
      invariant(
        sdk && "getPublisher" in sdk,
        "sdk is not ready or does not support publishing",
      );
      await sdk.getPublisher().publish(predeployUri, extraMetadata);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([["pre-publish-metadata", _variables.predeployUri]]);
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
      return await (
        await sdk.getPublisher()
      ).deployContract(
        ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`,
        data.constructorParams,
      );
    },
    {
      onSuccess: async (contractAddress, variables) => {
        if (variables.addToDashboard) {
          const registry = await sdk?.deployer.getRegistry();
          await registry?.addContract(contractAddress);
        }
        return await queryClient.invalidateQueries([
          ...networkKeys.chain(chainId),
          ...contractKeys.list(walletAddress),
        ]);
      },
    },
  );
}

export function usePublishedContractsQuery() {
  const sdk = useSDK();
  const address = useAddress();
  return useQuery(
    ["published-contracts", address],
    async () => {
      return address && sdk
        ? (await (await sdk.getPublisher()).getAll(address)).filter((c) => c.id)
        : [];
    },
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

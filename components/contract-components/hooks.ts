import { ContractId } from "./types";
import { isContractIdBuiltInContract } from "./utils";
import { contractKeys, networkKeys } from "@3rdweb-sdk/react";
import { useAddress, useChainId, useSDK } from "@thirdweb-dev/react";
import {
  ContractType,
  extractConstructorParamsFromAbi,
  fetchContractMetadata,
} from "@thirdweb-dev/sdk";
import { CustomContractMetadata } from "@thirdweb-dev/sdk/dist/src/schema/contracts/custom";
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
          abi: details.abi,
          bytecode: details.bytecode,
          deployDisabled: details.comingSoon,
          description: details.description,
        };
      }
      const resolved = await fetchContractMetadata(
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
        bytecode: resolved.bytecode,
      };
    },
    {
      enabled: !!contractId,
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

export function usePublishMutation() {
  const sdk = useSDK();

  return useMutation((uris: string[]) => {
    invariant(
      sdk && "publisher" in sdk,
      "sdk is not ready or does not support publishing",
    );
    return sdk.publisher.publishBatch(uris);
  });
}

export function useCustomContractDeployMutation(ipfsHash: string) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  const chainId = useChainId();

  return useMutation(
    ({
      metadata,
      constructorParams,
    }: {
      metadata: CustomContractMetadata;
      constructorParams: unknown[];
    }) => {
      invariant(
        sdk && "publisher" in sdk,
        "sdk is not ready or does not support publishing",
      );
      return sdk.publisher.deployCustomContract(
        ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`,
        constructorParams,
        metadata,
      );
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries([
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
        ? (await sdk.publisher.getAll(address)).filter((c) => c.id)
        : [];
    },
    {
      enabled: !!address && !!sdk,
    },
  );
}

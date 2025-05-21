"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { defineChain } from "thirdweb/chains";
import { getContract, resolveAbiFromContractApi } from "thirdweb/contract";
import type { ThirdwebClient } from "thirdweb/dist/types/client/client";
import type {
  AbiData,
  EventSignature,
  FunctionSignature,
} from "../_utils/webhook-types";

export function useAbiBatchProcessing({
  isOpen,
  thirdwebClient,
  chainIds,
  addresses,
  extractSignatures,
  type,
}: {
  isOpen: boolean;
  thirdwebClient: ThirdwebClient;
  chainIds: string[];
  addresses: string;
  extractSignatures: (
    abis: AbiData[],
  ) => EventSignature[] | FunctionSignature[];
  type: "event" | "transaction";
}) {
  const pairs = useMemo(() => {
    const result: { chainId: string; address: string }[] = [];
    for (const chainId of chainIds) {
      for (const address of (addresses || "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)) {
        result.push({ chainId, address });
      }
    }
    return result;
  }, [chainIds, addresses]);

  const queries = useMemo(() => {
    return pairs.map(({ chainId, address }) => ({
      queryKey: ["abi", chainId, address, type],
      queryFn: async () => {
        // eslint-disable-next-line no-restricted-syntax
        const chainObj = defineChain(Number(chainId));
        const contract = getContract({
          client: thirdwebClient,
          address,
          chain: chainObj,
        });
        return resolveAbiFromContractApi(contract);
      },
      enabled: isOpen && !!addresses.trim() && chainIds.length > 0,
      staleTime: Number.POSITIVE_INFINITY,
    }));
  }, [pairs, isOpen, addresses, chainIds, type, thirdwebClient]);

  const results = useQueries({ queries });

  const fetchedAbis = useMemo(() => {
    const abis: Record<string, AbiData> = {};
    for (const address of (addresses || "")
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)) {
      if (!Array.isArray(results) || !Array.isArray(pairs)) continue;
      const successful = results.length
        ? results.filter(
            (result, i) =>
              i < pairs.length &&
              pairs[i] &&
              pairs[i].address === address &&
              result.isSuccess &&
              result.data,
          )
        : undefined;
      if (
        successful &&
        successful.length > 0 &&
        successful[0] &&
        successful[0].data !== undefined
      ) {
        const abi = successful[0].data;
        let items: string[] = [];
        if (Array.isArray(abi)) {
          items = abi
            .filter((item) =>
              type === "event"
                ? item && item.type === "event"
                : item && item.type === "function",
            )
            .map((item) => item.name);
        }
        abis[address] = {
          fetchedAt: new Date().toISOString(),
          status: "success",
          abi: abi,
          ...(type === "event" ? { events: items } : { functions: items }),
        };
      }
    }
    return abis;
  }, [results, pairs, addresses, type]);

  const signatures = extractSignatures(Object.values(fetchedAbis));

  const isFetching = useMemo(() => {
    const addressesList = (addresses || "")
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    return addressesList.some((address) => {
      const relevantResults = pairs
        .map((pair, i) => ({ pair, result: results[i] }))
        .filter(({ pair }) => pair.address === address);

      const hasSuccess = relevantResults.some(
        ({ result }) => result?.isSuccess && result.data,
      );
      return (
        !hasSuccess && relevantResults.some(({ result }) => result?.isLoading)
      );
    });
  }, [addresses, pairs, results]);

  return { signatures, fetchedAbis, isFetching };
}

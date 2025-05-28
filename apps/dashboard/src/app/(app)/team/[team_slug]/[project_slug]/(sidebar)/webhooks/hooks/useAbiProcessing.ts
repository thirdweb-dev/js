"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract, resolveAbiFromContractApi } from "thirdweb/contract";
import type {
  AbiData,
  EventSignature,
  FunctionSignature,
} from "../utils/webhookTypes";

import { parseAddresses } from "../utils/webhookPayloadUtils";

export function useAbiMultiFetch({
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
    const seen = new Set<string>();
    for (const chainId of chainIds) {
      for (const address of parseAddresses(addresses)) {
        const key = `${chainId}:${address.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({ chainId, address });
        }
      }
    }
    return result;
  }, [chainIds, addresses]);

  const queryResult = useQuery({
    queryKey: ["abis", chainIds, addresses, type],
    queryFn: async () => {
      return Promise.all(
        pairs.map(async ({ chainId, address }) => {
          try {
            // eslint-disable-next-line no-restricted-syntax
            const chainObj = defineChain(Number(chainId));
            const contract = getContract({
              client: thirdwebClient,
              address,
              chain: chainObj,
            });
            const abi = await resolveAbiFromContractApi(contract);
            return { chainId, address, data: abi, status: "success" as const };
          } catch (error) {
            return { chainId, address, error, status: "error" as const };
          }
        }),
      );
    },
    enabled: isOpen && !!addresses.trim() && chainIds.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Map results by address for easier access
  const abisByAddress = useMemo(() => {
    if (!queryResult.data) return {};
    const map: Record<
      string,
      {
        chainId: string;
        address: string;
        data?: AbiData["abi"];
        error?: unknown;
        status: "success" | "error";
      }
    > = {};
    for (const item of queryResult.data) {
      map[item.address] = item;
    }
    return map;
  }, [queryResult.data]);

  // Build fetchedAbis in the same format as before
  const fetchedAbis = useMemo(() => {
    const abis: Record<string, AbiData> = {};
    if (!queryResult.data) return abis;
    for (const item of queryResult.data) {
      if (item.status === "success" && item.data) {
        const abi = item.data;
        let items: string[] = [];
        if (Array.isArray(abi)) {
          items = abi
            .filter((abiItem) =>
              type === "event"
                ? abiItem && abiItem.type === "event"
                : abiItem && abiItem.type === "function",
            )
            .map((abiItem) => abiItem.name);
        }
        abis[item.address] = {
          fetchedAt: new Date().toISOString(),
          status: "success",
          abi: abi,
          ...(type === "event" ? { events: items } : { functions: items }),
        };
      }
    }
    return abis;
  }, [queryResult.data, type]);

  const signatures = extractSignatures(Object.values(fetchedAbis));

  // isFetching: true if any address is still loading and not yet successful
  const isFetching = queryResult.isLoading;

  // Collect errors per address for easier UI feedback
  const errors: Record<string, string> = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!queryResult.data) return errs;
    for (const item of queryResult.data) {
      if (item.status === "error" && item.error) {
        errs[item.address] =
          item.error instanceof Error ? item.error.message : String(item.error);
      }
    }
    return errs;
  }, [queryResult.data]);

  return { signatures, fetchedAbis, errors, isFetching, abisByAddress };
}

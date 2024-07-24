import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import {
  convertApiChainToChain,
  getChainMetadata,
} from "../../../../chains/utils.js";
import { pLimit } from "../../../../utils/promise/p-limit.js";

export function useChainName(chain?: Chain) {
  // only if we have a chain and no chain name!
  const isEnabled = !!chain && !chain.name;
  const chainQuery = useQuery({
    queryKey: ["chain", chain?.id],
    enabled: isEnabled,
    retry: false,
    // 1 hour
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      return convertApiChainToChain(await getChainMetadata(chain));
    },
  });

  return {
    name: chain?.name ?? chainQuery.data?.name,
    isLoading: isEnabled && chainQuery.isLoading,
  };
}

export function useChainIconUrl(chain?: Chain) {
  // only if we have a chain and no chain icon url!
  const isEnabled = !!chain && !chain.icon?.url;
  const chainQuery = useQuery({
    queryKey: ["chain", chain?.id],
    // only if we have a chain and no chain icon url!
    enabled: isEnabled,
    retry: false,
    // 1 hour
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      return convertApiChainToChain(await getChainMetadata(chain));
    },
  });

  return {
    url: chain?.icon?.url ?? chainQuery.data?.icon?.url,
    isLoading: isEnabled && chainQuery.isLoading,
  };
}

export function useChainFaucets(chain?: Chain) {
  // only if we have a chain and it might be a testnet and no faucets and its not localhost
  const isEnabled =
    !!chain &&
    "testnet" in chain &&
    !chain.faucets?.length &&
    chain.id !== 1337;

  const chainQuery = useQuery({
    queryKey: ["chain", chain?.id],
    enabled: isEnabled,
    retry: false,
    // 1 hour
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      return convertApiChainToChain(await getChainMetadata(chain));
    },
  });

  return {
    faucets: chain?.faucets ?? chainQuery.data?.faucets ?? [],
    isLoading: isEnabled && chainQuery.isLoading,
  };
}

export function useChainSymbol(chain?: Chain) {
  // only if we have a chain and no chain icon url!
  const isEnabled = !!chain && !chain.nativeCurrency?.symbol;
  const chainQuery = useQuery({
    queryKey: ["chain", chain?.id],
    // only if we have a chain and no chain icon url!
    enabled: isEnabled,
    retry: false,
    // 1 hour
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      return convertApiChainToChain(await getChainMetadata(chain));
    },
  });

  return {
    symbol:
      chain?.nativeCurrency?.symbol ?? chainQuery.data?.nativeCurrency?.symbol,
    isLoading: isEnabled && chainQuery.isLoading,
  };
}

export function useChainExplorers(chain?: Chain) {
  // only if we have a chain and it might be a testnet and no faucets and its not localhost
  const isEnabled = !!chain && !chain.blockExplorers?.length;

  const chainQuery = useQuery({
    queryKey: ["chain", chain?.id],
    enabled: isEnabled,
    retry: false,
    // 1 hour
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      return convertApiChainToChain(await getChainMetadata(chain));
    },
  });

  return {
    explorers: chain?.blockExplorers ?? chainQuery.data?.blockExplorers ?? [],
    isLoading: isEnabled && chainQuery.isLoading,
  };
}

function getQueryOptions(chain?: Chain) {
  return {
    queryKey: ["chain", chain],
    enabled: !!chain,
    staleTime: 1000 * 60 * 60, // 1 hour
  } as const;
}

/**
 * @internal
 */
export function useChainQuery(chain?: Chain) {
  return useQuery({
    ...getQueryOptions(chain),
    queryFn: async () => {
      if (!chain) {
        throw new Error("chainId is required");
      }
      return getChainMetadata(chain);
    },
  });
}

/**
 * @param chains - array of `Chains`
 * @param maxConcurrency - maximum number of concurrent requests to make
 * @internal
 */
export function useChainsQuery(chains: Chain[], maxConcurrency: number) {
  const queryList = useMemo(() => {
    const limit = pLimit(maxConcurrency);
    return chains.map((chain) => {
      return {
        ...getQueryOptions(chain),
        queryFn: () => limit(() => getChainMetadata(chain)),
      };
    });
  }, [chains, maxConcurrency]);

  return useQueries({
    queries: queryList,
  });
}

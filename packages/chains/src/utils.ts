import { Chain, MinimalChain } from "./types";

export type ChainRPCOptions = {
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
  mode?: "http" | "ws";
};

const defaultOptions = {
  mode: "http",
} as const;

/**
 * Construct the list of RPC URLs given a specific chain config. Format any RPC URLs
 * with necessary API keys.
 *
 * @param chain - The chain config to assemble RPC URLs from
 * @param options - Options to configure the RPC URLs
 * @returns The list of RPC URLs for the chain
 */
export function getChainRPCs(
  chain: Pick<Chain, "rpc" | "chainId">,
  options?: ChainRPCOptions,
): string[] {
  const { thirdwebApiKey, alchemyApiKey, infuraApiKey, mode } = {
    ...defaultOptions,
    ...options,
  };

  const processedRPCs: string[] = [];

  chain.rpc.forEach((rpc) => {
    // exclude RPC if mode mismatch
    if (mode === "http" && !rpc.startsWith("http")) {
      return;
    }

    if (mode === "ws" && !rpc.startsWith("ws")) {
      return;
    }

    // Replace API_KEY placeholder with value
    if (thirdwebApiKey && rpc.includes("${THIRDWEB_API_KEY}")) {
      processedRPCs.push(rpc.replace("${THIRDWEB_API_KEY}", thirdwebApiKey));
    } else if (infuraApiKey && rpc.includes("${INFURA_API_KEY}")) {
      processedRPCs.push(rpc.replace("${INFURA_API_KEY}", infuraApiKey));
    } else if (alchemyApiKey && rpc.includes("${ALCHEMY_API_KEY}")) {
      processedRPCs.push(rpc.replace("${ALCHEMY_API_KEY}", alchemyApiKey));
    }

    // exclude RPCs with unknown placeholder
    else if (rpc.includes("${")) {
      return;
    }

    // add as is
    else {
      processedRPCs.push(rpc);
    }
  });

  if (processedRPCs.length === 0) {
    throw new Error(
      `No RPC available for chainId "${chain.chainId}" with mode ${mode}`,
    );
  }

  return processedRPCs;
}

/**
 * Construct the list of RPC URLs given a specific chain config. Format any RPC URLs
 * with necessary clientId/secretKey and returns the first valid one.
 *
 * @param chain - The chain config to assemble RPC URLs from
 * @param clientId - The client id to use for the RPC URL
 * @returns The first valid RPC URL for the chain
 */
export function getValidChainRPCs(
  chain: Pick<Chain, "rpc" | "chainId">,
  clientId?: string,
  mode: "http" | "ws" = "http",
): string[] {
  const processedRPCs: string[] = [];

  chain.rpc.forEach((rpc) => {
    // exclude RPC if mode mismatch
    if (mode === "http" && !rpc.startsWith("http")) {
      return;
    }

    if (mode === "ws" && !rpc.startsWith("ws")) {
      return;
    }

    // Replace API_KEY placeholder with value
    if (rpc.includes("${THIRDWEB_API_KEY}")) {
      if (clientId) {
        processedRPCs.push(
          rpc.replace("${THIRDWEB_API_KEY}", clientId) +
            (typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
              ? // @ts-ignore
                `/?bundleId=${globalThis.APP_BUNDLE_ID}`
              : ""),
        );
      } else {
        // if no client id, let it through with empty string
        // if secretKey is present, it will be used in header
        // if none are passed, will have reduced access
        processedRPCs.push(rpc.replace("${THIRDWEB_API_KEY}", ""));
      }
    }

    // exclude RPCs with unknown placeholder
    else if (rpc.includes("${")) {
      return;
    }

    // add as is
    else {
      processedRPCs.push(rpc);
    }
  });

  if (processedRPCs.length === 0) {
    throw new Error(
      `No RPC available for chainId "${chain.chainId}" with mode ${mode}`,
    );
  }

  return processedRPCs;
}

/**
 * Get the highest priority RPC URL for a specific chain
 *
 * @param chain - The chain config to get the RPC URL for
 * @param options - Options to configure the RPC URL
 * @returns The RPC URL for the chain
 *
 * @internal
 */
export function getChainRPC(
  chain: Pick<Chain, "rpc" | "chainId">,
  options?: ChainRPCOptions,
): string {
  return getChainRPCs(chain, options)[0];
}

export function minimizeChain(chain: Chain): MinimalChain {
  const [firstRpc] = chain.rpc;
  return {
    name: chain.name,
    chain: chain.chain,
    rpc: [firstRpc],
    nativeCurrency: chain.nativeCurrency,
    shortName: chain.shortName,
    chainId: chain.chainId,
    testnet: chain.testnet,
    slug: chain.slug,
    icon: chain.icon,
  };
}

type ChainConfiguration = {
  rpc?: string | string[];
};

export function configureChain(
  chain: Chain,
  chainConfig: ChainConfiguration,
): Chain {
  let additionalRPCs: string[] = [];
  if (chainConfig?.rpc) {
    if (typeof chainConfig.rpc === "string") {
      additionalRPCs = [chainConfig.rpc];
    } else {
      additionalRPCs = chainConfig.rpc;
    }
  }
  // prepend additional RPCs to the chain's RPCs
  return { ...chain, rpc: [...additionalRPCs, ...chain.rpc] };
}

/**
 *
 * use the clientId and return a new chain object with updated RPCs
 */
export function updateChainRPCs(chain: Chain, clientId?: string) {
  try {
    return {
      ...chain,
      rpc: getValidChainRPCs(chain, clientId),
    };
  } catch (error) {
    return chain;
  }
}

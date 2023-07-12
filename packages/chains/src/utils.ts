import { Chain, MinimalChain } from "./types";

export type ChainRPCOptions = {
  apiKey?: string;
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
  const { apiKey, mode } = {
    ...defaultOptions,
    ...options,
  };

  if (!apiKey) {
    console.warn(
      "No API key provided. You will have limited access to thirdweb's services for storage, RPC, and account abstraction. You can get an API key from https://thirdweb.com/dashboard/settings",
    );
  }

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
    if (apiKey && rpc.includes("${THIRDWEB_API_KEY}")) {
      processedRPCs.push(rpc.replace("${THIRDWEB_API_KEY}", apiKey));
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
 *
 * use the keys and return a new chain object with updated RPCs
 */
export const updateChainRPCs = (chain: Chain, options: ChainRPCOptions) => {
  try {
    return {
      ...chain,
      rpc: getChainRPCs(chain, options),
    };
  } catch (error) {
    return chain;
  }
};

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

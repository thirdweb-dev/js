import { Chain, MinimalChain } from "./types";

type ChainRPCOptions = {
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
  mode?: "http" | "ws";
};

const defaultOptions = {
  mode: "http",
} as const;

export function getChainRPCs(
  chain: Pick<Chain, "rpc" | "chainId">,
  options?: ChainRPCOptions,
): string[] {
  const { thirdwebApiKey, alchemyApiKey, infuraApiKey, mode } = {
    ...defaultOptions,
    ...options,
  };

  const modeChains = chain.rpc.filter((rpc) => {
    if (rpc.startsWith("http") && mode === "http") {
      return true;
    }
    if (rpc.startsWith("ws") && mode === "ws") {
      return true;
    }

    return false;
  });

  const thirdwebRPC = modeChains
    .filter((rpc) => {
      return rpc.includes("${THIRDWEB_API_KEY}") && thirdwebApiKey;
    })
    .map((rpc) =>
      thirdwebApiKey ? rpc.replace("${THIRDWEB_API_KEY}", thirdwebApiKey) : rpc,
    );

  const alchemyRPC = modeChains
    .filter((rpc) => {
      return rpc.includes("${ALCHEMY_API_KEY}") && alchemyApiKey;
    })
    .map((rpc) =>
      alchemyApiKey ? rpc.replace("${ALCHEMY_API_KEY}", alchemyApiKey) : rpc,
    );

  const infuraRPC = modeChains
    .filter((rpc) => {
      return rpc.includes("${INFURA_API_KEY}") && infuraApiKey;
    })
    .map((rpc) =>
      infuraApiKey ? rpc.replace("${INFURA_API_KEY}", infuraApiKey) : rpc,
    );

  const allOtherRpcs = modeChains.filter((rpc) => {
    return !rpc.includes("${");
  });

  const orderedRPCs = [
    ...thirdwebRPC,
    ...infuraRPC,
    ...alchemyRPC,
    ...allOtherRpcs,
  ];

  if (orderedRPCs.length === 0) {
    throw new Error(
      `No RPC available for chainId "${chain.chainId}" with mode ${mode}`,
    );
  }

  return orderedRPCs;
}

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

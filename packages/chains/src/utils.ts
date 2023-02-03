import { Chain } from "./types";

type ChainRPCOptions = {
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
  mode?: "http" | "ws";
};

const defaultOptions = {
  mode: "http",
} as const;

export function getChainRPC(chain: Chain, options?: ChainRPCOptions): string {
  const { thirdwebApiKey, alchemyApiKey, infuraApiKey, mode } = {
    ...defaultOptions,
    ...options,
  };

  const modeChains = chain.rpc.filter((rpc) => {
    if (rpc.startsWith("https://") && mode === "http") {
      return true;
    }
    if (rpc.startsWith("wss://") && mode === "ws") {
      return true;
    }

    return false;
  });

  const thirdwebRPC = modeChains.filter((rpc) => {
    return rpc.includes("${THIRDWEB_API_KEY}") && thirdwebApiKey;
  });

  const alchemyRPC = modeChains.filter((rpc) => {
    return rpc.includes("${ALCHEMY_API_KEY}") && alchemyApiKey;
  });

  const infuraRPC = modeChains.filter((rpc) => {
    return rpc.includes("${INFURA_API_KEY}") && infuraApiKey;
  });

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
      `No RPC available for chain ${chain.name} with mode ${mode}`,
    );
  }

  return orderedRPCs[0];
}

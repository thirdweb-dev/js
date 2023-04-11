import { getChainRPCs, ChainRPCOptions, Chain } from "@thirdweb-dev/chains";

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

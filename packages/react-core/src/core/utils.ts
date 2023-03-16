import { getChainRPCs, ChainRPCOptions, Chain } from "@thirdweb-dev/chains";

// it rejects the promise if the given promise does not resolve within the given time
export const timeoutPromise = <T>(
  ms: number,
  promise: Promise<T>,
  errorMessage: string,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
    promise.then(resolve, reject);
  });
};

/**
 *
 * use the keys and return a new chain object with updated RPCs
 */
export const updateChainRPCs = (chain: Chain, options: ChainRPCOptions) => {
  return {
    ...chain,
    rpc: getChainRPCs(chain, options),
  };
};

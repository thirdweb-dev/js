import type { ThirdwebClient } from "../client/client.js";

export type Chain =
  | {
      id: bigint | number;
      rpc: string;
    }
  // TODO: add all possible chainIds somehow for autocompletion
  // eslint-disable-next-line @typescript-eslint/ban-types
  | ((number | bigint) & {});

/**
 * Defines a chain based on the provided options.
 * @param options - The options for defining the chain.
 * @returns The defined chain.
 * @example
 * ```ts
 * import { defineChain } from "thirdweb";
 *
 * const chain = defineChain(1);
 * // or with custom RPC
 * const chain = defineChain({ id: 1, rpc: "https:..." });
 * ```
 */
export function defineChain(options: Chain): Readonly<Chain> {
  // this does... nothing right now, but it may in the future?
  return options;
}

type GetRpcUrlForChainOptions = {
  client: ThirdwebClient;
  chain: Chain;
};

/**
 * Retrieves the RPC URL for the specified chain.
 * If a custom RPC URL is defined in the options, it will be used.
 * Otherwise, a thirdweb RPC URL will be constructed using the chain ID and client ID.
 * @param options - The options object containing the chain and client information.
 * @returns The RPC URL for the specified chain.
 * @internal
 */
export function getRpcUrlForChain(options: GetRpcUrlForChainOptions): string {
  // if the chain is just the chainId use the thirdweb rpc
  if (typeof options.chain === "bigint" || typeof options.chain === "number") {
    return `https://${options.chain.toString()}.rpc.thirdweb.com/${
      options.client.clientId
    }`;
  }
  // otherwise if custom rpc is defined use that.
  if (!!options.chain.rpc.length) {
    return options.chain.rpc;
  }
  // otherwise construct thirdweb RPC url from the chain object
  return `https://${options.chain.id.toString()}.rpc.thirdweb.com/${
    options.client.clientId
  }`;
}

/**
 * Retrieves the chain ID from the provided chain.
 * @param chain - The chain.
 * @returns The chain ID.
 * @internal
 */
export function getChainIdFromChain(chain: Chain): bigint {
  if (typeof chain === "bigint" || typeof chain === "number") {
    return BigInt(chain);
  }
  return BigInt(chain.id);
}

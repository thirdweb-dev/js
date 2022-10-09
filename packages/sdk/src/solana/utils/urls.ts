import { Network } from "../types/index";
import { Cluster, clusterApiUrl } from "@solana/web3.js";

/**
 * @internal
 * This is a community API key that is subject to rate limiting. Please use your own key.
 */
const DEFAULT_API_KEY = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

/**
 * @internal
 */
export function getUrlForNetwork(network: Network) {
  switch (network) {
    case "localnet":
      return "http://127.0.0.1:8899";
    case "testnet":
      return clusterApiUrl(network as Cluster);
    case "mainnet-beta":
      return `https://solana-mainnet.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "devnet":
      return `https://solana-devnet.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    default:
      return network;
  }
}

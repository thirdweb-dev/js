import { Network } from "../types/index";
import { Cluster, clusterApiUrl } from "@solana/web3.js";

export function getUrlForNetwork(network: Network) {
  switch (network) {
    case "localhost":
      return "http://localhost:8899";
    case "testnet":
    case "mainnet-beta":
    case "devnet":
      return clusterApiUrl(network as Cluster);
    default:
      return network;
  }
}

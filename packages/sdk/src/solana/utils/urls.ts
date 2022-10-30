import { getRpcUrl } from "../../core/constants/urls";
import { Network } from "../types/index";
import { Metaplex } from "@metaplex-foundation/js";
import { Cluster, clusterApiUrl } from "@solana/web3.js";

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
      return getRpcUrl("solana");
    case "devnet":
      return getRpcUrl("solana-devnet");
    default:
      return network;
  }
}

export function getNework(metaplex: Metaplex) {
  const url = new URL(metaplex.connection.rpcEndpoint);
  // try this first to avoid hitting `custom` network for alchemy urls
  if (url.hostname.includes("devnet")) {
    return "devnet";
  }
  if (url.hostname.includes("mainnet")) {
    return "mainnet-beta";
  }
  return metaplex.cluster;
}

export function getPublicRpc(metaplex: Metaplex) {
  const url = new URL(metaplex.connection.rpcEndpoint);
  if (url.hostname.includes("devnet")) {
    return "https://api.devnet.solana.com";
  }
  if (url.hostname.includes("mainnet")) {
    return "https://api.mainnet-beta.solana.com";
  }
  return url.toString();
}

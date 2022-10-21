import { SignerOrProvider } from "../core/types";
import { ethers, providers } from "ethers";

/**
 * @internal
 */
export const DEFAULT_IPFS_GATEWAY = "https://gateway.ipfscdn.io/ipfs/";

/**
 * @internal
 */
export type ChainOrRpc =
  | "mainnet"
  // common alias for `mainnet`
  | "ethereum"
  | "goerli"
  | "polygon"
  // common alias for `polygon`
  | "matic"
  | "mumbai"
  | "fantom"
  | "fantom-testnet"
  | "avalanche"
  | "avalanche-testnet"
  // actual name
  | "avalanche-fuji"
  | "optimism"
  | "optimism-goerli"
  | "arbitrum"
  | "arbitrum-goerli"
  | "binance"
  | "binance-testnet"
  // ideally we could use `https://${string}` notation here, but doing that causes anything that is a generic string to throw a type error => not worth the hassle for now
  | (string & {});

export const DEFAULT_API_KEY =
  "f5db7c96b2131bfe3a36c6a3fcf9a3b8c88137112d94c9d5658b57db92aac1cf";

export function getRpcUrl(network: string) {
  return `https://${network}.rpc.thirdweb.com/${DEFAULT_API_KEY}`;
}

/**
 * @internal
 * @param network - the chain name or rpc url
 * @returns the rpc url for that chain
 */
export function getProviderForNetwork(network: ChainOrRpc | SignerOrProvider) {
  if (typeof network !== "string") {
    return network;
  }
  switch (network) {
    case "mainnet":
    case "ethereum":
      return getRpcUrl("ethereum");
    case "goerli":
      return getRpcUrl("goerli");
    case "polygon":
    case "matic":
      return getRpcUrl("polygon");
    case "mumbai":
      return getRpcUrl("mumbai");
    case "optimism":
      return getRpcUrl("optimism");
    case "optimism-goerli":
      return getRpcUrl("optimism-goerli");
    case "arbitrum":
      return getRpcUrl("arbitrum");
    case "arbitrum-goerli":
      return getRpcUrl("arbitrum-goerli");
    case "fantom":
      return getRpcUrl("fantom");
    case "fantom-testnet":
      return getRpcUrl("fantom-testnet");
    case "avalanche":
      return getRpcUrl("avalanche");
    case "avalanche-testnet":
    case "avalanche-fuji":
      return getRpcUrl("avalanche-fuji");
    case "binance":
      return getRpcUrl("binance");
    case "binance-testnet":
      return getRpcUrl("binance-testnet");
    default:
      if (network.startsWith("http") || network.startsWith("ws")) {
        return network;
      } else {
        throw new Error(`Unrecognized chain name or RPC url: ${network}`);
      }
  }
}

/**
 *
 * @param network - the chain name or rpc url
 * @param chainId - the optional chain id
 * @returns the provider
 */
export function getReadOnlyProvider(network: string, chainId?: number) {
  try {
    const match = network.match(/^(ws|http)s?:/i);
    // try the JSON batch provider if available
    if (match) {
      switch (match[1]) {
        case "http":
          return new providers.JsonRpcBatchProvider(network, chainId);
        case "ws":
          return new providers.WebSocketProvider(network, chainId);
        default:
          return ethers.getDefaultProvider(network);
      }
    } else {
      return ethers.getDefaultProvider(network);
    }
  } catch (e) {
    // fallback to the default provider
    return ethers.getDefaultProvider(network);
  }
}

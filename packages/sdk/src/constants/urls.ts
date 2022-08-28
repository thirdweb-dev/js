import { ethers, providers } from "ethers";
import { SignerOrProvider } from "../core/types";
/**
 * @internal
 */
export const DEFAULT_IPFS_GATEWAY = "https://gateway.ipfscdn.io/ipfs/";
/**
 * @internal
 */
export const PUBLIC_GATEWAYS = [
  "https://gateway.ipfscdn.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
];

/**
 * @internal
 */
export const TW_IPFS_SERVER_URL = "https://upload.nftlabs.co";
/**
 * @internal
 */
export const PINATA_IPFS_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

/**
 * @internal
 */
export type ChainOrRpc =
  | "mumbai"
  | "polygon"
  // common alias for `polygon`
  | "matic"
  | "rinkeby"
  | "goerli"
  | "mainnet"
  // common alias for `mainnet`
  | "ethereum"
  | "fantom"
  | "fantom-testnet"
  | "avalanche"
  | "avalanche-testnet"
  // actual name
  | "avalanche-fuji"
  | "optimism"
  | "optimism-testnet"
  | "arbitrum"
  | "arbitrum-testnet"
  // ideally we could use `https://${string}` notation here, but doing that causes anything that is a generic string to throw a type error => not worth the hassle for now
  | (string & {});

/**
 * @internal
 * This is a community API key that is subject to rate limiting. Please use your own key.
 */
const DEFAULT_API_KEY = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

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
    case "mumbai":
      return `https://polygon-mumbai.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "rinkeby":
      return `https://eth-rinkeby.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "goerli":
      return `https://eth-goerli.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "polygon":
    case "matic":
      return `https://polygon-mainnet.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "mainnet":
    case "ethereum":
      return `https://eth-mainnet.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "optimism":
      // TODO test this RPC
      return `https://opt-mainnet.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "optimism-testnet":
      // alchemy optimism kovan rpc doesn't link to the testnet sequencer...
      return "https://kovan.optimism.io";
    case "arbitrum":
      // TODO test this RPC
      return `https://arb-mainnet.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "arbitrum-testnet":
      // TODO test this RPC
      return `https://arb-rinkeby.g.alchemy.com/v2/${DEFAULT_API_KEY}`;
    case "fantom":
      return "https://rpc.ftm.tools";
    case "fantom-testnet":
      return "https://rpc.testnet.fantom.network/";
    case "avalanche":
      return "https://api.avax.network/ext/bc/C/rpc";
    case "avalanche-testnet":
    case "avalanche-fuji":
      return "https://api.avax-test.network/ext/bc/C/rpc";
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

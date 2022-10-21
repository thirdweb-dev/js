import { getRpcUrl } from "../../core/constants/urls";
import { SignerOrProvider } from "../core/types";
import { StaticJsonRpcBatchProvider } from "../lib/static-batch-rpc";
import { ChainId, SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "./chains";
import { ethers, providers } from "ethers";

/**
 * @internal
 */
export const DEFAULT_IPFS_GATEWAY = "https://gateway.ipfscdn.io/ipfs/";

type ChainNames =
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
  | "binance-testnet";
/**
 * @internal
 */
export type ChainOrRpc =
  // ideally we could use `https://${string}` notation here, but doing that causes anything that is a generic string to throw a type error => not worth the hassle for now
  ChainNames | (string & {});

export const CHAIN_NAME_TO_ID: Record<ChainNames, SUPPORTED_CHAIN_ID> = {
  "avalanche-fuji": ChainId.AvalancheFujiTestnet,
  "avalanche-testnet": ChainId.AvalancheFujiTestnet,
  "fantom-testnet": ChainId.FantomTestnet,
  ethereum: ChainId.Mainnet,
  matic: ChainId.Polygon,
  mumbai: ChainId.Mumbai,
  goerli: ChainId.Goerli,
  polygon: ChainId.Polygon,
  mainnet: ChainId.Mainnet,
  optimism: ChainId.Optimism,
  "optimism-goerli": ChainId.OptimismGoerli,
  arbitrum: ChainId.Arbitrum,
  "arbitrum-goerli": ChainId.ArbitrumGoerli,
  fantom: ChainId.Fantom,
  avalanche: ChainId.Avalanche,
  binance: ChainId.BinanceSmartChainMainnet,
  "binance-testnet": ChainId.BinanceSmartChainTestnet,
};

export const CHAIN_ID_TO_NAME = Object.fromEntries(
  Object.entries(CHAIN_NAME_TO_ID).map(([name, id]) => [id, name]),
) as Record<ChainId, ChainNames>;

function buildDefaultMap() {
  return SUPPORTED_CHAIN_IDS.reduce((previousValue, currentValue) => {
    previousValue[currentValue] = getProviderForNetwork(
      CHAIN_ID_TO_NAME[currentValue],
    ) as string;
    return previousValue;
  }, {} as Record<SUPPORTED_CHAIN_ID, string>);
}

export const DEFAULT_RPC_URLS: Record<SUPPORTED_CHAIN_ID, string> =
  buildDefaultMap();

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
          return chainId
            ? // if we know the chainId we should use the StaticJsonRpcBatchProvider
              new StaticJsonRpcBatchProvider(network, chainId)
            : // otherwise fall back to the built in json rpc batch provider
              new providers.JsonRpcBatchProvider(network, chainId);

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

import { DEFAULT_API_KEY, getRpcUrl } from "../../core/constants/urls";
import { ChainIdOrName } from "../core";
import { StaticJsonRpcBatchProvider } from "../lib/static-batch-rpc";
import { ChainInfo, SDKOptions, SDKOptionsSchema } from "../schema";
import { ChainId, SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "./chains";
import { ethers, providers } from "ethers";

/**
 * @internal
 */
export const DEFAULT_IPFS_GATEWAY = "https://gateway.ipfscdn.io/ipfs/";

export type ChainNames =
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
  // local nodes
  | "hardhat"
  | "localhost";
/**
 * @internal
 */

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
  hardhat: ChainId.Hardhat,
  localhost: ChainId.Localhost,
};

export const CHAIN_ID_TO_NAME = Object.fromEntries(
  Object.entries(CHAIN_NAME_TO_ID).map(([name, id]) => [id, name]),
) as Record<ChainId, ChainNames>;

export function buildDefaultMap(sdkOptions: SDKOptions = {}) {
  const options = SDKOptionsSchema.parse(sdkOptions);
  return options.chains.reduce((previousValue, currentValue) => {
    previousValue[currentValue.chainId] = currentValue;
    return previousValue;
  }, {} as Record<number, ChainInfo>);
}

export function getChainProvider(
  network: ChainIdOrName,
  sdkOptions: SDKOptions,
): ethers.providers.Provider {
  // handle passing a RPC url directly
  if (typeof network === "string" && network.startsWith("http")) {
    return getReadOnlyProvider(network);
  }
  const chainId = toChainId(network);
  const options = SDKOptionsSchema.parse(sdkOptions);
  const rpcMap: Record<number, ChainInfo> = buildDefaultMap(options);
  let rpcUrl = rpcMap[chainId]?.rpc[0];

  if (!rpcUrl) {
    throw new Error(
      `No rpc url found for chain ${network}. Please provide a valid rpc url via the 'chainInfos' property of the sdk options.`,
    );
  }
  // apply API keys
  rpcUrl = rpcUrl.replace(
    "${THIRDWEB_API_KEY}",
    options.thirdwebApiKey || DEFAULT_API_KEY,
  );
  rpcUrl = rpcUrl.replace("${INFURA_API_KEY}", options.infuraApiKey || "");
  rpcUrl = rpcUrl.replace("${ALCHEMY_API_KEY}", options.alchemyApiKey || "");

  return getReadOnlyProvider(rpcUrl, chainId);
}

export function toChainId(network: ChainIdOrName): number {
  if (typeof network === "number") {
    return network;
  }
  if (!(network in CHAIN_NAME_TO_ID)) {
    throw new Error(
      `Cannot resolve chainId from: ${network} - please pass the chainId instead and specify it in the 'chainInfos' property of the SDK options.`,
    );
  }
  return CHAIN_NAME_TO_ID[network as ChainNames];
}

const READONLY_PROVIDER_MAP: Map<
  string,
  StaticJsonRpcBatchProvider | providers.JsonRpcBatchProvider
> = new Map();

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
          const seralizedOpts = `${network}-${chainId || -1}`;
          const existingProvider = READONLY_PROVIDER_MAP.get(seralizedOpts);
          if (existingProvider) {
            return existingProvider;
          }

          const newProvider = chainId
            ? // if we know the chainId we should use the StaticJsonRpcBatchProvider
              new StaticJsonRpcBatchProvider(network, chainId)
            : // otherwise fall back to the built in json rpc batch provider
              new providers.JsonRpcBatchProvider(network, chainId);
          READONLY_PROVIDER_MAP.set(seralizedOpts, newProvider);
          return newProvider;

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

import { ChainId, SUPPORTED_CHAIN_ID } from "./chains";
import { NativeToken } from "../types/currency";

/**
 * @public
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/**
 * @public
 */
export const NATIVE_TOKENS: Record<
  SUPPORTED_CHAIN_ID | ChainId.Hardhat,
  NativeToken
> = {
  [ChainId.Mainnet]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.Rinkeby]: {
    name: "Rinkeby Ether",
    symbol: "RIN",
    decimals: 18,
    wrapped: {
      address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.Goerli]: {
    name: "Görli Ether",
    symbol: "GOR",
    decimals: 18,
    wrapped: {
      address: "0x0bb7509324ce409f7bbc4b701f932eaca9736ab7",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.Polygon]: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    wrapped: {
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      name: "Wrapped Matic",
      symbol: "WMATIC",
    },
  },
  [ChainId.Mumbai]: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    wrapped: {
      address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      name: "Wrapped Matic",
      symbol: "WMATIC",
    },
  },
  [ChainId.Avalanche]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    wrapped: {
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
    },
  },
  [ChainId.AvalancheFujiTestnet]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    wrapped: {
      address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
    },
  },
  [ChainId.Fantom]: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
    wrapped: {
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      name: "Wrapped Fantom",
      symbol: "WFTM",
    },
  },
  [ChainId.FantomTestnet]: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
    wrapped: {
      address: "0xf1277d1Ed8AD466beddF92ef448A132661956621",
      name: "Wrapped Fantom",
      symbol: "WFTM",
    },
  },
  [ChainId.Arbitrum]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.ArbitrumTestnet]: {
    name: "Arbitrum Rinkeby Ether",
    symbol: "ARETH",
    decimals: 18,
    wrapped: {
      address: "0xEBbc3452Cc911591e4F18f3b36727Df45d6bd1f9",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.Optimism]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.OptimismTestnet]: {
    name: "Kovan Ether",
    symbol: "KOR",
    decimals: 18,
    wrapped: {
      address: "0xbC6F6b680bc61e30dB47721c6D1c5cde19C1300d",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.Hardhat]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
};

/**
 * Returns the native token for a given chain
 * @param chainId - the chain id
 * @public
 */
export function getNativeTokenByChainId(chainId: ChainId): NativeToken {
  return NATIVE_TOKENS[chainId as SUPPORTED_CHAIN_ID];
}

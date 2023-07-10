import type { NativeToken } from "../types/currency";
import { ChainId } from "./chains/ChainId";
import { getSupportedChains } from "./chains/supportedChains";
import { constants } from "ethers";

/**
 * @public
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/**
 * @public
 */
export const NATIVE_TOKENS: Record<number, NativeToken> = /* @__PURE__ */ {
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
  [ChainId.Goerli]: {
    name: "Görli Ether",
    symbol: "GOR",
    decimals: 18,
    wrapped: {
      address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  11155111: {
    name: "Sepolia Ether",
    symbol: "SEP",
    decimals: 18,
    wrapped: {
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
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

  [ChainId.ArbitrumGoerli]: {
    name: "Arbitrum Goerli Ether",
    symbol: "AGOR",
    decimals: 18,
    wrapped: {
      address: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
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

  [ChainId.OptimismGoerli]: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [ChainId.BinanceSmartChainMainnet]: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
    wrapped: {
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      name: "Wrapped Binance Chain Token",
      symbol: "WBNB",
    },
  },
  [ChainId.BinanceSmartChainTestnet]: {
    name: "Binance Chain Native Token",
    symbol: "TBNB",
    decimals: 18,
    wrapped: {
      address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      name: "Wrapped Binance Chain Testnet Token",
      symbol: "WBNB",
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
  [ChainId.Localhost]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  84531: {
    name: "Base Goerli Testnet",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  // eslint-disable-next-line no-useless-computed-key
  [280]: {
    name: "zkSync Era Testnet",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
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
  const chain = getSupportedChains().find((c) => c.chainId === chainId);
  if (chain && chain.nativeCurrency) {
    return {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: 18,
      wrapped: {
        address: constants.AddressZero,
        name: `Wrapped ${chain.nativeCurrency.name}`,
        symbol: `W${chain.nativeCurrency.symbol}`,
      },
    };
  }
  return (
    NATIVE_TOKENS[chainId as number] || {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      wrapped: {
        address: constants.AddressZero,
        name: "Wrapped Ether",
        symbol: "WETH",
      },
    }
  );
}

export const LINK_TOKEN_ADDRESS: Record<number, string> = /* @__PURE__ */ {
  [ChainId.Mainnet]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  [ChainId.Goerli]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  [ChainId.BinanceSmartChainMainnet]:
    "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
  [ChainId.Polygon]: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
  [ChainId.Mumbai]: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  [ChainId.Avalanche]: "0x5947BB275c521040051D82396192181b413227A3",
  [ChainId.AvalancheFujiTestnet]: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  [ChainId.Fantom]: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
  [ChainId.FantomTestnet]: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
};

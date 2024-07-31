import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  ethereum,
  fantom,
  fantomTestnet,
  hardhat,
  localhost,
  optimism,
  polygon,
  sepolia,
} from "thirdweb/chains";

export interface CurrencyMetadata {
  address: string;
  name: string;
  symbol: string;
}

const NATIVE_TOKENS: Record<
  number,
  {
    name: string;
    symbol: string;
    decimals: number;
    wrapped: CurrencyMetadata;
  }
> = /* @__PURE__ */ {
  [ethereum.id]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [sepolia.id]: {
    name: "Sepolia Ether",
    symbol: "SEP",
    decimals: 18,
    wrapped: {
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [polygon.id]: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    wrapped: {
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      name: "Wrapped Matic",
      symbol: "WMATIC",
    },
  },
  [avalanche.id]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    wrapped: {
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
    },
  },
  [avalancheFuji.id]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    wrapped: {
      address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
    },
  },
  [fantom.id]: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
    wrapped: {
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      name: "Wrapped Fantom",
      symbol: "WFTM",
    },
  },
  [fantomTestnet.id]: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
    wrapped: {
      address: "0xf1277d1Ed8AD466beddF92ef448A132661956621",
      name: "Wrapped Fantom",
      symbol: "WFTM",
    },
  },
  [arbitrum.id]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [optimism.id]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [bsc.id]: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
    wrapped: {
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      name: "Wrapped Binance Chain Token",
      symbol: "WBNB",
    },
  },
  [bscTestnet.id]: {
    name: "Binance Chain Native Token",
    symbol: "TBNB",
    decimals: 18,
    wrapped: {
      address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      name: "Wrapped Binance Chain Testnet Token",
      symbol: "WBNB",
    },
  },
  [hardhat.id]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [localhost.id]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
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

const Ethereum: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[ethereum.id].wrapped,
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    name: "Tether USD",
    symbol: "USDT",
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "USD Coin",
    symbol: "USDC",
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
  },
  {
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    name: "Polygon",
    symbol: "MATIC",
  },
];

const Polygon: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[polygon.id].wrapped,
  },
  {
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  // Source: https://www.circle.com/blog/native-usdc-now-available-on-polygon-pos
  {
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    name: "USD Coin",
    symbol: "USDC",
  },
  // Source: https://www.circle.com/blog/native-usdc-now-available-on-polygon-pos
  {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    name: "USD Coin (Bridged)",
    symbol: "USDC.e",
  },
  {
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    name: "Tether USD",
    symbol: "USDT",
  },
  {
    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    name: "Wrapped BTC",
    symbol: "WBTC",
  },
];

const Fantom: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[fantom.id].wrapped,
  },
  {
    name: "Wrapped Ether",
    address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    symbol: "WETH",
  },
  {
    name: "USD Coin",
    address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    symbol: "USDC",
  },
  {
    name: "Wrapped Bitcoin",
    address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
    symbol: "WBTC",
  },
];

const FantomTestnet: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[fantomTestnet.id].wrapped,
  },
];

const Avalanche: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[avalanche.id].wrapped,
  },
  {
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  {
    address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
    name: "Tether USD",
    symbol: "USDT",
  },
  {
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    name: "USD Coin",
    symbol: "USDC",
  },
  {
    address: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    name: "USD Coin (Bridged)",
    symbol: "USDC.e",
  },
  {
    address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
    name: "Wrapped BTC",
    symbol: "WBTC",
  },
];

const AvalancheFujiTestnet: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[avalancheFuji.id].wrapped,
  },
  // Source: https://developers.circle.com/stablecoins/docs/usdc-on-testing-networks#usdc-on-avalanche-testnet
  {
    address: "0x5425890298aed601595a70AB815c96711a31Bc65",
    name: "USD Coin",
    symbol: "USDC",
  },
];

const Optimism: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[optimism.id].wrapped,
  },
  // Source: https://www.circle.com/blog/now-available-usdc-on-op-mainnet
  {
    address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    name: "USD Coin",
    symbol: "USDC",
  },
  // Source: https://www.circle.com/blog/now-available-usdc-on-op-mainnet
  {
    address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    name: "USD Coin (Bridged)",
    symbol: "USDC.e",
  },
];

const Arbitrum: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[arbitrum.id].wrapped,
  },
  // Source: https://www.circle.com/blog/arbitrum-usdc-now-available
  {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    name: "USD Coin",
    symbol: "USDC",
  },
  // Source: https://www.circle.com/blog/arbitrum-usdc-now-available
  {
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    name: "USD Coin (Bridged)",
    symbol: "USDC.e",
  },
];

const BinanceMainnet: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[bsc.id].wrapped,
  },
  {
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    name: "Binance USD",
    symbol: "BUSD",
  },
  {
    address: "0x55d398326f99059ff775485246999027b3197955",
    name: "Tether USD",
    symbol: "USDT",
  },
  {
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    name: "USD Coin",
    symbol: "USDC",
  },
];

const BinanceTestnet: CurrencyMetadata[] = [
  {
    ...NATIVE_TOKENS[bscTestnet.id].wrapped,
  },
  {
    address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
    name: "Binance USD",
    symbol: "BUSD",
  },
  {
    address: "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd",
    name: "Tether USD",
    symbol: "USDT",
  },
];

const ArbitrumSepolia: CurrencyMetadata[] = [
  {
    address: "0x56c4BE79A46DF3e18A243AEfECBF42e8634a3d53",
    name: "DERC20",
    symbol: "DERC20",
  },
];

export const CURRENCIES: Record<number, CurrencyMetadata[] | undefined> = {
  [ethereum.id]: Ethereum,
  [polygon.id]: Polygon,
  [fantom.id]: Fantom,
  [fantomTestnet.id]: FantomTestnet,
  [avalanche.id]: Avalanche,
  [avalancheFuji.id]: AvalancheFujiTestnet,
  [optimism.id]: Optimism,
  [arbitrum.id]: Arbitrum,
  [bsc.id]: BinanceMainnet,
  [bscTestnet.id]: BinanceTestnet,
  [arbitrumSepolia.id]: ArbitrumSepolia,
} as const;

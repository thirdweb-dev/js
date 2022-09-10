import { ChainId, NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { constants } from "ethers";
import { OtherAddressZero } from "utils/zeroAddress";

export interface CurrencyMetadata {
  address: string;
  name: string;
  symbol: string;
}

const Ethereum: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
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
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  {
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    name: "Polygon",
    symbol: "WMATIC",
  },
];

const Rinkeby: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  {
    address: "0xeb8f08a975ab53e34d8a0330e0d34de942c95926",
    name: "USD Coin",
    symbol: "USDC",
  },
  {
    address: "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad",
    name: "Tether USD",
    symbol: "USDT",
  },
];

const Goerli: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  {
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    name: "USD Coin",
    symbol: "USDC",
  },
  // {
  //   address: "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad",
  //   name: "Tether USD",
  //   symbol: "USDT",
  // },
];

const Polygon: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Polygon",
    symbol: "MATIC",
  },
  {
    address: OtherAddressZero,
    name: "Polygon",
    symbol: "MATIC",
  },
  {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    name: "USD Coin",
    symbol: "USDC",
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
  {
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
];

const Mumbai: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Polygon",
    symbol: "MATIC",
  },
  {
    address: OtherAddressZero,
    name: "Polygon",
    symbol: "MATIC",
  },
  {
    name: "Wrapped Ether",
    address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    symbol: "WETH",
  },
  {
    name: "Wrapped Matic",
    address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    symbol: "WMATIC",
  },
  {
    name: "Tether USD",
    address: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
    symbol: "USDT",
  },
  {
    address: "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747",
    name: "USD Coin",
    symbol: "USDC",
  },
];

const Fantom: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Fantom",
    symbol: "FTM",
  },
  {
    address: OtherAddressZero,
    name: "Fantom",
    symbol: "FTM",
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
  {
    name: "Wrapped Fantom",
    address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    symbol: "WFTM",
  },
];

const FantomTestnet: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Fantom",
    symbol: "FTM",
  },
  {
    address: OtherAddressZero,
    name: "Fantom",
    symbol: "FTM",
  },
  {
    name: "Wrapped Fantom",
    address: "0xf1277d1Ed8AD466beddF92ef448A132661956621",
    symbol: "WFTM",
  },
];

const Avalanche: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Avalanche",
    symbol: "AVAX",
  },
  {
    address: OtherAddressZero,
    name: "Avalanche",
    symbol: "AVAX",
  },
  {
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    name: "Wrapped AVAX",
    symbol: "WAVAX",
  },
  {
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  {
    address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    name: "Tether USD",
    symbol: "USDT",
  },
  {
    address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
    name: "USD Coin",
    symbol: "USDC",
  },
  {
    address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
    name: "Wrapped BTC",
    symbol: "WBTC",
  },
];

const AvalancheFujiTestnet: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Avalanche",
    symbol: "AVAX",
  },
  {
    address: OtherAddressZero,
    name: "Avalanche",
    symbol: "AVAX",
  },
  {
    address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    name: "Wrapped AVAX",
    symbol: "WAVAX",
  },
];

const Optimism: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: "0x4200000000000000000000000000000000000006",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
];

const OptimismTestnet: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: "0xbC6F6b680bc61e30dB47721c6D1c5cde19C1300d",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
];

const Arbitrum: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
];

const ArbitrumTestnet: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: OtherAddressZero,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    address: "0xEBbc3452Cc911591e4F18f3b36727Df45d6bd1f9",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
];

const BinanceMainnet: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].name,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].symbol,
  },
  {
    address: OtherAddressZero,
    name: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].name,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].symbol,
  },
  {
    ...NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].wrapped,
  },
  {
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    name: "Binance USD",
    symbol: "BUSD",
  },
];

const BinanceTestnet: CurrencyMetadata[] = [
  {
    address: constants.AddressZero,
    name: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].name,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].symbol,
  },
  {
    address: OtherAddressZero,
    name: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].name,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].symbol,
  },
  {
    ...NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].wrapped,
  },
  {
    address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
    name: "Binance USD",
    symbol: "BUSD",
  },
];

export const CURRENCIES: Record<SUPPORTED_CHAIN_ID, CurrencyMetadata[]> = {
  [ChainId.Mainnet]: Ethereum,
  [ChainId.Rinkeby]: Rinkeby,
  [ChainId.Goerli]: Goerli,
  [ChainId.Polygon]: Polygon,
  [ChainId.Mumbai]: Mumbai,
  [ChainId.Fantom]: Fantom,
  [ChainId.FantomTestnet]: FantomTestnet,
  [ChainId.Avalanche]: Avalanche,
  [ChainId.AvalancheFujiTestnet]: AvalancheFujiTestnet,
  [ChainId.Optimism]: Optimism,
  [ChainId.OptimismKovan]: OptimismTestnet,
  // eslint-disable-next-line line-comment-position
  [ChainId.OptimismGoerli]: OptimismTestnet, // TODO adjust wrapped token address
  [ChainId.Arbitrum]: Arbitrum,
  [ChainId.ArbitrumRinkeby]: ArbitrumTestnet,
  // eslint-disable-next-line line-comment-position
  [ChainId.ArbitrumGoerli]: ArbitrumTestnet, // TODO adjust wrapped token address
  [ChainId.BinanceSmartChainMainnet]: BinanceMainnet,
  [ChainId.BinanceSmartChainTestnet]: BinanceTestnet,
} as const;

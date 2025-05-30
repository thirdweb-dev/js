import { stringify } from "viem";
import type { Token } from "../../bridge/index.js";
import { base } from "../../chains/chain-definitions/base.js";
import { defineChain } from "../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import type { BridgePrepareResult } from "../../react/core/hooks/useBridgePrepare.js";
import { getDefaultToken } from "../../react/core/utils/defaultTokens.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import { storyClient } from "../utils.js";

export const ETH: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  chainId: 1,
  decimals: 18,
  priceUsd: 1000,
  iconUri:
    "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
};

export const USDC: Token = {
  address: getDefaultToken(base, "USDC")?.address ?? "",
  name: "USD Coin",
  symbol: "USDC",
  chainId: base.id,
  decimals: 6,
  priceUsd: 1,
  iconUri:
    "https://coin-images.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
};

export const UNI: Token = {
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  name: "Uniswap",
  symbol: "UNI",
  chainId: 10,
  decimals: 18,
  priceUsd: 1000,
  iconUri:
    "https://coin-images.coingecko.com/coins/images/12504/large/uniswap-uni.png",
};

const createStoryMockWallet = (): Wallet => {
  const mockAccount: Account = {
    address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    sendTransaction: async () => ({
      transactionHash: "0xmockhash123" as `0x${string}`,
      chain: defineChain(1),
      client: storyClient,
    }),
    signMessage: async () => "0xsignature" as `0x${string}`,
    signTypedData: async () => "0xsignature" as `0x${string}`,
  };

  // Simple mock wallet implementation for storybook display only
  return {
    id: "inApp",
    getAccount: () => mockAccount,
    getChain: async () => defineChain(1),
    autoConnect: async () => mockAccount,
    connect: async () => mockAccount,
    disconnect: async () => {},
    switchChain: async () => {},
    subscribe: () => () => {},
    getConfig: () => ({}),
  } as unknown as Wallet;
};

export const STORY_MOCK_WALLET = createStoryMockWallet();

// Simple onramp quote with no extra steps
export const simpleOnrampQuote: BridgePrepareResult = JSON.parse(
  stringify({
    type: "onramp",
    id: "onramp-simple-123",
    link: "https://stripe.com/session/simple",
    currency: "USD",
    currencyAmount: 50.0,
    destinationAmount: 50000000n, // 50 USDC
    destinationToken: {
      chainId: 137,
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      priceUsd: 1.0,
      iconUri:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    },
    timestamp: Date.now(),
    steps: [], // No additional steps needed
    intent: {
      onramp: "stripe",
      chainId: 137,
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      amount: 50000000n,
    },
  }),
);

// Onramp quote with 2 extra swap steps
export const onrampWithSwapsQuote: BridgePrepareResult = JSON.parse(
  stringify({
    type: "onramp",
    id: "onramp-swaps-456",
    link: "https://stripe.com/session/swaps",
    currency: "EUR",
    currencyAmount: 100.0,
    destinationAmount: 1000000000000000000n, // 1 ETH
    destinationToken: {
      chainId: 1,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      priceUsd: 2500.0,
    },
    timestamp: Date.now(),
    steps: [
      {
        originToken: {
          chainId: 137,
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          name: "USD Coin (PoS)",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        destinationToken: {
          chainId: 137,
          address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          priceUsd: 2500.0,
        },
        originAmount: 110000000n, // 110 USDC
        destinationAmount: 44000000000000000n, // 0.044 WETH
        estimatedExecutionTimeMs: 30000,
        transactions: [
          {
            action: "approval",
            id: "0x1a2b3c",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            data: "0x095ea7b3",
            chainId: 137,
            client: storyClient,
            chain: defineChain(137),
          },
          {
            action: "buy",
            id: "0x4d5e6f",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            data: "0x472b43f3",
            chainId: 137,
            client: storyClient,
            chain: defineChain(137),
          },
        ],
      },
      {
        originToken: {
          chainId: 137,
          address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          priceUsd: 2500.0,
        },
        destinationToken: {
          chainId: 1,
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          priceUsd: 2500.0,
        },
        originAmount: 44000000000000000n, // 0.044 WETH
        destinationAmount: 1000000000000000000n, // 1 ETH
        estimatedExecutionTimeMs: 180000,
        transactions: [
          {
            action: "approval",
            id: "0x7g8h9i",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
            data: "0x095ea7b3",
            chainId: 137,
            client: storyClient,
            chain: defineChain(137),
          },
          {
            action: "transfer",
            id: "0xj1k2l3",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
            data: "0x3593564c",
            chainId: 137,
            client: storyClient,
            chain: defineChain(137),
          },
        ],
      },
    ],
    intent: {
      onramp: "stripe",
      chainId: 1,
      tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      amount: 1000000000000000000n,
    },
  }),
);

// Simple buy quote with single step (no approval needed)
export const simpleBuyQuote: BridgePrepareResult = JSON.parse(
  stringify({
    type: "buy",
    originAmount: 1000000000000000000n, // 1 ETH
    destinationAmount: 100000000n, // 100 USDC
    timestamp: Date.now(),
    estimatedExecutionTimeMs: 60000,
    steps: [
      {
        originToken: {
          chainId: 1,
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          priceUsd: 2500.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        destinationToken: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        originAmount: 1000000000000000000n,
        destinationAmount: 100000000n,
        estimatedExecutionTimeMs: 60000,
        transactions: [
          {
            action: "buy",
            id: "0xsingle123",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            data: "0x472b43f3",
            value: 1000000000000000000n,
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
        ],
      },
    ],
    intent: {
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 1,
      destinationTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: 100000000n,
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    },
  }),
);

// Buy quote with approval + buy in single step
export const buyWithApprovalQuote: BridgePrepareResult = JSON.parse(
  stringify({
    type: "buy",
    originAmount: 100000000n, // 100 USDC
    destinationAmount: 100000000n, // 100 USDC on different chain
    timestamp: Date.now(),
    estimatedExecutionTimeMs: 120000,
    steps: [
      {
        originToken: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        destinationToken: {
          chainId: 137,
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          name: "USD Coin (PoS)",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        originAmount: 100000000n,
        destinationAmount: 100000000n,
        estimatedExecutionTimeMs: 120000,
        transactions: [
          {
            action: "approval",
            id: "0xapproval789",
            to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            data: "0x095ea7b3",
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
          {
            action: "buy",
            id: "0xbuy456",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
            data: "0x3593564c",
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
        ],
      },
    ],
    intent: {
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      amount: 100000000n,
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    },
  }),
);

// Complex buy quote with 3 steps, each with approval + buy
export const complexBuyQuote: BridgePrepareResult = JSON.parse(
  stringify({
    type: "buy",
    originAmount: 1000000000000000000n, // 1 ETH
    destinationAmount: 1000000000000000000n, // 1 ETH on final chain
    timestamp: Date.now(),
    estimatedExecutionTimeMs: 300000,
    steps: [
      {
        originToken: {
          chainId: 1,
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          priceUsd: 2500.0,
        },
        destinationToken: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        originAmount: 1000000000000000000n,
        destinationAmount: 2500000000n, // 2500 USDC
        estimatedExecutionTimeMs: 60000,
        transactions: [
          {
            action: "approval",
            id: "0xstep1approval",
            to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            data: "0x095ea7b3",
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
          {
            action: "buy",
            id: "0xstep1buy",
            to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            data: "0x7ff36ab5",
            value: 1000000000000000000n,
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
        ],
      },
      {
        originToken: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        destinationToken: {
          chainId: 137,
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          name: "USD Coin (PoS)",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        originAmount: 2500000000n,
        destinationAmount: 2495000000n, // 2495 USDC (after bridge fees)
        estimatedExecutionTimeMs: 180000,
        transactions: [
          {
            action: "approval",
            id: "0xstep2approval",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
            data: "0x095ea7b3",
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
          {
            action: "transfer",
            id: "0xstep2bridge",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
            data: "0x3593564c",
            chainId: 1,
            client: storyClient,
            chain: defineChain(1),
          },
        ],
      },
      {
        originToken: {
          chainId: 137,
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          name: "USD Coin (PoS)",
          symbol: "USDC",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        destinationToken: {
          chainId: 43114,
          address: "0x62D0A8458eD7719FDAF978fe5929C6D342B0bFcE",
          symbol: "BEAM",
          name: "Beam",
          decimals: 18,
          priceUsd: 0.00642458,
          iconUri:
            "https://coin-images.coingecko.com/coins/images/32417/small/cgicon.png?1747892021",
        },
        originAmount: 2495000000n,
        destinationAmount: 1000000000000000000n, // 1 BEAM
        estimatedExecutionTimeMs: 60000,
        transactions: [
          {
            action: "approval",
            id: "0xstep3approval",
            to: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
            data: "0x095ea7b3",
            chainId: 137,
            client: storyClient,
            chain: defineChain(137),
          },
          {
            action: "buy",
            id: "0xstep3buy",
            to: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
            data: "0x12aa3caf",
            chainId: 137,
            client: storyClient,
            chain: defineChain(137),
          },
        ],
      },
    ],
    intent: {
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 42161,
      destinationTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      amount: 1000000000000000000n,
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    },
  }),
);

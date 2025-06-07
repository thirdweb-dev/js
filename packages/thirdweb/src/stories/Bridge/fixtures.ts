import { stringify } from "viem";
import type { Token } from "../../bridge/index.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { base } from "../../chains/chain-definitions/base.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import { defineChain } from "../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import { claimTo } from "../../extensions/erc20/drops/write/claimTo.js";
import { transfer } from "../../extensions/erc20/write/transfer.js";
import type { BridgePrepareResult } from "../../react/core/hooks/useBridgePrepare.js";
import { getDefaultToken } from "../../react/core/utils/defaultTokens.js";
import type { UIOptions } from "../../react/web/ui/Bridge/BridgeOrchestrator.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import { storyClient } from "../utils.js";

export const ETH: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  chainId: 10,
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
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
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
      receiver: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
    },
  }),
);

export const longTextBuyQuote: BridgePrepareResult = JSON.parse(
  stringify({
    type: "buy",
    originAmount: 1000000000000000000n, // 1 ETH
    destinationAmount: 1000394284092830482309n,
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
          chainId: 42793,
          address: "0x796Ea11Fa2dD751eD01b53C372fFDB4AAa8f00F9",
          name: "USD Coin (USDC.e on Etherlink)",
          symbol: "USDC.e",
          decimals: 6,
          priceUsd: 1.0,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        },
        originAmount: 1000000000000000000n,
        destinationAmount: 1000394284092830482309n,
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

// ========== PREPARED TRANSACTIONS FOR TRANSACTION PAYMENT ========== //

// mintTo raw transaction
export const ethTransferTransaction = prepareTransaction({
  to: "0x87C52295891f208459F334975a3beE198fE75244",
  data: "0x449a52f80000000000000000000000008447c7a30d18e9adf2abe362689fc994cc6a340d00000000000000000000000000000000000000000000000000038d7ea4c68000",
  chain: baseSepolia,
  client: storyClient,
});

// ERC20 token transaction with value
export const erc20Transaction = transfer({
  contract: getContract({
    client: storyClient,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chain: base,
  }),
  to: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
  amount: 100,
});

// claimTo on Polygon
export const contractInteractionTransaction = claimTo({
  contract: getContract({
    client: storyClient,
    address: "0x683f91F407301b90e501492F8A26A3498D8d9638",
    chain: polygon,
  }),
  to: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
  quantity: "10",
});

// ========== COMMON DUMMY DATA FOR STORYBOOK ========== //

// Common receiver addresses for testing
export const RECEIVER_ADDRESSES = {
  primary: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b" as const,
  secondary: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD" as const,
  seller: "0x1234567890123456789012345678901234567890" as const,
  subscription: "0x9876543210987654321098765432109876543210" as const,
  physical: "0x5555666677778888999900001111222233334444" as const,
};

// Product metadata for direct payments
export const PRODUCT_METADATA = {
  digitalArt: {
    name: "Premium Digital Art NFT",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&h=300&fit=crop",
    description: "This is a premium digital art by a famous artist",
  },
  concertTicket: {
    name: "Concert Ticket - The Midnight Live",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop",
    description: "Concert ticket for the upcoming show",
  },
  subscription: {
    name: "Premium Streaming Service - Monthly",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop",
    description:
      "Get unlimited access to our premium streaming service with this monthly subscription. Enjoy ad-free viewing, exclusive content, and the ability to download shows for offline viewing.",
  },
  sneakers: {
    name: "Limited Edition Sneakers",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
  },
  credits: {
    name: "Thirdweb Credits",
    description:
      "Add credits to your account for future billing cycles. Credits are non-refundable and do not expire.",
  },
};

// Type aliases for better type safety
type FundWalletUIOptions = Extract<UIOptions, { mode: "fund_wallet" }>;
type DirectPaymentUIOptions = Extract<UIOptions, { mode: "direct_payment" }>;
type TransactionUIOptions = Extract<UIOptions, { mode: "transaction" }>;

// UI Options for FundWallet mode
export const FUND_WALLET_UI_OPTIONS: Record<
  "ethDefault" | "ethWithAmount" | "usdcDefault" | "uniLarge",
  FundWalletUIOptions
> = {
  ethDefault: {
    mode: "fund_wallet" as const,
    destinationToken: ETH,
    metadata: {
      title: "Fund Wallet",
      description: "Add funds to your wallet",
    },
  },
  ethWithAmount: {
    mode: "fund_wallet" as const,
    destinationToken: ETH,
    initialAmount: "0.001",
    metadata: {
      title: "Fund Wallet",
      description: "Add funds to your wallet",
    },
  },
  usdcDefault: {
    mode: "fund_wallet" as const,
    destinationToken: USDC,
    initialAmount: "5",
  },
  uniLarge: {
    mode: "fund_wallet" as const,
    destinationToken: UNI,
    initialAmount: "150000",
    metadata: {
      title: "Fund Wallet",
      description: "Add UNI tokens to your wallet",
    },
  },
};

// UI Options for DirectPayment mode
export const DIRECT_PAYMENT_UI_OPTIONS: Record<
  "digitalArt" | "concertTicket" | "subscription" | "sneakers" | "credits",
  DirectPaymentUIOptions
> = {
  digitalArt: {
    mode: "direct_payment" as const,
    paymentInfo: {
      sellerAddress: RECEIVER_ADDRESSES.seller,
      token: ETH,
      amount: "0.1",
      feePayer: "sender" as const,
    },
    metadata: {
      title: "Purchase Digital Art",
      description: "Buy premium digital art NFT",
      image: PRODUCT_METADATA.digitalArt.image,
    },
  },
  concertTicket: {
    mode: "direct_payment" as const,
    paymentInfo: {
      sellerAddress: RECEIVER_ADDRESSES.primary,
      token: USDC,
      amount: "25.00",
      feePayer: "receiver" as const,
    },
    metadata: {
      title: "Buy Concert Ticket",
      description: "Get your ticket for The Midnight Live",
      image: PRODUCT_METADATA.concertTicket.image,
    },
  },
  subscription: {
    mode: "direct_payment" as const,
    paymentInfo: {
      sellerAddress: RECEIVER_ADDRESSES.subscription,
      token: USDC,
      amount: "9.99",
      feePayer: "sender" as const,
    },
    metadata: {
      title: "Subscribe to Premium",
      description: PRODUCT_METADATA.subscription.description,
      image: PRODUCT_METADATA.subscription.image,
    },
  },
  sneakers: {
    mode: "direct_payment" as const,
    paymentInfo: {
      sellerAddress: RECEIVER_ADDRESSES.physical,
      token: ETH,
      amount: "0.05",
      feePayer: "receiver" as const,
    },
    metadata: {
      title: "Buy Sneakers",
      description: "Limited edition sneakers",
      image: PRODUCT_METADATA.sneakers.image,
    },
  },
  credits: {
    mode: "direct_payment" as const,
    paymentInfo: {
      sellerAddress: RECEIVER_ADDRESSES.physical,
      token: USDC,
      amount: "25",
      feePayer: "receiver" as const,
    },
    metadata: {
      title: "Add Credits",
      description: PRODUCT_METADATA.credits.description,
    },
  },
};

// UI Options for Transaction mode
export const TRANSACTION_UI_OPTIONS: Record<
  "ethTransfer" | "erc20Transfer" | "contractInteraction",
  TransactionUIOptions
> = {
  ethTransfer: {
    mode: "transaction" as const,
    transaction: ethTransferTransaction,
    metadata: {
      title: "Execute Transaction",
      description: "Review and execute transaction",
    },
  },
  erc20Transfer: {
    mode: "transaction" as const,
    transaction: erc20Transaction,
    metadata: {
      title: "Token Transfer",
      description: "Transfer ERC20 tokens",
    },
  },
  contractInteraction: {
    mode: "transaction" as const,
    transaction: contractInteractionTransaction,
    metadata: {
      title: "Contract Interaction",
      description: "Interact with smart contract",
    },
  },
};

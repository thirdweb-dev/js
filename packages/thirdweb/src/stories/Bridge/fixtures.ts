import { stringify } from "viem";
import type { Token } from "../../bridge/index.js";
import { base } from "../../chains/chain-definitions/base.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import { defineChain } from "../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import { claimTo } from "../../extensions/erc20/drops/write/claimTo.js";
import { transfer } from "../../extensions/erc20/write/transfer.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../react/core/hooks/useBridgePrepare.js";
import { getDefaultToken } from "../../react/core/utils/defaultTokens.js";
import type { UIOptions } from "../../react/web/ui/Bridge/BridgeOrchestrator.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { toWei } from "../../utils/units.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import { storyClient } from "../utils.js";

export const ETH: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  chainId: 10,
  decimals: 18,
  iconUri:
    "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
  name: "Ethereum",
  prices: {
    USD: 1000,
  },
  symbol: "ETH",
};

export const USDC: Token = {
  address: getDefaultToken(base, "USDC")?.address ?? "",
  chainId: base.id,
  decimals: 6,
  iconUri:
    "https://coin-images.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  name: "USD Coin",
  prices: {
    USD: 1,
  },
  symbol: "USDC",
};

export const UNI: Token = {
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  chainId: 10,
  decimals: 18,
  iconUri:
    "https://coin-images.coingecko.com/coins/images/12504/large/uniswap-uni.png",
  name: "Uniswap",
  prices: {
    USD: 1000,
  },
  symbol: "UNI",
};

const createStoryMockWallet = (): Wallet => {
  const mockAccount: Account = {
    address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    sendTransaction: async () => ({
      chain: defineChain(1),
      client: storyClient,
      transactionHash: "0xmockhash123" as `0x${string}`,
    }),
    signMessage: async () => "0xsignature" as `0x${string}`,
    signTypedData: async () => "0xsignature" as `0x${string}`,
  };

  // Simple mock wallet implementation for storybook display only
  return {
    autoConnect: async () => mockAccount,
    connect: async () => mockAccount,
    disconnect: async () => {},
    getAccount: () => mockAccount,
    getChain: async () => defineChain(1),
    getConfig: () => ({}),
    id: "inApp",
    subscribe: () => () => {},
    switchChain: async () => {},
  } as unknown as Wallet;
};

export const STORY_MOCK_WALLET = createStoryMockWallet();

// Simple onramp quote with no extra steps
export const simpleOnrampQuote: BridgePrepareResult = JSON.parse(
  stringify({
    currency: "USD",
    currencyAmount: 50.0,
    destinationAmount: 50000000n,
    destinationToken: {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      chainId: 137,
      decimals: 6,
      iconUri:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
      name: "USD Coin (PoS)",
      prices: {
        USD: 1.0,
      },
      symbol: "USDC",
    },
    id: "onramp-simple-123",
    intent: {
      amount: 50000000n,
      chainId: 137,
      onramp: "stripe",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    }, // 50 USDC
    link: "https://stripe.com/session/simple",
    steps: [],
    timestamp: Date.now(), // No additional steps needed
    type: "onramp",
  }),
);

// Onramp quote with 2 extra swap steps
export const onrampWithSwapsQuote: BridgePrepareResult = JSON.parse(
  stringify({
    currency: "EUR",
    currencyAmount: 100.0,
    destinationAmount: 1000000000000000000n,
    destinationToken: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      chainId: 1,
      decimals: 18,
      name: "Ethereum",
      prices: {
        USD: 2500.0,
      },
      symbol: "ETH",
    },
    id: "onramp-swaps-456",
    intent: {
      amount: 1000000000000000000n,
      chainId: 1,
      onramp: "stripe",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    }, // 1 ETH
    link: "https://stripe.com/session/swaps",
    steps: [
      {
        destinationAmount: 44000000000000000n,
        destinationToken: {
          address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          chainId: 137,
          decimals: 18,
          name: "Wrapped Ether",
          prices: {
            USD: 2500.0,
          },
          symbol: "WETH",
        },
        estimatedExecutionTimeMs: 30000, // 110 USDC
        originAmount: 110000000n, // 0.044 WETH
        originToken: {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          chainId: 137,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin (PoS)",
          prices: {
            USD: 1.0,
          },
          symbol: "USDC",
        },
        transactions: [
          {
            action: "approval",
            chain: defineChain(137),
            chainId: 137,
            client: storyClient,
            data: "0x095ea7b3",
            id: "0x1a2b3c",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
          },
          {
            action: "buy",
            chain: defineChain(137),
            chainId: 137,
            client: storyClient,
            data: "0x472b43f3",
            id: "0x4d5e6f",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
          },
        ],
      },
      {
        destinationAmount: 1000000000000000000n,
        destinationToken: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId: 1,
          decimals: 18,
          name: "Ethereum",
          prices: {
            USD: 2500.0,
          },
          symbol: "ETH",
        },
        estimatedExecutionTimeMs: 180000, // 0.044 WETH
        originAmount: 44000000000000000n, // 1 ETH
        originToken: {
          address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          chainId: 137,
          decimals: 18,
          name: "Wrapped Ether",
          prices: {
            USD: 2500.0,
          },
          symbol: "WETH",
        },
        transactions: [
          {
            action: "approval",
            chain: defineChain(137),
            chainId: 137,
            client: storyClient,
            data: "0x095ea7b3",
            id: "0x7g8h9i",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
          },
          {
            action: "transfer",
            chain: defineChain(137),
            chainId: 137,
            client: storyClient,
            data: "0x3593564c",
            id: "0xj1k2l3",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
          },
        ],
      },
    ],
    timestamp: Date.now(),
    type: "onramp",
  }),
);

// Simple buy quote with single step (no approval needed)
export const simpleBuyQuote: BridgePrepareResult = JSON.parse(
  stringify({
    destinationAmount: 100000000n,
    estimatedExecutionTimeMs: 60000, // 1 ETH
    intent: {
      amount: 100000000n,
      destinationChainId: 1,
      destinationTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      receiver: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    }, // 100 USDC
    originAmount: 1000000000000000000n,
    steps: [
      {
        destinationAmount: 100000000n,
        destinationToken: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          chainId: 1,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin",
          prices: {
            USD: 1.0,
          },
          symbol: "USDC",
        },
        estimatedExecutionTimeMs: 60000,
        originAmount: 1000000000000000000n,
        originToken: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId: 1,
          decimals: 18,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "Ethereum",
          prices: {
            USD: 2500.0,
          },
          symbol: "ETH",
        },
        transactions: [
          {
            action: "buy",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x472b43f3",
            id: "0xsingle123",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            value: 1000000000000000000n,
          },
        ],
      },
    ],
    timestamp: Date.now(),
    type: "buy",
  }),
);

export const longTextBuyQuote: BridgePrepareResult = JSON.parse(
  stringify({
    destinationAmount: 1000394284092830482309n,
    estimatedExecutionTimeMs: 60000, // 1 ETH
    intent: {
      amount: 100000000n,
      destinationChainId: 1,
      destinationTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    },
    originAmount: 1000000000000000000n,
    steps: [
      {
        destinationAmount: 1000394284092830482309n,
        destinationToken: {
          address: "0x796Ea11Fa2dD751eD01b53C372fFDB4AAa8f00F9",
          chainId: 42793,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin (USDC.e on Etherlink)",
          prices: {
            USD: 1.0,
          },
          symbol: "USDC.e",
        },
        estimatedExecutionTimeMs: 60000,
        originAmount: 1000000000000000000n,
        originToken: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId: 1,
          decimals: 18,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "Ethereum",
          priceUsd: 2500.0,
          symbol: "ETH",
        },
        transactions: [
          {
            action: "buy",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x472b43f3",
            id: "0xsingle123",
            to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            value: 1000000000000000000n,
          },
        ],
      },
    ],
    timestamp: Date.now(),
    type: "buy",
  }),
);

// Buy quote with approval + buy in single step
export const buyWithApprovalQuote: BridgePrepareResult = JSON.parse(
  stringify({
    destinationAmount: 100000000n,
    estimatedExecutionTimeMs: 120000, // 100 USDC
    intent: {
      amount: 100000000n,
      destinationChainId: 137,
      destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      originChainId: 1,
      originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    }, // 100 USDC on different chain
    originAmount: 100000000n,
    steps: [
      {
        destinationAmount: 100000000n,
        destinationToken: {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          chainId: 137,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin (PoS)",
          priceUsd: 1.0,
          symbol: "USDC",
        },
        estimatedExecutionTimeMs: 120000,
        originAmount: 100000000n,
        originToken: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          chainId: 1,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin",
          priceUsd: 1.0,
          symbol: "USDC",
        },
        transactions: [
          {
            action: "approval",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x095ea7b3",
            id: "0xapproval789",
            to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          },
          {
            action: "buy",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x3593564c",
            id: "0xbuy456",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
          },
        ],
      },
    ],
    timestamp: Date.now(),
    type: "buy",
  }),
);

// Complex buy quote with 3 steps, each with approval + buy
export const complexBuyQuote: BridgePrepareResult = JSON.parse(
  stringify({
    destinationAmount: 1000000000000000000n,
    estimatedExecutionTimeMs: 300000, // 1 ETH
    intent: {
      amount: 1000000000000000000n,
      destinationChainId: 42161,
      destinationTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
      sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
    }, // 1 ETH on final chain
    originAmount: 1000000000000000000n,
    steps: [
      {
        destinationAmount: 2500000000n,
        destinationToken: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          chainId: 1,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin",
          priceUsd: 1.0,
          symbol: "USDC",
        },
        estimatedExecutionTimeMs: 60000,
        originAmount: 1000000000000000000n, // 2500 USDC
        originToken: {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId: 1,
          decimals: 18,
          name: "Ethereum",
          priceUsd: 2500.0,
          symbol: "ETH",
        },
        transactions: [
          {
            action: "approval",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x095ea7b3",
            id: "0xstep1approval",
            to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
          },
          {
            action: "buy",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x7ff36ab5",
            id: "0xstep1buy",
            to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            value: 1000000000000000000n,
          },
        ],
      },
      {
        destinationAmount: 2495000000n,
        destinationToken: {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          chainId: 137,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin (PoS)",
          priceUsd: 1.0,
          symbol: "USDC",
        },
        estimatedExecutionTimeMs: 180000,
        originAmount: 2500000000n, // 2495 USDC (after bridge fees)
        originToken: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          chainId: 1,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin",
          priceUsd: 1.0,
          symbol: "USDC",
        },
        transactions: [
          {
            action: "approval",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x095ea7b3",
            id: "0xstep2approval",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
          },
          {
            action: "transfer",
            chain: defineChain(1),
            chainId: 1,
            client: storyClient,
            data: "0x3593564c",
            id: "0xstep2bridge",
            to: "0x3fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
          },
        ],
      },
      {
        destinationAmount: 1000000000000000000n,
        destinationToken: {
          address: "0x62D0A8458eD7719FDAF978fe5929C6D342B0bFcE",
          chainId: 43114,
          decimals: 18,
          iconUri:
            "https://coin-images.coingecko.com/coins/images/32417/small/cgicon.png?1747892021",
          name: "Beam",
          priceUsd: 0.00642458,
          symbol: "BEAM",
        },
        estimatedExecutionTimeMs: 60000,
        originAmount: 2495000000n, // 1 BEAM
        originToken: {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          chainId: 137,
          decimals: 6,
          iconUri:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
          name: "USD Coin (PoS)",
          priceUsd: 1.0,
          symbol: "USDC",
        },
        transactions: [
          {
            action: "approval",
            chain: defineChain(137),
            chainId: 137,
            client: storyClient,
            data: "0x095ea7b3",
            id: "0xstep3approval",
            to: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
          },
          {
            action: "buy",
            chain: defineChain(137),
            chainId: 137,
            client: storyClient,
            data: "0x12aa3caf",
            id: "0xstep3buy",
            to: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
          },
        ],
      },
    ],
    timestamp: Date.now(),
    type: "buy",
  }),
);
export const simpleBuyRequest: BridgePrepareRequest = {
  amount: toWei("0.01"),
  client: storyClient,
  destinationChainId: 10,
  destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
  originChainId: 1,
  originTokenAddress: NATIVE_TOKEN_ADDRESS,
  receiver: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
  sender: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD",
  type: "buy",
};

// ========== PREPARED TRANSACTIONS FOR TRANSACTION PAYMENT ========== //

// mintTo raw transaction
const ethTransferTransaction = prepareTransaction({
  chain: baseSepolia,
  client: storyClient,
  data: "0x449a52f80000000000000000000000008447c7a30d18e9adf2abe362689fc994cc6a340d00000000000000000000000000000000000000000000000000038d7ea4c68000",
  to: "0x87C52295891f208459F334975a3beE198fE75244",
});

// ERC20 token transaction with value
const erc20Transaction = transfer({
  amount: 100,
  contract: getContract({
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chain: base,
    client: storyClient,
  }),
  to: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
});

// claimTo on Polygon
const contractInteractionTransaction = claimTo({
  contract: getContract({
    address: "0x683f91F407301b90e501492F8A26A3498D8d9638",
    chain: polygon,
    client: storyClient,
  }),
  quantity: "10",
  to: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
});

// ========== COMMON DUMMY DATA FOR STORYBOOK ========== //

// Common receiver addresses for testing
export const RECEIVER_ADDRESSES = {
  physical: "0x5555666677778888999900001111222233334444" as const,
  primary: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b" as const,
  secondary: "0xa3841994009B4fEabb01ebcC62062F9E56F701CD" as const,
  seller: "0x1234567890123456789012345678901234567890" as const,
  subscription: "0x9876543210987654321098765432109876543210" as const,
};

// Product metadata for direct payments
const PRODUCT_METADATA = {
  concertTicket: {
    description: "Concert ticket for the upcoming show",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop",
    name: "Concert Ticket - The Midnight Live",
  },
  credits: {
    description:
      "Add credits to your account for future billing cycles. Credits are non-refundable and do not expire.",
    name: "Thirdweb Credits",
  },
  digitalArt: {
    description: "This is a premium digital art by a famous artist",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&h=300&fit=crop",
    name: "Premium Digital Art NFT",
  },
  sneakers: {
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
    name: "Limited Edition Sneakers",
  },
  subscription: {
    description:
      "Get unlimited access to our premium streaming service with this monthly subscription. Enjoy ad-free viewing, exclusive content, and the ability to download shows for offline viewing.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop",
    name: "Premium Streaming Service - Monthly",
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
    destinationToken: ETH,
    metadata: {
      description: "Add funds to your wallet",
      title: "Fund Wallet",
    },
    mode: "fund_wallet" as const,
  },
  ethWithAmount: {
    destinationToken: ETH,
    initialAmount: "0.001",
    metadata: {
      description: "Add funds to your wallet",
      title: "Fund Wallet",
    },
    mode: "fund_wallet" as const,
  },
  uniLarge: {
    destinationToken: UNI,
    initialAmount: "150000",
    metadata: {
      description: "Add UNI tokens to your wallet",
      title: "Fund Wallet",
    },
    mode: "fund_wallet" as const,
  },
  usdcDefault: {
    destinationToken: USDC,
    initialAmount: "5",
    mode: "fund_wallet" as const,
  },
};

// UI Options for DirectPayment mode
export const DIRECT_PAYMENT_UI_OPTIONS: Record<
  "digitalArt" | "concertTicket" | "subscription" | "sneakers" | "credits",
  DirectPaymentUIOptions
> = {
  concertTicket: {
    metadata: {
      description: "Get your ticket for The Midnight Live",
      image: PRODUCT_METADATA.concertTicket.image,
      title: "Buy Concert Ticket",
    },
    mode: "direct_payment" as const,
    paymentInfo: {
      amount: "25.00",
      feePayer: "receiver" as const,
      sellerAddress: RECEIVER_ADDRESSES.primary,
      token: USDC,
    },
  },
  credits: {
    metadata: {
      description: PRODUCT_METADATA.credits.description,
      title: "Add Credits",
    },
    mode: "direct_payment" as const,
    paymentInfo: {
      amount: "25",
      feePayer: "receiver" as const,
      sellerAddress: RECEIVER_ADDRESSES.physical,
      token: USDC,
    },
  },
  digitalArt: {
    metadata: {
      description: "Buy premium digital art NFT",
      image: PRODUCT_METADATA.digitalArt.image,
      title: "Purchase Digital Art",
    },
    mode: "direct_payment" as const,
    paymentInfo: {
      amount: "0.1",
      feePayer: "sender" as const,
      sellerAddress: RECEIVER_ADDRESSES.seller,
      token: ETH,
    },
  },
  sneakers: {
    metadata: {
      description: "Limited edition sneakers",
      image: PRODUCT_METADATA.sneakers.image,
      title: "Buy Sneakers",
    },
    mode: "direct_payment" as const,
    paymentInfo: {
      amount: "0.05",
      feePayer: "receiver" as const,
      sellerAddress: RECEIVER_ADDRESSES.physical,
      token: ETH,
    },
  },
  subscription: {
    metadata: {
      description: PRODUCT_METADATA.subscription.description,
      image: PRODUCT_METADATA.subscription.image,
      title: "Subscribe to Premium",
    },
    mode: "direct_payment" as const,
    paymentInfo: {
      amount: "9.99",
      feePayer: "sender" as const,
      sellerAddress: RECEIVER_ADDRESSES.subscription,
      token: USDC,
    },
  },
};

// UI Options for Transaction mode
export const TRANSACTION_UI_OPTIONS: Record<
  "ethTransfer" | "erc20Transfer" | "contractInteraction",
  TransactionUIOptions
> = {
  contractInteraction: {
    metadata: {
      description: "Interact with smart contract",
      title: "Contract Interaction",
    },
    mode: "transaction" as const,
    transaction: contractInteractionTransaction,
  },
  erc20Transfer: {
    metadata: {
      description: "Transfer ERC20 tokens",
      title: "Token Transfer",
    },
    mode: "transaction" as const,
    transaction: erc20Transaction,
  },
  ethTransfer: {
    metadata: {
      description: "Review and execute transaction",
      title: "Execute Transaction",
    },
    mode: "transaction" as const,
    transaction: ethTransferTransaction,
  },
};

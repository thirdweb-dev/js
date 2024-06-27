import type { ValidBuyWithCryptoStatus } from "../../pay/buyWithCrypto/getStatus.js";
import type { ValidBuyWithFiatStatus } from "../../pay/buyWithFiat/getStatus.js";
import type { BuyHistoryData } from "../../pay/getBuyHistory.js";

export const completedSwapTxStatus: ValidBuyWithCryptoStatus = {
  quote: {
    fromToken: {
      chainId: 137,
      tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    toToken: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 56,
      name: "MATIC",
      symbol: "MATIC",
    },
    fromAmountWei: "2805902",
    fromAmount: "2.805902",
    toAmountWei: "5027638255707228160",
    toAmount: "5.02763825570722816",
    toAmountMin: "5.002500064428692019",
    toAmountMinWei: "5002500064428692019",
    estimated: {
      fromAmountUSDCents: 281,
      toAmountMinUSDCents: 280,
      toAmountUSDCents: 282,
      slippageBPS: 50,
      feesUSDCents: 3,
      gasCostUSDCents: 1,
      durationSeconds: 30,
    },
    createdAt: "2024-06-26T19:46:20.357Z",
  },
  swapType: "SAME_CHAIN",
  source: {
    transactionHash:
      "0x3750a48acb558bebee1840a7d82d3ddd31b64c8127e37c9518d5b3a0bdba2f36",
    token: {
      chainId: 137,
      tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    amount: "2.805902",
    amountWei: "2805902",
    amountUSDCents: 281,
    completedAt: "1970-01-20T21:37:11.211Z",
  },
  status: "COMPLETED",
  subStatus: "SUCCESS",
  fromAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
  toAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
  destination: {
    transactionHash:
      "0x3750a48acb558bebee1840a7d82d3ddd31b64c8127e37c9518d5b3a0bdba2f36",
    token: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 56,
      name: "MATIC",
      symbol: "MATIC",
    },
    amount: "10.031617680549895067",
    amountWei: "10031617680549895067",
    amountUSDCents: 562,
    completedAt: "1970-01-20T21:37:11.211Z",
  },
};

export const onRampCompleteSwapRequiredTxStatus: ValidBuyWithFiatStatus = {
  intentId: "4652cd9b-dde8-4c60-b304-c20086bc51c9",
  status: "CRYPTO_SWAP_REQUIRED",
  toAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
  quote: {
    createdAt: "2024-05-10T11:35:31.908Z",
    estimatedOnRampAmountWei: "9312000000000000000",
    estimatedOnRampAmount: "9.312",
    estimatedToTokenAmount: "0.002",
    estimatedToTokenAmountWei: "2000000000000000",
    fromCurrency: {
      amount: "6.43",
      amountUnits: "643.75",
      decimals: 2,
      currencySymbol: "USD",
    },
    fromCurrencyWithFees: {
      amount: "6.772499999999999",
      amountUnits: "651",
      decimals: 2,
      currencySymbol: "USD",
    },
    onRampToken: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 57,
      name: "MATIC",
      symbol: "MATIC",
    },
    toToken: {
      chainId: 8453,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 346572,
      name: "ETH",
      symbol: "ETH",
    },
    estimatedDurationSeconds: 10,
  },
  source: {
    transactionHash:
      "0x1a87c9b5c1919efb2ef3e5b268c55079e29469ffb9c01ab6b5457a44866406e8",
    token: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 57,
      name: "MATIC",
      symbol: "MATIC",
    },
    amount: "9.312",
    amountWei: "9312000000000000000",
    amountUSDCents: 531,
    completedAt: "2024-05-10T11:37:00.309Z",
    explorerLink:
      "https://polygonscan.com/tx/0x1a87c9b5c1919efb2ef3e5b268c55079e29469ffb9c01ab6b5457a44866406e8",
  },
};

export const onRampPendingSwapRequiredTxStatus: ValidBuyWithFiatStatus = {
  ...onRampCompleteSwapRequiredTxStatus,
  status: "ON_RAMP_TRANSFER_IN_PROGRESS",
};

export const onRampCompletedSwapCompletedTxStatus: ValidBuyWithFiatStatus = {
  ...onRampCompleteSwapRequiredTxStatus,
  status: "CRYPTO_SWAP_COMPLETED",
  // this is not really returned from API - just mocking it
  destination: {
    amount: onRampCompleteSwapRequiredTxStatus.quote.estimatedToTokenAmount,
    amountUSDCents: 6800,
    amountWei: "2000000000000000",
    token: {
      chainId: 8453,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 346572,
      name: "ETH",
      symbol: "ETH",
    },
    transactionHash: "0xTEST",
    completedAt: "2024-05-10T11:37:00.309Z",
    explorerLink: "https://basescan.org/tx/0xTEST",
  },
};

export const onRampCompletedNoSwapRequired: ValidBuyWithFiatStatus = {
  intentId: "920044d5-1627-4f10-98d9-6c0c1354e8d0",
  status: "ON_RAMP_TRANSFER_COMPLETED",
  toAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
  quote: {
    createdAt: "2024-05-09T12:59:40.340Z",
    estimatedOnRampAmountWei: "11000000",
    estimatedOnRampAmount: "11",
    estimatedToTokenAmount: "11",
    estimatedToTokenAmountWei: "11000000",
    fromCurrency: {
      amount: "11",
      amountUnits: "1100.00",
      decimals: 2,
      currencySymbol: "USD",
    },
    fromCurrencyWithFees: {
      amount: "11.45",
      amountUnits: "1145",
      decimals: 2,
      currencySymbol: "USD",
    },
    onRampToken: {
      chainId: 137,
      tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    toToken: {
      chainId: 137,
      tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    estimatedDurationSeconds: 30,
  },
  source: {
    transactionHash:
      "0x827e709daf8ecf259e1fefc81a1c9afa1c213eef8f66d87c63f61a0e9163bd3a",
    token: {
      chainId: 137,
      tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    amount: "11",
    amountWei: "11000000",
    amountUSDCents: 1100,
    completedAt: "2024-05-09T13:01:49.922Z",
    explorerLink:
      "https://polygonscan.com/tx/0x827e709daf8ecf259e1fefc81a1c9afa1c213eef8f66d87c63f61a0e9163bd3a",
  },
};

export const failedSwapTxStatus: ValidBuyWithCryptoStatus = {
  quote: {
    fromToken: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 80,
      name: "MATIC",
      symbol: "MATIC",
    },
    toToken: {
      chainId: 137,
      tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    fromAmountWei: "6191196133306256089",
    fromAmount: "6.191196133306256089",
    toAmountWei: "5028235",
    toAmount: "5.028235",
    toAmountMin: "5.003094",
    toAmountMinWei: "5003094",
    estimated: {
      fromAmountUSDCents: 495,
      toAmountMinUSDCents: 502,
      toAmountUSDCents: 504,
      slippageBPS: 50,
      feesUSDCents: 5,
      gasCostUSDCents: 18,
      durationSeconds: 30,
    },
    createdAt: "2024-04-12T18:21:05.521Z",
  },
  swapType: "SAME_CHAIN",
  source: {
    transactionHash:
      "0x3f66ef3d7a3bb4360d7185deef84da2bfaf32c47477c91878420d3c81bc51455",
    token: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 80,
      name: "MATIC",
      symbol: "MATIC",
    },
    amount: "6.191196133306256089",
    amountWei: "6191196133306256089",
    amountUSDCents: 495,
    completedAt: "2024-04-12T20:29:29.000Z",
  },
  status: "FAILED",
  subStatus: "REVERTED_ON_CHAIN",
  fromAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
  toAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
};

const page: BuyHistoryData["page"] = [
  {
    buyWithCryptoStatus: completedSwapTxStatus,
  },
  {
    buyWithFiatStatus: onRampCompleteSwapRequiredTxStatus,
  },
  {
    buyWithFiatStatus: onRampPendingSwapRequiredTxStatus,
  },
  {
    buyWithFiatStatus: onRampCompletedNoSwapRequired,
  },
  {
    buyWithCryptoStatus: failedSwapTxStatus,
  },
  {
    buyWithFiatStatus: onRampCompletedSwapCompletedTxStatus,
  },
];

export const mockBuyTxHistory: BuyHistoryData = {
  walletAddress: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
  page: page,
  start: 0,
  count: page.length,
  hasNextPage: false,
};

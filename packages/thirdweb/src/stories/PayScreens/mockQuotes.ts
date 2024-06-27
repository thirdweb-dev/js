import { base } from "../../chains/chain-definitions/base.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../chains/types.js";
import type { BuyWithCryptoQuote } from "../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatQuote } from "../../pay/buyWithFiat/getQuote.js";
import type { BuyWithFiatStatus } from "../../pay/buyWithFiat/getStatus.js";
import {
  type CurrencyMeta,
  USDCurrency,
} from "../../react/web/ui/ConnectWallet/screens/Buy/fiat/currencies.js";
import type { ERC20OrNativeToken } from "../../react/web/ui/ConnectWallet/screens/nativeToken.js";
import { storyClient, usdcBase, usdcPolygon } from "../utils.js";

export type BuyWithCryptoMocks = {
  meta: {
    label: string;
    buyTokenAmount: string;
    buyToken: ERC20OrNativeToken;
    buyChain: Chain;
    fromToken: ERC20OrNativeToken;
    fromChain: Chain;
  };
  quote: BuyWithCryptoQuote;
  status: {
    none: BuyWithCryptoStatus;
    pending: BuyWithCryptoStatus;
    success: BuyWithCryptoStatus;
    failed: BuyWithCryptoStatus;
  };
};

export type BuyWithFiatMocks = {
  quote: BuyWithFiatQuote;
} & (
  | {
      meta: {
        label: string;
        buyTokenAmount: string;
        buyToken: ERC20OrNativeToken;
        buyChain: Chain;
        currency: CurrencyMeta;
      };
      type: "onramponly";
      onrampStatus: {
        none: BuyWithFiatStatus;
        pending: BuyWithFiatStatus;
        success: BuyWithFiatStatus;
        failed: BuyWithFiatStatus;
      };
    }
  | {
      meta: {
        label: string;
        buyTokenAmount: string;
        buyToken: ERC20OrNativeToken;
        buyChain: Chain;
        currency: CurrencyMeta;
        onRampToken: ERC20OrNativeToken;
        onRampChain: Chain;
      };
      type: "onrampandswap";
      onrampStatus: {
        none: BuyWithFiatStatus;
        pending: BuyWithFiatStatus;
        swapRequired: BuyWithFiatStatus;
        failed: BuyWithFiatStatus;
      };
      postOnrampSwap: {
        quote: BuyWithCryptoQuote;
        status: {
          none: BuyWithCryptoStatus;
          pending: BuyWithCryptoStatus;
          success: BuyWithCryptoStatus;
          failed: BuyWithCryptoStatus;
        };
      };
    }
);

// Buy 5 Matic with polygon USDC
export function getBuyPolygonWithUSDCMocks(options: {
  fromAddress: string;
  toAddress: string;
}): BuyWithCryptoMocks {
  const meta: BuyWithCryptoMocks["meta"] = {
    label: "Buy 5 Polygon matic with Polygon USDC",
    buyTokenAmount: "5",
    buyToken: { nativeToken: true },
    buyChain: polygon,
    fromToken: usdcPolygon,
    fromChain: polygon,
  };

  const quote: BuyWithCryptoQuote = {
    transactionRequest: {
      chain: {
        id: 137,
        rpc: "https://137.rpc.thirdweb.com",
      },
      client: storyClient,
      data: "0x883f57440000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000084063c109f02ccb43a9b69971119dcee1080000000000000000000000000000000042e89942d8bc4937be20391bafd62a28000000000000000000000000000000000000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c335900000000000000000000000000000000000000000000000000000000002a8c8700000000000000000000000000000000000000000000000000000000667c603400000000000000000000000000000000000000000000000000000000000001000000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae00000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000000263c109f02ccb43a9b69971119dcee108000000000000000000000000000000000000000000000000000000003dde4b49dcfd8f14524b8cb439703d024a5c4a1b000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e68623878ad5ceefa790ce00770de86bfb7a3c83000000000000000000000000000000000000000000000000000000000000004600000000000000000000000000000000000000000000000000000000000005e44630a0d89e430271d46163210874b1448ff68ad7dd36a474bfa348004704a8a7964e210200000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000001f846f6dae38e1c88d71eaa191760b15f38b7a37000000000000000000000000000000000000000000000000456c731cf2a3a8cc000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000087468697264776562000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307830303030303030303030303030303030303030303030303030303030303030303030303030303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea90000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c33590000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c335900000000000000000000000000000000000000000000000000000000002a8c8700000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000084eedd56e10000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c335900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b3b00000000000000000000000029dacdf7ccadf4ee67c923b4c22255a4b2494ed70000000000000000000000000000000000000000000000000000000000000000000000000000000046b3fdf7b5cde91ac049936bf0bdb12c5d22202e00000000000000000000000046b3fdf7b5cde91ac049936bf0bdb12c5d22202e0000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c3359000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a714c00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001642646478b0000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c335900000000000000000000000000000000000000000000000000000000002a714c000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000456c731cf2a3a8cc0000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000070023c499c542cef5e3811e1192ce70d8cc03d5c335901ffff01b6e57ed85c4c9dbfef2a68711e9d6f36c56e0fcb0046b3fdf7b5cde91ac049936bf0bdb12c5d22202e010d500b1d8e8ef31e21c99d1db9a6444d3adf127001ffff02001231deb6f5749ef6ce6943a275a1d3e7486f4eae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041b03234b92d9585337796c00445ec766a69aed750ae5c47c70ccc773c1e3691856ff5576f0babab29d8c7bfbc2679ed0c68d834b69579b847d6f54c48df8be6931c00000000000000000000000000000000000000000000000000000000000000",
      to: "0x654bb023bc21e69de646b4cf350df20d18f5093a",
      value: BigInt(0),
      gas: BigInt(667491),
      gasPrice: BigInt(30000000032),
    },
    approval: {
      to: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      chain: {
        id: 137,
        rpc: "https://137.rpc.thirdweb.com",
      },
      client: storyClient,
      // @ts-expect-error
      __contract: {
        client: {
          clientId: "cebdc2fa8aaa0170af42dc92b0ca34d8",
        },
        address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        chain: {
          id: 137,
          rpc: "https://137.rpc.thirdweb.com",
        },
      },
    },
    swapDetails: {
      fromAddress: options.fromAddress,
      toAddress: options.toAddress,
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
      fromAmount: "2.788487",
      fromAmountWei: "2788487",
      toAmountMinWei: "5002499854268868812",
      toAmountMin: "5.002499854268868812",
      toAmountWei: "5027638044491325440",
      toAmount: "5.02763804449132544",
      estimated: {
        fromAmountUSDCents: 278.75,
        toAmountMinUSDCents: 280,
        toAmountUSDCents: 281.5,
        slippageBPS: 50,
        feesUSDCents: 3.75,
        gasCostUSDCents: 1,
        durationSeconds: 30,
      },
      maxSlippageBPS: 50,
    },
    paymentTokens: [
      {
        token: {
          chainId: 137,
          tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
          decimals: 6,
          priceUSDCents: 100,
          name: "USD Coin",
          symbol: "USDC",
        },
        amountWei: "2816371",
        amount: "2.816371",
        amountUSDCents: 281.75,
      },
    ],
    processingFees: [
      {
        token: {
          chainId: 137,
          tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
          decimals: 6,
          priceUSDCents: 100,
          name: "USD Coin",
          symbol: "USDC",
        },
        amountWei: "27884",
        amount: "0.027884",
        amountUSDCents: 2.75,
      },
    ],
    client: storyClient,
  };

  const successStatus: BuyWithCryptoStatus = {
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
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
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

  const pendingStatus: BuyWithCryptoStatus = {
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
      completedAt: "2024-06-26T19:46:51.000Z",
    },
    status: "PENDING",
    subStatus: "NONE",
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
  };

  const noneStatus: BuyWithCryptoStatus = {
    ...pendingStatus,
    status: "NONE",
    source: undefined,
  };

  const failedStatus: BuyWithCryptoStatus = {
    ...pendingStatus,
    status: "FAILED",
    subStatus: "REVERTED_ON_CHAIN",
  };

  return {
    meta,
    quote,
    status: {
      pending: pendingStatus,
      success: successStatus,
      failed: failedStatus,
      none: noneStatus,
    },
  };
}

// Buy 30 polygon Matic with Fiat USD ( onramp only )
export function getBuyPolygonWithUSDFiatMocks(options: {
  fromAddress: string;
  toAddress: string;
}): BuyWithFiatMocks {
  const meta: BuyWithFiatMocks["meta"] = {
    label: "Buy 30 Polygon Matic with Fiat USD",
    buyTokenAmount: "30",
    buyToken: { nativeToken: true },
    buyChain: polygon,
    currency: USDCurrency,
  };

  const quote: BuyWithFiatQuote = {
    intentId: "1514f78d-b9ae-40fe-b23c-373793032a9b",
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
    fromCurrency: {
      amount: "18.99",
      amountUnits: "1899.00",
      decimals: 2,
      currencySymbol: "USD",
    },
    fromCurrencyWithFees: {
      amount: "21.52",
      amountUnits: "2152.00",
      decimals: 2,
      currencySymbol: "USD",
    },
    onRampToken: {
      token: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      amountWei: "30008775574897967000",
      amount: "30.008775574897967",
      amountUSDCents: 56,
    },
    toToken: {
      chainId: 137,
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      priceUSDCents: 56,
      name: "MATIC",
      symbol: "MATIC",
    },
    estimatedToAmountMinWei: "30008775574897967000",
    estimatedToAmountMin: "30.008775574897967",
    processingFees: [
      {
        amount: "2.5332071269478",
        amountUnits: "253",
        decimals: 2,
        currencySymbol: "USD",
        feeType: "ON_RAMP",
      },
      {
        amount: "0",
        amountUnits: "0",
        decimals: 2,
        currencySymbol: "USD",
        feeType: "NETWORK",
      },
    ],
    estimatedDurationSeconds: 450,
    maxSlippageBPS: 0,
    onRampLink:
      "https://app.kado.money/?onPayAmount=18.99&onPayCurrency=USD&onRevCurrency=MATIC&cryptoList=MATIC&onToAddress=0x1f846f6dae38e1c88d71eaa191760b15f38b7a37&network=polygon&networkList=polygon&product=BUY&productList=BUY&mode=minimal&sessionId=1514f78d-b9ae-40fe-b23c-373793032a9b&apiKey=25bbee37-ef38-4658-9765-f92e32caacd3",
  };

  const onRampStatusPending: BuyWithFiatStatus = {
    intentId: "fb626d22-92c0-46d5-8e80-6dfb619d022d",
    status: "PENDING_ON_RAMP_TRANSFER",
    toAddress: options.toAddress,
    quote: {
      createdAt: "2024-06-26T21:33:27.284Z",
      estimatedOnRampAmountWei: "30008896738414958000",
      estimatedOnRampAmount: "30.008896738414958",
      estimatedToTokenAmount: "30.008896738414958",
      estimatedToTokenAmountWei: "30008896738414958000",
      fromCurrency: {
        amount: "18.99",
        amountUnits: "1899.00",
        decimals: 2,
        currencySymbol: "USD",
      },
      fromCurrencyWithFees: {
        amount: "21.5232071269478",
        amountUnits: "1899",
        decimals: 2,
        currencySymbol: "USD",
      },
      onRampToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      estimatedDurationSeconds: 30,
    },
  };

  const onrampStatusNone: BuyWithFiatStatus = {
    ...onRampStatusPending,
    status: "NONE",
  };

  const onRampStatusFailed: BuyWithFiatStatus = {
    ...onRampStatusPending,
    status: "ON_RAMP_TRANSFER_FAILED",
  };

  const sucessStatus: BuyWithFiatStatus = {
    intentId: "fb626d22-92c0-46d5-8e80-6dfb619d022d",
    status: "ON_RAMP_TRANSFER_COMPLETED",
    toAddress: options.toAddress,
    quote: {
      createdAt: "2024-06-26T21:33:27.284Z",
      estimatedOnRampAmountWei: "30008896738414958000",
      estimatedOnRampAmount: "30.008896738414958",
      estimatedToTokenAmount: "30.008896738414958",
      estimatedToTokenAmountWei: "30008896738414958000",
      fromCurrency: {
        amount: "18.99",
        amountUnits: "1899.00",
        decimals: 2,
        currencySymbol: "USD",
      },
      fromCurrencyWithFees: {
        amount: "21.5232071269478",
        amountUnits: "1899",
        decimals: 2,
        currencySymbol: "USD",
      },
      onRampToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      estimatedDurationSeconds: 30,
    },
    source: {
      amount: "18.99",
      amountUSDCents: 1899,
      amountWei: "18990000",
      completedAt: "2024-06-26T21:43:27.284Z",
      token: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      transactionHash:
        "0x33a5acf4b0d90cb643d7ac38e64fc786e9c5c3ea61b7d90405c60b635e8dbe6b",
      explorerLink:
        "https://polygonscan.com/tx/0x33a5acf4b0d90cb643d7ac38e64fc786e9c5c3ea61b7d90405c60b635e8dbe6b",
    },
  };

  return {
    meta,
    quote,
    type: "onramponly",
    onrampStatus: {
      none: onRampStatusPending,
      pending: onrampStatusNone,
      success: sucessStatus,
      failed: onRampStatusFailed,
    },
  };
}

// Buy 10 Base USDC via USD fiat ( onramp + swap )
export function getBuyBaseUSDCWithUSDFiatMocks(options: {
  fromAddress: string;
  toAddress: string;
}): BuyWithFiatMocks {
  const meta: BuyWithFiatMocks["meta"] = {
    label: "Buy 10 Base USDC with Fiat USD",
    buyTokenAmount: "10",
    buyToken: usdcBase,
    buyChain: base,
    currency: USDCurrency,
    onRampChain: polygon,
    onRampToken: { nativeToken: true },
  };

  // fiat quote
  const fiatQuote: BuyWithFiatQuote = {
    intentId: "8f6dcb05-489f-4c48-bce3-a5b9f6a173b5",
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
    fromCurrency: {
      amount: "12.89",
      amountUnits: "1289.00",
      decimals: 2,
      currencySymbol: "USD",
    },
    fromCurrencyWithFees: {
      amount: "15.67",
      amountUnits: "1567.00",
      decimals: 2,
      currencySymbol: "USD",
    },
    onRampToken: {
      token: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      amountWei: "19304611684482424000",
      amount: "19.304611684482424",
      amountUSDCents: 56,
    },
    toToken: {
      chainId: 8453,
      tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      decimals: 6,
      priceUSDCents: 100,
      name: "USD Coin",
      symbol: "USDC",
    },
    estimatedToAmountMinWei: "10116989",
    estimatedToAmountMin: "10.116989",
    processingFees: [
      {
        amount: "2.5332071269478",
        amountUnits: "253",
        decimals: 2,
        currencySymbol: "USD",
        feeType: "ON_RAMP",
      },
      {
        amount: "0.25",
        amountUnits: "25",
        decimals: 2,
        currencySymbol: "USD",
        feeType: "NETWORK",
      },
    ],
    estimatedDurationSeconds: 470,
    maxSlippageBPS: 50,
    onRampLink:
      "https://app.kado.money/?onPayAmount=12.89&onPayCurrency=USD&onRevCurrency=MATIC&cryptoList=MATIC&onToAddress=0x1f846f6dae38e1c88d71eaa191760b15f38b7a37&network=polygon&networkList=polygon&product=BUY&productList=BUY&mode=minimal&sessionId=8f6dcb05-489f-4c48-bce3-a5b9f6a173b5&apiKey=25bbee37-ef38-4658-9765-f92e32caacd3",
  };

  const fiatPendingOnRampStatus: BuyWithFiatStatus = {
    intentId: "8f6dcb05-489f-4c48-bce3-a5b9f6a173b5",
    status: "PENDING_ON_RAMP_TRANSFER",
    toAddress: options.toAddress,
    quote: {
      createdAt: "2024-06-27T11:25:46.978Z",
      estimatedOnRampAmountWei: "19304611684482424000",
      estimatedOnRampAmount: "19.304611684482424",
      estimatedToTokenAmount: "10.178058",
      estimatedToTokenAmountWei: "10178058",
      fromCurrency: {
        amount: "12.89",
        amountUnits: "1289.00",
        decimals: 2,
        currencySymbol: "USD",
      },
      fromCurrencyWithFees: {
        amount: "15.673207126947801",
        amountUnits: "1314",
        decimals: 2,
        currencySymbol: "USD",
      },
      onRampToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 8453,
        tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
        priceUSDCents: 100,
        name: "USD Coin",
        symbol: "USDC",
      },
      estimatedDurationSeconds: 20,
    },
  };

  const fiatFailedOnRampStatus: BuyWithFiatStatus = {
    ...fiatPendingOnRampStatus,
    status: "ON_RAMP_TRANSFER_FAILED",
  };

  const fiatStatusNone: BuyWithFiatStatus = {
    ...fiatPendingOnRampStatus,
    status: "NONE",
  };

  const cryptoSwapRequiredStatus: BuyWithFiatStatus = {
    intentId: "8f6dcb05-489f-4c48-bce3-a5b9f6a173b5",
    status: "CRYPTO_SWAP_REQUIRED",
    toAddress: options.toAddress,
    quote: {
      createdAt: "2024-06-27T11:25:46.978Z",
      estimatedOnRampAmountWei: "19304611684482424000",
      estimatedOnRampAmount: "19.304611684482424",
      estimatedToTokenAmount: "10.178058",
      estimatedToTokenAmountWei: "10178058",
      fromCurrency: {
        amount: "12.89",
        amountUnits: "1289.00",
        decimals: 2,
        currencySymbol: "USD",
      },
      fromCurrencyWithFees: {
        amount: "15.673207126947801",
        amountUnits: "1314",
        decimals: 2,
        currencySymbol: "USD",
      },
      onRampToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 8453,
        tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
        priceUSDCents: 100,
        name: "USD Coin",
        symbol: "USDC",
      },
      estimatedDurationSeconds: 20,
    },
    source: {
      transactionHash:
        "0xf2b18a0381b1cac5a176e8cb37e0f819c36a9bc029304cc7ad7e6f59c43e4460",
      token: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 56,
        name: "MATIC",
        symbol: "MATIC",
      },
      amount: "18518167540000",
      amountWei: "18518167540000000000",
      amountUSDCents: 1038,
      completedAt: "2024-06-27T11:32:18.538Z",
      explorerLink:
        "https://polygonscan.com/tx/0xf2b18a0381b1cac5a176e8cb37e0f819c36a9bc029304cc7ad7e6f59c43e4460",
    },
  };

  const postOnRampSwapQuote: BuyWithCryptoQuote = {
    client: storyClient,
    paymentTokens: [
      {
        token: {
          chainId: 137,
          tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          decimals: 18,
          priceUSDCents: 55,
          name: "MATIC",
          symbol: "MATIC",
        },
        amountWei: "470168412733400292",
        amount: "0.470168412733400292",
        amountUSDCents: 26.25,
      },
    ],
    processingFees: [
      {
        token: {
          chainId: 137,
          tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          decimals: 18,
          priceUSDCents: 55,
          name: "MATIC",
          symbol: "MATIC",
        },
        amountWei: "470168412733400292",
        amount: "0.470168412733400292",
        amountUSDCents: 26.25,
      },
    ],
    swapDetails: {
      fromAddress: options.fromAddress,
      toAddress: options.toAddress,
      fromToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 55,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 8453,
        tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
        priceUSDCents: 99,
        name: "USD Coin",
        symbol: "USDC",
      },
      fromAmount: "18.7831434",
      fromAmountWei: "18783143400000000000",
      toAmountMinWei: "10305422",
      toAmountMin: "10.305422",
      toAmountWei: "10367628",
      toAmount: "10.367628",
      estimated: {
        fromAmountUSDCents: 1037.75,
        toAmountMinUSDCents: 1030.5,
        toAmountUSDCents: 1036.75,
        slippageBPS: 1,
        feesUSDCents: 27.75,
        gasCostUSDCents: 1.5,
        durationSeconds: 20,
      },
      maxSlippageBPS: 50,
    },
    transactionRequest: {
      chain: {
        id: 137,
        rpc: "https://137.rpc.thirdweb.com",
      },
      client: storyClient,
      data: "0x883f57440000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000140063c109f02ccb43a9b69971119dcee108000000000000000000000000000000002958832caeb548a8a112a6fdd9c279a500000000000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000104ab2167aa39100000000000000000000000000000000000000000000000000000000000667d4e4d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000ce16f69375520ab01377ce7b88f5ba8c48f8d66600000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000000263c109f02ccb43a9b69971119dcee108000000000000000000000000000000000000000000000000000000003dde4b49dcfd8f14524b8cb439703d024a5c4a1b000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e68623878ad5ceefa790ce00770de86bfb7a3c83000000000000000000000000000000000000000000000000000000000000004600000000000000000000000000000000000000000000000000000000000011a4846a1bc6000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000104ab2167aa39100000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000a600000000000000000000000000000000000000000000000000000000000000aa00000000000000000000000000000000000000000000000000000000000000ae00000000000000000000000000000000000000000000000000000000000000b400000000000000000000000001f846f6dae38e1c88d71eaa191760b15f38b7a370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000000000580000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000104ab2167aa39100000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000004d0e30db00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc4500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000ea749fd6ba492dbc14c24fe8a3d08769229b896c00000000000000000000000000000000000000000000000104ab2167aa3910000000000000000000000000000000000000000000000000000000000000997f7f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000f5b509bb0909a69b1c207e495f687a596c168e1200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f5b509bb0909a69b1c207e495f687a596c168e12000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e4bc6511880000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000750e4c4984a9e0f12978ea6742bc1c5d248f40ed000000000000000000000000ce16f69375520ab01377ce7b88f5ba8c48f8d666000000000000000000000000000000000000000000000000000001905987b84800000000000000000000000000000000000000000000000000000000009e3ed300000000000000000000000000000000000000000000000000000000009d40cc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000761786c555344430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046261736500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a30786365313646363933373535323061623031333737636537423838663542413843343846384436363600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000400000000000000000000000001f846f6dae38e1c88d71eaa191760b15f38b7a3700000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f4052150000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f40521500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000001c452bbbe2900000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000ea749fd6ba492dbc14c24fe8a3d08769229b896c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f846f6dae38e1c88d71eaa191760b15f38b7a37000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009d3f8e000000000000000000000000000000000000000000000000000001905987b6830c659734f1eef9c63b7ebdf78a164cdd745586db0000000000000000000000460000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000000000000000000000000000000000000009e33cc00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041688af47aaaaea27ba8e21d17a6ecd406ec6f85a1cc737719e02f24c51ad74c352bf12450fc9aacbd42c87a029e07afe464bdae1c2abb387ae705f99947813df41c00000000000000000000000000000000000000000000000000000000000000",
      gas: 947200n,

      gasPrice: 30000087685n,
      to: "0x654bb023bc21e69de646b4cf350df20d18f5093a",
      value: 19253311812733400292n,
    },
  };

  const postOnRampSwapPendingStatus: BuyWithCryptoStatus = {
    quote: {
      fromToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 55,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 8453,
        tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
        priceUSDCents: 100,
        name: "USD Coin",
        symbol: "USDC",
      },
      fromAmountWei: "18783143400000000000",
      fromAmount: "18.7831434",
      toAmountWei: "10382250",
      toAmount: "10.38225",
      toAmountMin: "10.319956",
      toAmountMinWei: "10319956",
      estimated: {
        fromAmountUSDCents: 1038,
        toAmountMinUSDCents: 1032,
        toAmountUSDCents: 1038,
        slippageBPS: 3,
        feesUSDCents: 26,
        gasCostUSDCents: 2,
        durationSeconds: 20,
      },
      createdAt: "2024-06-27T11:40:20.783Z",
    },
    swapType: "CROSS_CHAIN",
    source: {
      transactionHash:
        "0x4beaf869890031a1224af678cc5c95efe66c68677d305a1f3b21faf2a9255cb2",
      token: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 55,
        name: "MATIC",
        symbol: "MATIC",
      },
      amount: "18.7831434",
      amountWei: "18783143400000000000",
      amountUSDCents: 1038,
      completedAt: "2024-06-27T11:40:37.000Z",
    },
    status: "PENDING",
    subStatus: "NONE",
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
    bridge: "Axelar",
  };

  const postOnRampSwapNoneStatus: BuyWithCryptoStatus = {
    ...postOnRampSwapPendingStatus,
    status: "NONE",
    source: undefined,
  };

  const postOnRampSwapFailedStatus: BuyWithCryptoStatus = {
    ...postOnRampSwapPendingStatus,
    swapType: "CROSS_CHAIN",
    status: "FAILED",
    subStatus: "REVERTED_ON_CHAIN",
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
    bridge: "Axelar",
  };

  const postOnRampSwapSuccess: BuyWithCryptoStatus = {
    quote: {
      fromToken: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 55,
        name: "MATIC",
        symbol: "MATIC",
      },
      toToken: {
        chainId: 8453,
        tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
        priceUSDCents: 100,
        name: "USD Coin",
        symbol: "USDC",
      },
      fromAmountWei: "18783143400000000000",
      fromAmount: "18.7831434",
      toAmountWei: "10382250",
      toAmount: "10.38225",
      toAmountMin: "10.319956",
      toAmountMinWei: "10319956",
      estimated: {
        fromAmountUSDCents: 1038,
        toAmountMinUSDCents: 1032,
        toAmountUSDCents: 1038,
        slippageBPS: 3,
        feesUSDCents: 26,
        gasCostUSDCents: 2,
        durationSeconds: 20,
      },
      createdAt: "2024-06-27T11:40:20.783Z",
    },
    swapType: "CROSS_CHAIN",
    source: {
      transactionHash:
        "0x4beaf869890031a1224af678cc5c95efe66c68677d305a1f3b21faf2a9255cb2",
      token: {
        chainId: 137,
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        decimals: 18,
        priceUSDCents: 55,
        name: "MATIC",
        symbol: "MATIC",
      },
      amount: "18.7831434",
      amountWei: "18783143400000000000",
      amountUSDCents: 1038,
      completedAt: "2024-06-27T11:40:37.000Z",
    },
    status: "COMPLETED",
    subStatus: "SUCCESS",
    fromAddress: options.fromAddress,
    toAddress: options.toAddress,
    destination: {
      transactionHash:
        "0xf439c2dc3c8611f0f92095880b39afbac4cf0081b9ffb0551cd38bb3183c72cd",
      token: {
        chainId: 8453,
        tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
        priceUSDCents: 100,
        name: "USD Coin",
        symbol: "USDC",
      },
      amount: "10.381911",
      amountWei: "10381911",
      amountUSDCents: 1038,
      completedAt: "2024-06-27T11:41:33.000Z",
    },
    bridge: "Axelar",
  };

  return {
    meta,
    quote: fiatQuote,
    onrampStatus: {
      none: fiatStatusNone,
      pending: fiatPendingOnRampStatus,
      swapRequired: cryptoSwapRequiredStatus,
      failed: fiatFailedOnRampStatus,
    },
    type: "onrampandswap",
    postOnrampSwap: {
      quote: postOnRampSwapQuote,
      status: {
        none: postOnRampSwapNoneStatus,
        pending: postOnRampSwapPendingStatus,
        success: postOnRampSwapSuccess,
        failed: postOnRampSwapFailedStatus,
      },
    },
  };
}

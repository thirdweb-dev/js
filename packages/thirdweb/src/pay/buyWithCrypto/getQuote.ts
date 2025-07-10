import { Value } from "ox";
import * as ox__AbiFunction from "ox/AbiFunction";
import * as Bridge from "../../bridge/index.js";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import { decimals } from "../../extensions/erc20/read/decimals.js";
import type { PrepareTransactionOptions } from "../../transaction/prepare-transaction.js";
import type { PurchaseData } from "../types.js";
import type {
  QuoteApprovalInfo,
  QuotePaymentToken,
  QuoteTokenInfo,
} from "./commonTypes.js";

/**
 * The parameters for [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) function
 * It includes information about which tokens to swap, the amount of tokens to swap, slippage, etc.
 * @buyCrypto
 */
export type GetBuyWithCryptoQuoteParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;

  /**
   * This is only relevant if the buy-with-crypto transaction is part of buy-with-fiat flow.
   *
   * When a swap is required after an onramp transaction, the intentId is used to link the buy-with-crypto transaction to the onramp transaction.
   * Refer to [`getPostOnRampQuote`](https://portal.thirdweb.com/references/typescript/v5/getPostOnRampQuote) for more information.`
   *
   */
  intentId?: string;

  /**
   * The address of wallet that pays for the tokens.
   */
  fromAddress: string;

  /**
   * The address of the wallet where the tokens are sent
   */
  toAddress: string;

  // source token

  /**
   * The chain id of the source token.
   */
  fromChainId: number;

  /**
   * The token address of the source token.
   */
  fromTokenAddress: string;

  // to

  /**
   * The chain id of the destination token.
   */
  toChainId: number;

  /**
   * The token address of the destination token.
   */
  toTokenAddress: string;

  /**
   * Extra details to store with the purchase.
   *
   * This details will be stored with the purchase and can be retrieved later via the status API or Webhook
   */
  purchaseData?: PurchaseData;

  /**
   * The maximum slippage in basis points (bps) allowed for the swap.
   * For example, if you want to allow a maximum slippage of 0.5%, you should specify `50` bps.
   */
  maxSlippageBPS?: number;

  /**
   * @hidden
   */
  paymentLinkId?: string;
} & (
  | {
      /**
       * The amount of source token to be swapped.
       * This is useful if you want to swap a certain amount of source token
       *
       * If you want a certain amount of destination token, you can provide `toAmount` instead of `fromAmount`.
       */
      fromAmount: string;
      toAmount?: never;
    }
  | {
      /**
       * The amount of destination token to be received.
       * This is useful if you want to get a certain amount of destination token.
       *
       * If you want to swap a certain amount of source token, you can provide `fromAmount` instead of `toAmount`.
       */
      toAmount: string;
      fromAmount?: never;
    }
);

/**
 * @buyCrypto
 */
export type BuyWithCryptoQuote = {
  transactionRequest: PrepareTransactionOptions;
  approvalData?: QuoteApprovalInfo;

  swapDetails: {
    fromAddress: string;
    toAddress: string;

    fromToken: QuoteTokenInfo;
    toToken: QuoteTokenInfo;

    fromAmount: string;
    fromAmountWei: string;

    toAmountMinWei: string;
    toAmountMin: string;
    toAmount: string;
    toAmountWei: string;

    estimated: {
      fromAmountUSDCents: number;
      toAmountMinUSDCents: number;
      toAmountUSDCents: number;
      slippageBPS: number;
      feesUSDCents: number;
      gasCostUSDCents?: number;
      durationSeconds?: number;
    };

    maxSlippageBPS: number;
  };

  paymentTokens: QuotePaymentToken[];
  processingFees: QuotePaymentToken[];
  client: ThirdwebClient;
};

/**
 * Get a quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) to buy any given token with crypto.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * Once you have the quote, you can use `prepareTransaction` and prepare the transaction for submission.
 * @param params - object of type [`GetBuyWithCryptoQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithCryptoQuoteParams)
 * @returns Object of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @example
 *
 * ```ts
 * import { getBuyWithCryptoQuote } from "thirdweb/pay";
 *
 * const quote = await getBuyWithCryptoQuote({
 *  client,
 *  fromAddress: "0x...", // wallet address
 *  fromChainId: 137, // chain id of the source token
 *  fromTokenAddress: "0x...", // token address of the source token
 *  fromAmount: "10", // amount of source token to swap
 *  // optionally, you can use `toAmount` instead if you only want a certain amount of destination token
 *  toChainId: 10, // chain id of the destination token
 *  toTokenAddress: "0x...", // token address of the destination token
 *  toAddress: "0x...", // optional: send the tokens to a different address
 *  maxSlippageBPS: 50, // optional: max 0.5% slippage
 * });
 * ```
 * @deprecated
 * @buyCrypto
 */
export async function getBuyWithCryptoQuote(
  params: GetBuyWithCryptoQuoteParams,
): Promise<BuyWithCryptoQuote> {
  try {
    const quote = await (async () => {
      if (params.toAmount) {
        const destinationTokenContract = getContract({
          address: params.toTokenAddress,
          chain: getCachedChain(params.toChainId),
          client: params.client,
        });
        const tokenDecimals =
          destinationTokenContract.address.toLowerCase() ===
          NATIVE_TOKEN_ADDRESS
            ? 18
            : await decimals({
                contract: destinationTokenContract,
              });
        const amount = Value.from(params.toAmount, tokenDecimals);
        return Bridge.Buy.prepare({
          amount: amount,
          client: params.client,
          destinationChainId: params.toChainId,
          destinationTokenAddress: params.toTokenAddress,
          originChainId: params.fromChainId,
          originTokenAddress: params.fromTokenAddress,
          paymentLinkId: params.paymentLinkId,
          purchaseData: params.purchaseData,
          receiver: params.toAddress,
          sender: params.fromAddress,
        });
      } else if (params.fromAmount) {
        const originTokenContract = getContract({
          address: params.fromTokenAddress,
          chain: getCachedChain(params.fromChainId),
          client: params.client,
        });
        const tokenDecimals = await decimals({
          contract: originTokenContract,
        });
        const amount = Value.from(params.fromAmount, tokenDecimals);
        return Bridge.Sell.prepare({
          amount: amount,
          client: params.client,
          destinationChainId: params.toChainId,
          destinationTokenAddress: params.toTokenAddress,
          originChainId: params.fromChainId,
          originTokenAddress: params.fromTokenAddress,
          paymentLinkId: params.paymentLinkId,
          purchaseData: params.purchaseData,
          receiver: params.toAddress,
          sender: params.fromAddress,
        });
      }
      throw new Error(
        "Invalid quote request, must provide either `fromAmount` or `toAmount`",
      );
    })();

    // check if the fromAddress already has approval for the given amount
    const firstStep = quote.steps[0];
    if (!firstStep) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoQuote. Please use Bridge.Buy.prepare instead.",
      );
    }
    const approvalTxs = firstStep.transactions.filter(
      (tx) => tx.action === "approval",
    );
    if (approvalTxs.length > 1) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoQuote. Please use Bridge.Buy.prepare instead.",
      );
    }
    const approvalTx = approvalTxs[0];

    const txs = firstStep.transactions.filter((tx) => tx.action !== "approval");
    if (txs.length > 1) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoQuote. Please use Bridge.Buy.prepare instead.",
      );
    }
    const tx = txs[0];
    if (!tx) {
      throw new Error(
        "This quote is incompatible with getBuyWithCryptoQuote. Please use Bridge.Buy.prepare instead.",
      );
    }

    let approvalData: QuoteApprovalInfo | undefined;
    if (approvalTx) {
      const abiFunction = ox__AbiFunction.from([
        "function approve(address spender, uint256 amount)",
      ]);
      const [spender, amount] = ox__AbiFunction.decodeData(
        abiFunction,
        approvalTx.data,
      );
      approvalData = {
        amountWei: amount.toString(),
        chainId: firstStep.originToken.chainId,
        spenderAddress: spender,
        tokenAddress: firstStep.originToken.address,
      };
    }

    const swapRoute: BuyWithCryptoQuote = {
      approvalData,
      client: params.client,

      paymentTokens: [
        {
          amount: Value.format(
            quote.originAmount,
            firstStep.originToken.decimals,
          ).toString(),
          amountUSDCents:
            Number(
              Value.format(quote.originAmount, firstStep.originToken.decimals),
            ) *
            (firstStep.originToken.prices["USD"] || 0) *
            100,
          amountWei: quote.originAmount.toString(),
          token: {
            chainId: firstStep.originToken.chainId,
            decimals: firstStep.originToken.decimals,
            name: firstStep.originToken.name,
            priceUSDCents: (firstStep.originToken.prices["USD"] || 0) * 100,
            symbol: firstStep.originToken.symbol,
            tokenAddress: firstStep.originToken.address,
          },
        },
      ],
      // TODO (UB): add develope and platform fees in API
      processingFees: [
        {
          amount: "0",
          amountUSDCents: 0,
          amountWei: "0",
          token: {
            chainId: firstStep.originToken.chainId,
            decimals: firstStep.originToken.decimals,
            name: firstStep.originToken.name,
            priceUSDCents: (firstStep.originToken.prices["USD"] || 0) * 100,
            symbol: firstStep.originToken.symbol,
            tokenAddress: firstStep.originToken.address,
          },
        },
      ],
      swapDetails: {
        estimated: {
          durationSeconds: firstStep.estimatedExecutionTimeMs / 1000,
          feesUSDCents: 0,
          fromAmountUSDCents:
            Number(
              Value.format(quote.originAmount, firstStep.originToken.decimals),
            ) *
            (firstStep.originToken.prices["USD"] || 0) *
            100,
          gasCostUSDCents: 0,
          slippageBPS: 0,
          toAmountMinUSDCents:
            Number(
              Value.format(
                quote.destinationAmount,
                firstStep.destinationToken.decimals,
              ),
            ) *
            (firstStep.destinationToken.prices["USD"] || 0) *
            100,
          toAmountUSDCents:
            Number(
              Value.format(
                quote.destinationAmount,
                firstStep.destinationToken.decimals,
              ),
            ) *
            (firstStep.destinationToken.prices["USD"] || 0) *
            100,
        },
        fromAddress: quote.intent.sender,

        fromAmount: Value.format(
          quote.originAmount,
          firstStep.originToken.decimals,
        ).toString(),
        fromAmountWei: quote.originAmount.toString(),

        fromToken: {
          chainId: firstStep.originToken.chainId,
          decimals: firstStep.originToken.decimals,
          name: firstStep.originToken.name,
          priceUSDCents: (firstStep.originToken.prices["USD"] || 0) * 100,
          symbol: firstStep.originToken.symbol,
          tokenAddress: firstStep.originToken.address,
        },

        maxSlippageBPS: 0,
        toAddress: quote.intent.receiver,
        toAmount: Value.format(
          quote.destinationAmount,
          firstStep.destinationToken.decimals,
        ).toString(),
        toAmountMin: Value.format(
          quote.destinationAmount,
          firstStep.destinationToken.decimals,
        ).toString(),

        toAmountMinWei: quote.destinationAmount.toString(),

        toAmountWei: quote.destinationAmount.toString(),
        toToken: {
          chainId: firstStep.destinationToken.chainId,
          decimals: firstStep.destinationToken.decimals,
          name: firstStep.destinationToken.name,
          priceUSDCents: (firstStep.destinationToken.prices["USD"] || 0) * 100,
          symbol: firstStep.destinationToken.symbol,
          tokenAddress: firstStep.destinationToken.address,
        },
      },
      transactionRequest: {
        ...tx,
        extraGas: 50000n, // extra gas buffer
      },
    };

    return swapRoute;
  } catch (error) {
    console.error("Error getting buy with crypto quote", error);
    throw error;
  }
}

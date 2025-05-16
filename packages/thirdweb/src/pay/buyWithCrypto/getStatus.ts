import { type Status, status as bridgeStatus } from "../../bridge/index.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../utils/commonTypes.js";

// TODO: add JSDoc description for all properties

/**
 * @buyCrypto
 */
type BuyWithCryptoQuoteSummary = {
  fromToken: PayTokenInfo;
  toToken: PayTokenInfo;

  fromAmountWei: string;
  fromAmount: string;

  toAmountWei: string;
  toAmount: string;

  toAmountMin: string;
  toAmountMinWei: string;

  estimated: {
    fromAmountUSDCents: number;
    toAmountMinUSDCents: number;
    toAmountUSDCents: number;
    slippageBPS: number;
    feesUSDCents: number;
    gasCostUSDCents?: number;
    durationSeconds?: number;
  }; // SAME AS QUOTE

  createdAt: string; // ISO DATE
};

/**
 * @buyCrypto
 */
export type BuyWithCryptoTransaction = {
  client: ThirdwebClient;
  transactionHash: string;
  chainId: number; // optional for backwards compatibility
};

type BuyWithCryptoStatuses = "NONE" | "PENDING" | "FAILED" | "COMPLETED";

type BuyWithCryptoSubStatuses =
  | "NONE"
  | "WAITING_BRIDGE"
  | "REVERTED_ON_CHAIN"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "UNKNOWN_ERROR"
  | "REFUNDED";

type SwapType = "SAME_CHAIN" | "CROSS_CHAIN" | "TRANSFER";

/**
 * The object returned by the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoStatus) function to represent the status of a quoted transaction
 * @buyCrypto
 */
export type BuyWithCryptoStatus =
  | {
      status: "NOT_FOUND";
    }
  | {
      quote: BuyWithCryptoQuoteSummary;
      swapType: SwapType;
      source?: PayOnChainTransactionDetails;
      destination?: PayOnChainTransactionDetails;
      status: BuyWithCryptoStatuses;
      subStatus: BuyWithCryptoSubStatuses;
      fromAddress: string;
      toAddress: string;
      failureMessage?: string;
      bridge?: string;
      purchaseData?: object;
    };

export type ValidBuyWithCryptoStatus = Exclude<
  BuyWithCryptoStatus,
  { status: "NOT_FOUND" }
>;

/**
 * Gets the status of a buy with crypto transaction
 * @param buyWithCryptoTransaction - Object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @example
 *
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { getBuyWithCryptoStatus, getBuyWithCryptoQuote } from "thirdweb/pay";
 *
 * // get a quote between two tokens
 * const quote = await getBuyWithCryptoQuote(quoteParams);
 *
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *  const txResult = await sendTransaction({
 *    transaction: quote.approval,
 *    account: account, // account from connected wallet
 *  });
 *
 *  await waitForReceipt(txResult);
 * }
 *
 * // send the quoted transaction
 * const swapTxResult = await sendTransaction({
 *    transaction: quote.transactionRequest,
 *    account: account, // account from connected wallet
 *  });
 *
 * await waitForReceipt(swapTxResult);
 *
 * // keep polling the status of the quoted transaction until it returns a success or failure status
 * const status = await getBuyWithCryptoStatus({
 *    client,
 *    transactionHash: swapTxResult.transactionHash,
 * }});
 * ```
 * @returns Object of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @deprecated use Bridge.status instead
 * @buyCrypto
 */
export async function getBuyWithCryptoStatus(
  buyWithCryptoTransaction: BuyWithCryptoTransaction,
): Promise<BuyWithCryptoStatus> {
  try {
    if (!buyWithCryptoTransaction.transactionHash) {
      throw new Error("Transaction hash is required");
    }
    const result = await bridgeStatus({
      transactionHash: buyWithCryptoTransaction.transactionHash as Hex,
      chainId: buyWithCryptoTransaction.chainId,
      client: buyWithCryptoTransaction.client,
    });

    switch (result.status) {
      case "COMPLETED": {
        const originTransaction = result.transactions?.find(
          (tx) => tx.chainId === buyWithCryptoTransaction.chainId,
        );
        const destinationTransaction = result.transactions?.find(
          (tx) => tx.chainId !== buyWithCryptoTransaction.chainId,
        );

        return toBuyWithCryptoStatus({
          originTransaction,
          destinationTransaction,
          originAmount: result.originAmount,
          destinationAmount: result.destinationAmount,
          originTokenAddress: result.originTokenAddress,
          destinationTokenAddress: result.destinationTokenAddress,
          originChainId: result.originChainId,
          destinationChainId: result.destinationChainId,
          status: result.status,
          purchaseData: result.purchaseData as object | undefined,
        });
      }
      case "PENDING": {
        return toBuyWithCryptoStatus({
          originAmount: result.originAmount,
          originTokenAddress: result.originTokenAddress,
          destinationTokenAddress: result.destinationTokenAddress,
          originChainId: result.originChainId,
          destinationChainId: result.destinationChainId,
          status: result.status,
        });
      }
      case "FAILED": {
        const originTransaction = result.transactions?.find(
          (tx) => tx.chainId === buyWithCryptoTransaction.chainId,
        );
        const destinationTransaction = result.transactions?.find(
          (tx) => tx.chainId !== buyWithCryptoTransaction.chainId,
        );
        return toBuyWithCryptoStatus({
          originTransaction,
          destinationTransaction,
          originAmount: BigInt(0), // TODO: get from API
          destinationAmount: BigInt(0), // TODO: get from API
          originTokenAddress: "", // TODO: get from API
          destinationTokenAddress: "", // TODO: get from API
          originChainId: 0, // TODO: get from API
          destinationChainId: 0, // TODO: get from API
          status: result.status,
        });
      }
      default: {
        return {
          status: "NOT_FOUND",
        };
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(`Fetch failed: ${error}`);
  }
}

function toBuyWithCryptoStatus(args: {
  originTransaction?: Status["transactions"][number];
  destinationTransaction?: Status["transactions"][number];
  originAmount: bigint;
  originTokenAddress: string;
  destinationAmount?: bigint;
  destinationTokenAddress: string;
  originChainId: number;
  destinationChainId: number;
  status: Status["status"];
  purchaseData?: object;
}): BuyWithCryptoStatus {
  const {
    originTransaction,
    destinationTransaction,
    status,
    purchaseData,
    originAmount,
    destinationAmount,
    originTokenAddress,
    destinationTokenAddress,
    originChainId,
    destinationChainId,
  } = args;
  return {
    fromAddress: "", // TODO: get from API
    toAddress: "",
    quote: {
      createdAt: new Date().toISOString(),
      estimated: {
        fromAmountUSDCents: 0,
        toAmountMinUSDCents: 0,
        toAmountUSDCents: 0,
        slippageBPS: 0,
        feesUSDCents: 0,
        gasCostUSDCents: 0,
        durationSeconds: 0,
      },
      fromAmount: originAmount.toString(), // TODO: get from API
      fromAmountWei: originAmount.toString(),
      toAmount: destinationAmount?.toString() ?? "", // TODO: get from API
      toAmountWei: destinationAmount?.toString() ?? "",
      toAmountMin: destinationAmount?.toString() ?? "", // TODO: get from API
      toAmountMinWei: destinationAmount?.toString() ?? "",
      fromToken: {
        tokenAddress: originTokenAddress,
        chainId: originChainId,
        decimals: 18,
        name: "",
        symbol: "",
        priceUSDCents: 0,
      },
      toToken: {
        tokenAddress: destinationTokenAddress,
        chainId: destinationChainId,
        decimals: 18,
        name: "",
        symbol: "",
        priceUSDCents: 0,
      },
    },
    swapType:
      originTransaction?.chainId === destinationTransaction?.chainId
        ? "SAME_CHAIN"
        : "CROSS_CHAIN", // TODO transfer type?
    status: status,
    subStatus: status === "COMPLETED" ? "SUCCESS" : "NONE",
    purchaseData: purchaseData as object | undefined,
    bridge: "STARPORT",
    destination: {
      amount: destinationAmount?.toString() ?? "",
      amountWei: destinationAmount?.toString() ?? "",
      token: {
        tokenAddress: destinationTokenAddress,
        chainId: destinationChainId,
        decimals: 18,
        name: "",
        symbol: "",
        priceUSDCents: 0,
      },
      amountUSDCents: 0,
      completedAt: new Date().toISOString(),
      explorerLink: "",
      transactionHash: destinationTransaction?.transactionHash ?? "",
    },
    source: {
      amount: originAmount.toString(),
      amountWei: originAmount.toString(),
      token: {
        tokenAddress: originTokenAddress,
        chainId: originChainId,
        decimals: 18,
        name: "",
        symbol: "",
        priceUSDCents: 0,
      },
      amountUSDCents: 0,
      completedAt: new Date().toISOString(),
      explorerLink: "",
      transactionHash: originTransaction?.transactionHash ?? "",
    },
  };
}

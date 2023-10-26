import type { PaperSDKError } from "../interfaces/PaperSDKError";
import { PayWithCryptoErrorCode } from "../interfaces/PaperSDKError";

export interface IErrorObject {
  isErrorObject: boolean;
  title: PayWithCryptoErrorCode;
  description: string;
}

export const handlePayWithCryptoError = async (
  error: Error | IErrorObject,
  onError?: (code: PaperSDKError) => Promise<void> | void,
  postToParent?: (errorObject: Omit<IErrorObject, "isErrorObject">) => void,
) => {
  if ("isErrorObject" in error) {
    if (onError) {
      await onError({ code: error.title, error: new Error(error.title) });
    }
    if (postToParent) {
      postToParent({ ...error });
    }
  } else if (!("message" in error)) {
    if (onError) {
      await onError({
        code: PayWithCryptoErrorCode.ErrorSendingTransaction,
        error: new Error(JSON.stringify(error)),
      });
    }
    if (postToParent) {
      postToParent({
        description: `${error}`,
        title: PayWithCryptoErrorCode.ErrorSendingTransaction,
      });
    }
  } else {
    if (
      error.message.includes("rejected") ||
      error.message.includes("denied transaction")
    ) {
      if (onError) {
        await onError({
          code: PayWithCryptoErrorCode.TransactionCancelled,
          error,
        });
      }
      if (postToParent) {
        postToParent({
          description: "",
          title: PayWithCryptoErrorCode.TransactionCancelled,
        });
      }
    } else if (error.message.includes("insufficient funds")) {
      if (onError) {
        await onError({
          code: PayWithCryptoErrorCode.InsufficientBalance,
          error,
        });
      }
      if (postToParent) {
        postToParent({
          description:
            "Check your wallet's ETH balance to make sure you have enough!",
          title: PayWithCryptoErrorCode.InsufficientBalance,
        });
      }
    } else if (error.message.includes("Error switching chain")) {
      if (onError) {
        await onError({
          code: PayWithCryptoErrorCode.ChainSwitchUnderway,
          error,
        });
      }
      if (postToParent) {
        postToParent({
          description: "Check your wallet app",
          title: PayWithCryptoErrorCode.ChainSwitchUnderway,
        });
      }
    } else {
      if (onError) {
        await onError({
          code: PayWithCryptoErrorCode.ErrorSendingTransaction,
          error,
        });
      }
      if (postToParent) {
        postToParent({
          description: `${error.message}`,
          title: PayWithCryptoErrorCode.ErrorSendingTransaction,
        });
      }
    }
  }
};

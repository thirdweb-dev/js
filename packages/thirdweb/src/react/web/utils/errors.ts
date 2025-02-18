type ApiError = {
  code: string;
  message?: string;
  data?: {
    minimumAmountUSDCents?: string;
    requestedAmountUSDCents?: string;
    minimumAmountWei?: string;
    minimumAmountEth?: string;
  };
};

export const defaultMessage = "Unable to get price quote";
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getErrorMessage(err: any): ApiError {
  if (typeof err.error === "object" && err.error.code) {
    if (err.error.code === "MINIMUM_PURCHASE_AMOUNT") {
      return {
        code: "MINIMUM_PURCHASE_AMOUNT",
        message: "Purchase amount is too low",
      };
    }
  }
  return {
    code: "UNABLE_TO_GET_PRICE_QUOTE",
    message: defaultMessage,
  };
}

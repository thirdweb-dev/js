type ApiError = {
  code: string;
  title: string;
  message: string;
  data?: {
    minimumAmountUSDCents?: string;
    requestedAmountUSDCents?: string;
    minimumAmountWei?: string;
    minimumAmountEth?: string;
  };
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getErrorMessage(err: any): ApiError {
  if (typeof err.error === "object" && err.error.code) {
    if (err.error.code === "MINIMUM_PURCHASE_AMOUNT") {
      return {
        code: "MINIMUM_PURCHASE_AMOUNT",
        title: "Amount Too Low",
        message:
          "The requested amount is less than the minimum purchase. Try another provider or amount.",
      };
    }
  }

  console.error(err);

  return {
    code: "UNABLE_TO_GET_PRICE_QUOTE",
    title: "Failed to Find Quote",
    message:
      "We couldn't get a quote for this token pair. Select another token or pay with card.",
  };
}

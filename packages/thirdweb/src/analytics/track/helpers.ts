/**
 * @internal
 */
export function isInsufficientFundsError(error: Error | unknown): boolean {
  if (!error) return false;

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as Error)?.message ||
        (error as { data?: { message?: string } })?.data?.message ||
        "";

  const message = errorMessage.toLowerCase();

  // Common patterns for insufficient funds errors
  return (
    message.includes("insufficient funds") ||
    message.includes("insufficient balance") ||
    (message.includes("insufficient") &&
      (message.includes("native") || message.includes("gas"))) ||
    // Common error codes from various wallets/providers
    (error as { code?: string | number })?.code === "INSUFFICIENT_FUNDS" ||
    (error as { reason?: string })?.reason === "insufficient funds"
  );
}

/**
 * @internal
 */
export function getErrorDetails(error: Error | unknown): {
  message: string;
  code?: string | number;
} {
  if (!error) return { message: "Unknown error" };

  const message =
    typeof error === "string"
      ? error
      : (error as Error)?.message ||
        (error as { data?: { message?: string } })?.data?.message ||
        String(error);

  const code =
    (error as { code?: string | number })?.code ||
    (error as { reason?: string })?.reason;

  return { code, message };
}

/**
 * An error that is thrown when an error occurs in the EmbeddedWallet
 */
export class EmbeddedWalletError extends Error {
  /**
   * Create a new EmbeddedWalletError
   * @param message - The error message
   * @example
   * ```ts
   * throw new EmbeddedWalletError("This is an error message");
   * ```
   */
  constructor(message: string) {
    super(message);
    this.name = "EmbeddedWalletError";
  }
}

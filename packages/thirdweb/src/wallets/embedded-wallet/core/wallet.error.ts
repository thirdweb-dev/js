export class EmbeddedWalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmbeddedWalletError";
  }
}

export interface GenericSignerWallet {
  getAddress(): Promise<string>;
  signMessage(message: string): Promise<string>;
  verifySignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean>;
}

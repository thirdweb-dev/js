export interface GenericSigner {
  signMessage(message: string): Promise<string>;
  verifySignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean>;
}

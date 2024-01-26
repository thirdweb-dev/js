/**
 * @internal
 */
export type Ecosystem = "evm";
export interface GenericAuthWallet {
  type: Ecosystem;
  getAddress(): Promise<string>;
  getChainId?(): Promise<number>;
  signMessage(message: string): Promise<string>;
  verifySignature(
    message: string,
    signature: string,
    address: string,
    chainId?: number,
  ): Promise<boolean>;
}

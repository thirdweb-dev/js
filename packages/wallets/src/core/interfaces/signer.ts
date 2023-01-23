export type Ecosystem = "solana" | "evm";
export interface GenericSignerWallet {
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

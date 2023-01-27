import { PublicKey } from "@solana/web3.js";

export interface SolanaSigner {
  publicKey: PublicKey;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

export interface SolanaWallet {
  getSigner(): Promise<SolanaSigner>;
}

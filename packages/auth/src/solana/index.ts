import * as ed25519 from "@noble/ed25519";
import { Signer, Keypair } from "@solana/web3.js";
import type { Ecosystem, GenericSignerWallet } from "@thirdweb-dev/wallets";
import bs58 from "bs58";
import nacl from "tweetnacl";

export class SignerWallet implements GenericSignerWallet {
  type: Ecosystem = "solana";
  #signer: Signer;

  constructor(signer: Signer) {
    this.#signer = signer;
  }

  public async getAddress(): Promise<string> {
    return this.#signer.publicKey.toBase58();
  }

  public async signMessage(message: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await ed25519.sync.sign(
      encodedMessage,
      this.#signer.secretKey.slice(0, 32),
    );
    const signature = bs58.encode(signedMessage);

    return signature;
  }

  public async verifySignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean> {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(address),
    );
  }
}

export class PrivateKeyWallet extends SignerWallet {
  constructor(privateKey: string) {
    super(Keypair.fromSecretKey(bs58.decode(privateKey)));
  }
}

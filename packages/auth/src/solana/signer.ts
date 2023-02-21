import * as ed25519 from "@noble/ed25519";
import { Signer, Keypair, PublicKey } from "@solana/web3.js";
import type { Ecosystem, GenericAuthWallet } from "@thirdweb-dev/wallets";
import bs58 from "bs58";
import nacl from "tweetnacl";

export interface SolanaSigner {
  publicKey: PublicKey;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

export class SignerWallet implements GenericAuthWallet {
  type: Ecosystem = "solana";
  private signer: SolanaSigner;

  constructor(signer: SolanaSigner) {
    this.signer = signer;
  }

  public async getAddress(): Promise<string> {
    return this.signer.publicKey.toBase58();
  }

  public async signMessage(message: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await this.signer.signMessage(encodedMessage);
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

class KeypairSigner implements SolanaSigner {
  private keypair: Signer;
  public publicKey: PublicKey;

  constructor(keypair: Signer) {
    this.keypair = keypair;
    this.publicKey = keypair.publicKey;
  }

  public async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return ed25519.sync.sign(message, this.keypair.secretKey.slice(0, 32));
  }
}

export class KeypairWallet extends SignerWallet {
  constructor(keypair: Keypair) {
    super(new KeypairSigner(keypair));
  }
}

export class PrivateKeyWallet extends KeypairWallet {
  constructor(privateKey: string) {
    super(Keypair.fromSecretKey(bs58.decode(privateKey)));
  }
}

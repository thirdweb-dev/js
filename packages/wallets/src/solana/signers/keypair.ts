import { SolanaSigner } from "../interfaces";
import * as ed25519 from "@noble/ed25519";
import { Keypair, PublicKey } from "@solana/web3.js";

export class KeypairSigner implements SolanaSigner {
  #keypair: Keypair;
  public publicKey: PublicKey;

  constructor(keypair: Keypair) {
    this.#keypair = keypair;
    this.publicKey = keypair.publicKey;
  }

  public async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return ed25519.sign(message, this.#keypair.secretKey.slice(0, 32));
  }
}

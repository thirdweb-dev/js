import { SolanaWallet, SolanaSigner } from "../interfaces";
import { KeypairSigner } from "../signers/keypair";
import { AbstractSigner } from "./base";
import { Keypair } from "@solana/web3.js";

export class KeypairWallet extends AbstractSigner implements SolanaWallet {
  constructor(keypair: Keypair) {
    super();
    this.signer = new KeypairSigner(keypair);
  }

  public async getSigner(): Promise<SolanaSigner> {
    return this.signer as KeypairSigner;
  }
}

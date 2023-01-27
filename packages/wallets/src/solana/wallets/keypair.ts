import { SolanaSigner } from "../interfaces";
import { KeypairSigner } from "../signers/keypair";
import { AbstractWallet } from "./base";
import { Keypair } from "@solana/web3.js";

export class KeypairWallet extends AbstractWallet {
  constructor(keypair: Keypair) {
    super();
    this.signer = new KeypairSigner(keypair);
  }

  public async getSigner(): Promise<SolanaSigner> {
    return this.signer as KeypairSigner;
  }
}

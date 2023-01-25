import { SolanaSigner, SolanaWallet } from "../interfaces";
import { AbstractSigner } from "./base";

export class SignerWallet extends AbstractSigner implements SolanaWallet {
  constructor(signer: SolanaSigner) {
    super();
    this.signer = signer;
  }

  public async getSigner(): Promise<SolanaSigner> {
    return this.signer as SolanaSigner;
  }
}

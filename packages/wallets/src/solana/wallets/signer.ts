import { MinimalWallet } from "../interfaces/minimal";
import { SolanaSigner } from "../interfaces/signer";
import { AbstractSigner } from "./base";

export class SignerWallet extends AbstractSigner implements MinimalWallet {
  constructor(signer: SolanaSigner) {
    super();
    this.signer = signer;
  }

  public async getSigner(): Promise<SolanaSigner> {
    return this.signer as SolanaSigner;
  }
}

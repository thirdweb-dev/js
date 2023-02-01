import { SolanaSigner } from "../interfaces";
import { AbstractWallet } from "./base";

export class SignerWallet extends AbstractWallet {
  constructor(signer: SolanaSigner) {
    super();
    this.signer = signer;
  }

  public async getSigner(): Promise<SolanaSigner> {
    return this.signer as SolanaSigner;
  }
}

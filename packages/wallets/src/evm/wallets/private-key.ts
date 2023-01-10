import { AbstractSigner } from "./abstract";
import { ethers } from "ethers";

export class PrivateKeyWallet extends AbstractSigner {
  #privateKey: string;

  constructor(privateKey: string) {
    super();
    this.#privateKey = privateKey;
  }

  async getSigner(): Promise<ethers.Signer> {
    return new ethers.Wallet(this.#privateKey);
  }
}

import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";

export class PrivateKeyWallet extends AbstractWallet {
  #privateKey: string;

  constructor(privateKey: string) {
    super();
    this.#privateKey = privateKey;
  }

  async getSigner(): Promise<ethers.Signer> {
    return new ethers.Wallet(this.#privateKey);
  }
}

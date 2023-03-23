import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";

export class PrivateKeyWallet extends AbstractWallet {
  #signer: ethers.Signer;
  constructor(privateKey: string) {
    super();
    this.#signer = new ethers.Wallet(privateKey);
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.#signer;
  }
}

import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";

export class EthersWallet extends AbstractWallet {
  #signer: ethers.Signer;
  constructor(signer: ethers.Signer) {
    super({ apiKey: undefined });
    this.#signer = signer;
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.#signer;
  }
}

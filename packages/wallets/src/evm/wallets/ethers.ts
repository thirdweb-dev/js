import { AbstractSigner } from "./abstract";
import { ethers } from "ethers";

export class EthersWallet extends AbstractSigner {
  constructor(signer: ethers.Signer) {
    super();
    this.signer = signer;
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.signer as ethers.Signer;
  }
}

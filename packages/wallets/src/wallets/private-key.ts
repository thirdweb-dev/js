import { MinimalWallet } from "../types/minimal";
import { ethers } from "ethers";

export class PrivateKeyWallet implements MinimalWallet {
  #privateKey: string;

  constructor(privateKey: string) {
    this.#privateKey = privateKey;
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    return new ethers.Wallet(this.#privateKey, provider);
  }
}

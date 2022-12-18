import { MinimalWallet } from "../interfaces/minimal";
import { AbstractSigner } from "./base";
import { ethers } from "ethers";

export class PrivateKeyWallet extends AbstractSigner implements MinimalWallet {
  #privateKey: string;

  constructor(privateKey: string) {
    super();
    this.#privateKey = privateKey;
  }

  async getSigner(): Promise<ethers.Signer> {
    return new ethers.Wallet(this.#privateKey);
  }
}

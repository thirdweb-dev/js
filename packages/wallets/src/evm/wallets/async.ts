import { Signer } from "ethers";
import { AbstractWallet } from "./abstract";

export interface AsyncWalletOptions {
  getSigner: () => Promise<Signer>;
  cacheSigner: boolean;
}

export class AsyncWallet extends AbstractWallet {
  #signer?: Signer;
  #options: AsyncWalletOptions;

  constructor(options: AsyncWalletOptions) {
    super();
    this.#options = options;
  }

  async getSigner(): Promise<Signer> {
    if (!this.#signer || !this.#options.cacheSigner) {
      this.#signer = await this.#options.getSigner();
    }

    return this.#signer;
  }
}

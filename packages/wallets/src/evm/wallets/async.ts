import { Signer } from "ethers";
import { AbstractWallet } from "./abstract";

export interface AsyncWalletOptions {
  getSigner: () => Promise<Signer>;
  cacheSigner: boolean;
}

/**
 * @internal
 */
export class AsyncWallet extends AbstractWallet {
  private _signer?: Signer;
  private _options: AsyncWalletOptions;

  constructor(options: AsyncWalletOptions) {
    super();
    this._options = options;
  }

  async getSigner(): Promise<Signer> {
    if (!this._signer || !this._options.cacheSigner) {
      this._signer = await this._options.getSigner();
    }

    return this._signer;
  }
}

import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";

/**
 * Wallet interface to connect using [ethers.js](https://github.com/ethers-io/ethers.js/) signer
 *
 * @example
 * ```javascript
 * import { EthersWallet } from "@thirdweb-dev/wallets";
 * import { Wallet } from "ethers";
 *
 * // can be any ethers.js signer
 * const signer = Wallet.createRandom();
 * const wallet = new EthersWallet(signer);
 *
 * await wallet.connect();
 * ```
 *
 * @wallet
 */
export class EthersWallet extends AbstractWallet {
  private _signer: ethers.Signer;

  /**
   * Create instance of `EthersWallet`
   * @param signer - ethers.js signer object
   */
  constructor(signer: ethers.Signer) {
    super();
    this._signer = signer;
  }

  /**
   * Returns [ethers signer](https://docs.ethers.org/v5/api/signer/) object used by the wallet
   */
  async getSigner(): Promise<ethers.Signer> {
    return this._signer;
  }
}

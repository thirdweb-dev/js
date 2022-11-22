import { AbstractWallet } from "../types/abstract";
import { ethers } from "ethers";

export type AsyncWalletOptions = {
  getPrivateKey: () => Promise<string>;
};

/**
 * Create an async wallet that can be used to sign transactions with a
 * private key getter function.
 *
 * @example
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk"
 * import { AsyncWallet } from "@thirdweb-dev/sdk/evm/wallets"
 *
 * const wallet = new AsyncWallet({
 *   getPrivateKey: async () => {
 *     // Get the private key of your wallet however you want to
 *     const privateKey = await getPrivateKeyFromSomewhere();
 *     return privateKey;
 *   }
 * });
 * const sdk = await ThirdwebSDK.fromWallet(wallet, "mainnet");
 * ```
 */
export class AsyncWallet extends AbstractWallet {
  private getPrivateKey: () => Promise<string>;

  constructor(options: AsyncWalletOptions) {
    super();
    this.getPrivateKey = options.getPrivateKey;
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    const privateKey = await this.getPrivateKey();
    return new ethers.Wallet(privateKey, provider);
  }
}

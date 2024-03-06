import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";
import { ChainOrRpcUrl, getChainProvider } from "@thirdweb-dev/sdk";

/**
 * Wallet interface to connect using a Private Key
 *
 * @example
 * ```ts
 * import { PrivateKeyWallet } from "@thirdweb-dev/wallets";
 *
 * // can be any ethers.js signer
 * const privateKey = process.env.PRIVATE_KEY;
 * const wallet = new PrivateKeyWallet(privateKey);
 * ```
 *
 * @wallet
 */
export class PrivateKeyWallet extends AbstractWallet {
  private _signer: ethers.Signer;

  /**
   * Create instance of `PrivateKeyWallet`
   *
   * @param privateKey - The private key to use for signing transactions.
   *
   * @param chain - The chain or rpc url to connect to when querying the blockchain directly through this wallet.
   *
   * @param secretKey -
   * Provide `secretKey` to use the thirdweb RPCs for given `chain`
   *
   * You can create a secret key from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   */
  constructor(privateKey: string, chain?: ChainOrRpcUrl, secretKey?: string) {
    super();

    this._signer = new ethers.Wallet(
      privateKey,
      chain
        ? getChainProvider(chain, {
            secretKey,
          })
        : undefined,
    );
  }

  /**
   * Get the [ethers.js signer](https://docs.ethers.io/v5/api/signer/) object used by the wallet
   */
  async getSigner(): Promise<ethers.Signer> {
    return this._signer;
  }
}

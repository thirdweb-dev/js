import { AbstractWallet } from "./abstract";
import type { Signer } from "ethers";
import type { AwsKmsSignerCredentials } from "ethers-aws-kms-signer";

/**
 * Create a wallet instance using a private key stored in AWS KMS.
 *
 *  @example
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/internal/wallets"
 * import { AwsKmsWallet } from "@thirdweb-dev/sdk/evm/wallets"
 *
 * const wallet = new AwsKmsWallet({
 *   region: "us-east-1",
 *   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   sessionToken: process.env.AWS_SESSION_TOKEN,
 *   keyId: process.env.AWS_KEY_ID,
 * });
 *
 * const sdk = await ThirdwebSDK.fromWallet(wallet, "mainnet");
 * ```
 */
export class AwsKmsWallet extends AbstractWallet {
  #signer?: Promise<Signer>;
  #options: AwsKmsSignerCredentials;
  constructor(options: AwsKmsSignerCredentials) {
    super();
    this.#options = options;
  }

  async getSigner(): Promise<Signer> {
    if (!this.#signer) {
      this.#signer = new Promise(async (resolve, reject) => {
        try {
          const { AwsKmsSigner } = await import("ethers-aws-kms-signer");
          resolve(new AwsKmsSigner(this.#options));
        } catch (err) {
          // remove the cached promise so we can try again
          this.#signer = undefined;
          reject(err);
        }
      });
    }
    return this.#signer;
  }
}

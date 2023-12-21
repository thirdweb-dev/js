import { AbstractWallet } from "./abstract";
import type { Signer } from "ethers";
import type { AwsKmsSignerCredentials } from "ethers-aws-kms-signer";

/**
 * Connect to a custodial wallet with a signing key in [AWS Key Management Service](https://aws.amazon.com/kms/).
 *
 * In order to instantiate an AWS KMS wallet, you need to get the relevant credentials for the AWS KMS key that you want to use.
 *
 * @example
 * ```js
 * import { AwsKmsWallet } from "@thirdweb-dev/wallets/evm/wallets/aws-kms";
 *
 * const wallet = new AwsKmsWallet({
 *   region: "us-east-1",
 *   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   sessionToken: process.env.AWS_SESSION_TOKEN,
 *   keyId: process.env.AWS_KEY_ID,
 * });
 * ```
 *
 * @wallet
 */
export class AwsKmsWallet extends AbstractWallet {
  #signer?: Promise<Signer>;
  #options: AwsKmsSignerCredentials;
  constructor(options: AwsKmsSignerCredentials) {
    super();
    this.#options = options;
  }

  /**
   * Get [ethers signer](https://docs.ethers.io/v5/api/signer/) of the connected wallet
   */
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

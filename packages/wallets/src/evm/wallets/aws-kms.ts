import { AbstractWallet } from "./abstract";
import { ethers, TypedDataDomain, type Signer, TypedDataField } from "ethers";
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
  private _signer?: Promise<Signer>;
  private _options: AwsKmsSignerCredentials;

  /**
   * Create instance of `AwsKmsWallet`
   * @param options -
   * The `options` object of type `AwsKmsSignerCredentials` from `ethers-aws-kms-signer` package
   */
  constructor(options: AwsKmsSignerCredentials) {
    super();
    this._options = options;
  }

  /**
   * Get [ethers signer](https://docs.ethers.io/v5/api/signer/) of the connected wallet
   */
  async getSigner(): Promise<Signer> {
    if (!this._signer) {
      this._signer = new Promise(async (resolve, reject) => {
        try {
          const { AwsKmsSigner } = await import("ethers-aws-kms-signer");
          const signer = new AwsKmsSigner(this._options);

          // Need to add this because ethers-aws-kms-signer doesn't support
          (signer as any)._signTypedData = async function (
            domain: TypedDataDomain,
            types: Record<string, Array<TypedDataField>>,
            value: Record<string, any>,
          ) {
            const hash = ethers.utils._TypedDataEncoder.hash(
              domain,
              types,
              value,
            );
            return signer._signDigest(hash);
          };

          resolve(signer);
        } catch (err) {
          // remove the cached promise so we can try again
          this._signer = undefined;
          reject(err);
        }
      });
    }
    return this._signer;
  }
}

import { AbstractWallet } from "../types/abstract";
import { ethers } from "ethers";
import { AwsKmsSigner, AwsKmsSignerCredentials } from "ethers-aws-kms-signer";

/**
 * Create a wallet instance using a private key stored in AWS KMS.
 *
 *  @example
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk"
 * import { AwsKmsWallet } from "@thirdweb-dev/sdk/evm/wallets"
 *
 * const wallet = new AwsKmsallet({
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
  private cachedSigner: AwsKmsSigner;

  constructor(options: AwsKmsSignerCredentials) {
    super();
    this.cachedSigner = new AwsKmsSigner(options);
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    if (provider) {
      this.cachedSigner = this.cachedSigner.connect(provider);
    }

    return this.cachedSigner;
  }
}

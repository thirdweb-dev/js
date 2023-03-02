import { AbstractWallet } from "./abstract";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
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
  constructor(options: AwsKmsSignerCredentials) {
    super();
    this.signer = this.updateSigner(new AwsKmsSigner(options));
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.signer as ethers.Signer;
  }

  // Add _signTypedData method onto the signer for now so we don't need to reimplement
  // The entire AWS KMS signer repository and maintain it ourselves.
  private updateSigner(signer: AwsKmsSigner): AwsKmsSigner {
    (signer as any)._signTypedData = async function (
      domain: TypedDataDomain,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, any>,
    ) {
      const hash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
      return signer._signDigest(hash);
    };

    return signer;
  }
}

import { AbstractWallet } from "../types/abstract";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
  SecretsManagerClientConfig,
} from "@aws-sdk/client-secrets-manager";
import { ethers } from "ethers";

export type AwsSecretsManagerWalletOptions = {
  secretId: string;
  secretKeyName: string;
  awsConfig: SecretsManagerClientConfig;
};

/**
 * Create a wallet instance using a private key stored in AWS Secrets Manager.
 *
 *  @example
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk"
 * import { AwsSecretsManagerWallet } from "@thirdweb-dev/sdk/evm/wallets"
 *
 * const wallet = new AwsSecretsManagerWallet({
 *   secretName: "my-secret",
 *   secretKeyName: "private-key",
 *   awsConfig: {
 *     region: "us-east-1",
 *     credentials: {
 *       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *     },
 *   }
 * });
 *
 * const sdk = await ThirdwebSDK.fromWallet(wallet, "mainnet");
 * ```
 */
export class AwsSecretsManagerWallet extends AbstractWallet {
  private secretId: string;
  private secretKeyName: string;
  private client: SecretsManagerClient;
  private cachedSigner: ethers.Signer | undefined;

  constructor(options: AwsSecretsManagerWalletOptions) {
    super();
    this.secretId = options.secretId;
    this.secretKeyName = options.secretKeyName;
    this.client = new SecretsManagerClient(options.awsConfig);
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    if (this.cachedSigner) {
      return this.cachedSigner;
    }

    const res = await this.client.send(
      new GetSecretValueCommand({
        SecretId: this.secretId,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );

    if (!res || !res.SecretString) {
      throw new Error(`No secret found at ${this.secretId}`);
    }

    const privateKey = JSON.parse(res.SecretString)[this.secretKeyName];
    if (!privateKey) {
      throw new Error(
        `Secret ${this.secretId} does not have key ${this.secretKeyName}`,
      );
    }

    this.cachedSigner = new ethers.Wallet(privateKey, provider);
    return this.cachedSigner;
  }
}

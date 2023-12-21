import { AbstractWallet } from "./abstract";
import type { SecretsManagerClientConfig } from "@aws-sdk/client-secrets-manager";
import { Wallet } from "ethers";
import type { Signer } from "ethers";

export type AwsSecretsManagerWalletOptions = {
  secretId: string;
  secretKeyName: string;
  awsConfig?: SecretsManagerClientConfig;
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
 *
 * @wallet
 */
export class AwsSecretsManagerWallet extends AbstractWallet {
  #signer?: Promise<Signer>;
  #options: AwsSecretsManagerWalletOptions;

  constructor(options: AwsSecretsManagerWalletOptions) {
    super();
    this.#options = options;
  }

  async getSigner(): Promise<Signer> {
    if (!this.#signer) {
      // construct our promise that will resolve to a signer (eventually)
      this.#signer = new Promise(async (resolve, reject) => {
        try {
          const { GetSecretValueCommand, SecretsManagerClient } = await import(
            "@aws-sdk/client-secrets-manager"
          );
          const client = new SecretsManagerClient(
            this.#options.awsConfig || {},
          );
          const res = await client.send(
            new GetSecretValueCommand({
              SecretId: this.#options.secretId,
              VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            }),
          );
          if (!res || !res.SecretString) {
            throw new Error(`No secret found at ${this.#options.secretId}`);
          }

          let privateKey;
          try {
            privateKey = JSON.parse(res.SecretString)[
              this.#options.secretKeyName
            ];
          } catch {
            throw new Error(
              `Secret ${
                this.#options.secretId
              } is not a valid JSON object! Please convert secret to a JSON object with key ${
                this.#options.secretKeyName
              }.`,
            );
          }

          if (!privateKey) {
            throw new Error(
              `Secret ${this.#options.secretId} does not have key ${
                this.#options.secretKeyName
              }`,
            );
          }

          resolve(new Wallet(privateKey));
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

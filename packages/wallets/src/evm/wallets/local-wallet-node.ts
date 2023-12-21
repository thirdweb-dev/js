import { WalletOptions } from "..";
import { AsyncJsonFileStorage } from "../../core/AsyncJsonFileStorage";
import { LocalWallet, LocalWalletOptions } from "./local-wallet";

/**
 * Generate [Local Wallets](https://portal.thirdweb.com/glossary/local-wallet) in Node.js backends, CLIs and scripts.
 *
 * This is very useful for situations where you need a wallet for your backend services, scripts or CLI.
 *
 * After generating wallets this way, you can persist it in different ways. For example, you can save it to a file, or store it in a database.
 *
 * @example
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 * import { LocalWalletNode } from "@thirdweb-dev/wallets/evm/wallets/local-wallet-node";
 *
 * // wallet data will be saved in 'wallet.json' by default
 * // you can also pass a different file path by specifying 'storageJsonFile' in the constructor
 * const wallet = new LocalWalletNode();
 *
 * // generate a random wallet
 * await wallet.generate();
 *
 * // connect wallet
 * await wallet.connect();
 *
 * // at any point, you can save the wallet to persistent storage
 * await wallet.save(config);
 * // and load it back up
 * await wallet.load(config);
 *
 * // you can also export the wallet out to send somewhere else
 * const exportedWallet = await wallet.export(config);
 * // and import it back in
 * await wallet.import(exportedWallet, config);
 *
 * // You can then use this wallet to perform transactions via the SDK
 * const sdk = await ThirdwebSDK.fromWallet(wallet, "goerli");
 * ```
 *
 * ## Local Wallet Backup
 *
 * Local wallets can be persisted in a file, database, or backed up to another cloud provider. Currently 3 formats are supported:
 *
 * - `encryptedJSON` - a standard format for encrypted wallets, this requires a password to encrypt/decrypt the wallet. Recommended for safe backups.
 * - `privateKey` - the raw private key. This can be stored encrypted or un-encrypted. If not encrypted, make sure you store it somewhere safe.
 * - `mnemonic` - the raw seed phrase. This can be stored encrypted or un-encrypted. If not encrypted, make sure you store it somewhere safe.
 *
 * We provide encryption capabilities out of the box, but you can customize the type of encryption, and also turn it off completely.
 *
 * The type of storage can also be overridden, allowing you to store wallets anywhere you want, including remote locations.
 *
 * By default, the local wallet will be saved in a `wallet.json` file at the root of your project. The path to the file can be customized by passing a `storageJsonFile` option to the constructor.
 *
 * Customizing where the wallet data is persisted only requires implementing a simple interface. Here's an example of a Local Wallet with custom storage:
 *
 * ```typescript
 * class MyStorage implements AsyncStorage {
 *   getItem(key: string): Promise<string | null> { ... }
 *   setItem(key: string, value: string): Promise<void> { ... }
 *   removeItem(key: string): Promise<void> { ... }
 * }
 *
 * const wallet = new LocalWalletNode({
 *   storage: new MyStorage(),
 * })
 * ```
 *
 * You can implement this any way you like, file persistance, remote cloud storage, etc.
 *
 * ## Encryption examples
 *
 * Here's some examples of different encryption configurations:
 *
 * 1. Save an encrypted privateKey with default encryption a password as the encryption key:
 *
 * ```javascript
 * localWallet.save({
 *   strategy: "privateKey",
 *   encryption: {
 *     password: "your-encryption-password", // uses default encryption
 *   },
 * });
 * ```
 *
 * 2. Import a raw private key or mnemonic (seed phrase) with no encryption:
 *
 * ```javascript
 * // privateKey
 * localWallet.import({
 *   privateKey: "your-raw-privateKey",
 *   encryption: false, // no encryption
 * });
 *
 * // mnemonic
 * localWallet.import({
 *   mnemonic: "your-raw-mnemonic",
 *   encryption: false, // no encryption
 * });
 * ```
 *
 * 3. Save an encrypted mnemonic with a custom encryption:
 *
 * ```javascript
 * // privateKey
 * localWallet.save({
 *   strategy: "mnemonic",
 *   encryption: {
 *     encrypt: (message: string, password: string) => {
 *       return yourCustomEncryption(message, password);
 *     },
 *     password: "your-encryption-password",
 *   },
 * });
 * ```
 *
 * @wallet
 */
export class LocalWalletNode extends LocalWallet {
  /**
   *
   * @param options - Wallet options to initialize the LocalWalletNode
   */
  constructor(
    options?: WalletOptions<LocalWalletOptions> & { storageJsonFile?: string },
  ) {
    const storage = new AsyncJsonFileStorage(
      options?.storageJsonFile || "./wallet.json",
    );
    super({ storage, ...options });
  }
}

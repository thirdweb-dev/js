import { AsyncStorage, createAsyncLocalStorage } from "../../core";
import { Connector } from "../interfaces/connector";
import { walletIds } from "../constants/walletIds";
import { AbstractClientWallet, WalletOptions } from "./base";
import {
  Chain,
  defaultChains,
  Ethereum,
  updateChainRPCs,
} from "@thirdweb-dev/chains";
import { Wallet, utils } from "ethers";
import { aesEncrypt, aesDecryptCompat } from "@thirdweb-dev/crypto";

export type LocalWalletOptions = {
  chain?: Chain;
  storage?: AsyncStorage;
  secretKey?: string;
};

export type WalletData = {
  address: string;
  strategy: "mnemonic" | "privateKey" | "encryptedJson";
  data: string;
  isEncrypted: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type LocalWalletConnectionArgs = {};

const STORAGE_KEY_WALLET_DATA = "localWalletData";

/**
 * Allow users to connect to your app by generating a [Local Wallet](https://portal.thirdweb.com/glossary/local-wallet) directly in your application.
 *
 * A local wallet is a low-level wallet that allows you to create wallets within your application or project. It is a non-custodial solution that simplifies the onboarding process and improves the user experience for web3 apps in two ways:
 *
 * 1. It enables non-web3 native users to get started easily without having to create a wallet.
 * 2. It hides transaction confirmations from users.
 *
 * After generating wallets for your users, you can offer multiple persistence and backup options.
 *
 * @example
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 * import { LocalWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new LocalWallet();
 *
 * // generate a random wallet
 * await wallet.generate();
 * // connect the wallet to the application
 * await wallet.connect();
 *
 * // at any point, you can save the wallet to persistent storage
 * await wallet.save(config);
 * // and load it back up
 * await wallet.load(config);
 *
 * // you can also export the wallet out of the application
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
 * Local wallets can be persisted on disk, or backed up to the cloud. Currently 3 formats are supported:
 *
 * - `encryptedJSON` - a standard format for encrypted wallets, this requires a password to encrypt/decrypt the wallet. Recommended for safe backups.
 * - `privateKey` - the raw private key. This can be stored encrypted or un-encrypted. If not encrypted, make sure you store it somewhere safe.
 * - `mnemonic` - the raw seed phrase. This can be stored encrypted or un-encrypted. If not encrypted, make sure you store it somewhere safe.
 *
 * We provide encryption capabilities out of the box, but you can customize the type of encryption, and also turn it off completely.
 *
 * The type of storage can also be overridden, allowing you to store wallets anywhere you want, including remote locations.
 *
 * By default, wallets will be stored on the browser's storage for web (React), and on the secure storage of the device for mobile (React Native).
 *
 * On Node.js, you can use `LocalWalletNode` which by default will save to the local file system of the machine.
 *
 * ```javascript
 * import { LocalWalletNode } from "@thirdweb-dev/wallets/evm/wallets/local-wallet-node";
 *
 * // wallet data will be saved in 'wallet.json' by default
 * // you can also pass a different file path by specifying 'storageJsonFile' in the constructor
 * const wallet = new LocalWalletNode();
 *
 * await localWallet.loadOrCreate({
 *   strategy: "privateKey",
 *   encryption: false,
 * });
 * ```
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
 * const wallet = new LocalWallet({
 *   storage: new MyStorage(),
 * })
 * ```
 *
 * You can implement this any way you like, file persistance, remote cloud storage, etc.
 *
 * ## Encryption examples
 *
 * #### Save an encrypted privateKey with default encryption a password as the encryption key:
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
 * #### Import a raw private key or mnemonic (seed phrase) with no encryption:
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
 * #### Save an encrypted mnemonic with a custom encryption:
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
export class LocalWallet extends AbstractClientWallet<
  LocalWalletOptions,
  LocalWalletConnectionArgs
> {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  options: WalletOptions<LocalWalletOptions>;
  /**
   * @internal
   */
  ethersWallet?: Wallet;
  /**
   * @internal
   */
  #storage: AsyncStorage;

  /**
   * @internal
   */
  static id = walletIds.localWallet as string;

  /**
   * @internal
   */
  static meta = {
    name: "Local Wallet",
    iconURL:
      "ipfs://QmbQzSNGvmNYZzem9jZRuYeLe9K2W4pqbdnVUp7Y6edQ8Y/local-wallet.svg",
  };

  /**
   * @internal
   */
  public get walletName() {
    return "Local Wallet" as const;
  }

  /**
   * Initialize the `LocalWallet` with the given `options`
   *
   * @param options - The `options` object contains the following properties:
   * ### clientId or secretKey (recommended)
   * Provide `clientId` or `secretKey` to use the thirdweb RPCs for given `chains`
   *
   * If you are using the `LocalWallet` in a in frontend - provide a `clientId`, If you are using the `LocalWallet` in backend - you can provide a `secretKey`.
   *
   * You can create a `clientId` / `secretKey` from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * ### chain (optional)
   * Must be a `Chain` object, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   * Defaults to `Ethereum`.
   *
   * ### chains (optional)
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to our [default chains](/react/react.thirdwebprovider#default-chains).
   *
   * ### storage (optional)
   * This is the default storage for storing the private key, mnemonic or encrypted JSON. This can be implemented in any way you want, as long as it conforms to the `AsyncStorage` interface:
   *
   * If omitted, defaults to browser local storage.
   *
   *
   * ```javascript
   * import { LocalWallet } from "@thirdweb-dev/wallets";
   *
   * const customStorage = {
   *   getItem: (key) => {
   *     // Implement your own storage logic here
   *   },
   *   removeItem: (key) => {
   *     // Implement your own storage logic here
   *   },
   *   setItem: (key, value) => {
   *     // Implement your own storage logic here
   *   },
   * };
   *
   * const walletWithOptions = new LocalWallet({
   *   storage: customStorage,
   * });
   * ```
   *
   */
  constructor(options?: WalletOptions<LocalWalletOptions>) {
    super(LocalWallet.id, options);

    if (options?.chain && options.clientId) {
      options.chain = updateChainRPCs(options.chain, options.clientId);
    }

    this.options = options || {};

    this.#storage =
      options?.storage || createAsyncLocalStorage(walletIds.localWallet);
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { LocalWalletConnector: LocalWalletConnector } = await import(
        "../connectors/local-wallet"
      );

      if (!this.ethersWallet) {
        throw new Error("wallet is not initialized");
      }

      const defaults = (
        this.options.chain
          ? [...defaultChains, this.options.chain]
          : defaultChains
      ).map((c) => updateChainRPCs(c, this.options.clientId));

      this.connector = new LocalWalletConnector({
        chain:
          this.options.chain ||
          updateChainRPCs(Ethereum, this.options.clientId),
        ethersWallet: this.ethersWallet,
        chains: this.chains || defaults,
        clientId: this.options.clientId,
        secretKey: this.options.secretKey,
      });
    }
    return this.connector;
  }

  /**
   * Load the saved wallet data from storage, if it exists, or generate a new one and save it.
   *
   * @example
   * ```js
   * wallet.loadOrCreate({
   *   strategy: "encryptedJson",
   *   password: password,
   * });
   * ```
   *
   * @param options - The `options` object must be of type `LocalWalletLoadOrCreateOptions`. It takes a `strategy` property and other properties depending on the strategy.
   *
   * ### strategy "encryptedJson"
   * Load the wallet from encrypted JSON. The `options` object takes the following properties:
   * * `strategy` - must be "encryptedJson"
   * * `password` - the password to decrypt the encrypted JSON
   * * `storage` - optional storage to get the wallet data from. Must be of type `AsyncStorage`
   *
   * ### strategy "privateKey"
   * Load the wallet from a private key. The `options` object takes the following properties:
   * * `strategy` - must be "privateKey"
   * * `encryption` - optional encryption object of type `DecryptOptions` to decrypt the private key. This is only required if the saved private key is encrypted.
   */
  async loadOrCreate(options: LocalWalletLoadOrCreateOptions) {
    if (await this.getSavedData(options.storage)) {
      await this.load(options);
    } else {
      await this.generate();
      await this.save(options);
    }
  }

  /**
   * Creates a new random wallet and returns the wallet address.
   *
   * @example
   * ```ts
   * const address = await wallet.generate();
   * ```
   *
   * @returns Promise that resolves to the address of the wallet
   */
  async generate() {
    if (this.ethersWallet) {
      throw new Error("wallet is already initialized");
    }
    const random = utils.randomBytes(32);
    this.ethersWallet = new Wallet(random);
    return this.ethersWallet.address;
  }

  /**
   * Create local wallet by importing a private key, mnemonic or encrypted JSON.
   * @example
   * ```javascript
   * const address = await localWallet.import({
   *   privateKey: "...",
   *   encryption: false,
   * });
   * ```
   *
   * @param options - The `options` object must be of type `LocalWalletImportOptions` which can have either `privateKey`, `mnemonic` or `encryptedJson` as a property.
   * They all can be encrypted or un-encrypted. If encrypted, the `encryption` property must be provided with `password` property to decrypt the data.
   *
   * ### privateKey
   * The Private Key of the wallet.
   *
   * ### mnemonic
   * The mnemonic (seed phrase) of the wallet.
   *
   * ### encryptedJson
   * The encrypted JSON of the wallet.
   *
   * ### encryption
   * This is only required if the given `privateKey`, `mnemonic` or `encryptedJson` is encrypted.
   * The `encryption` object of type `DecryptOptions` can be provided to decrypt the data. It is an object with the following properties:
   *
   * #### password
   * The password to decrypt the data.
   *
   * #### decrypt
   * A custom decrypt function that takes the encrypted data and password as arguments and returns the decrypted data.
   *
   * @returns Promise that resolves to the address of the wallet
   */
  async import(options: LocalWalletImportOptions): Promise<string> {
    if (this.ethersWallet) {
      throw new Error("wallet is already initialized");
    }

    if ("encryptedJson" in options) {
      this.ethersWallet = await Wallet.fromEncryptedJson(
        options.encryptedJson,
        options.password,
      );
      return this.ethersWallet.address;
    }

    if ("privateKey" in options) {
      if (!options.encryption && !isValidPrivateKey(options.privateKey)) {
        throw new Error("invalid private key");
      }

      const privateKey = await getDecryptor(options.encryption)(
        options.privateKey,
      );

      if (
        options.encryption &&
        (privateKey === "" || !isValidPrivateKey(privateKey))
      ) {
        throw new Error("invalid password");
      }

      this.ethersWallet = new Wallet(privateKey);
      return this.ethersWallet.address;
    }

    if ("mnemonic" in options) {
      if (!options.encryption && !utils.isValidMnemonic(options.mnemonic)) {
        throw new Error("invalid mnemonic");
      }

      const mnemonic = await getDecryptor(options.encryption)(options.mnemonic);

      if (
        options.encryption &&
        (mnemonic === "" || !utils.isValidMnemonic(mnemonic))
      ) {
        throw new Error("invalid password");
      }

      this.ethersWallet = Wallet.fromMnemonic(mnemonic);
      return this.ethersWallet.address;
    }

    throw new Error("invalid import strategy");
  }

  /**
   * Initialize the wallet from saved data on storage
   *
   * ```js
   * await wallet.load({
   *   strategy: "encryptedJson",
   *   password: "your-password",
   * });
   * ```
   *
   * @param options - The `options` object must be of type `LocalWalletLoadOptions` which contains a `strategy` property and other properties depending on the strategy.
   *
   * ### strategy "encryptedJson"
   * Initialize the wallet from encrypted JSON. The `options` object takes the following properties:
   * * `strategy` - must be "encryptedJson"
   * * `password` - the password to decrypt the encrypted JSON
   * * `storage` - optional storage to get the wallet data from. Must be of type `AsyncStorage`
   *
   * ### strategy "privateKey"
   * Initialize the wallet from a private key. The `options` object takes the following properties:
   * * `strategy` - must be "privateKey"
   * * `encryption` - optional encryption object of type `DecryptOptions` to decrypt the private key. This is only required if the private key is encrypted.
   * * `storage` - optional storage to get the wallet data from. Must be of type `AsyncStorage`
   *
   * ### strategy "mnemonic"
   * Initialize the wallet from a mnemonic (seed phrase). The `options` object takes the following properties:
   * * `strategy` - must be "mnemonic"
   * * `encryption` - optional encryption object of type `DecryptOptions` to decrypt the mnemonic. This is only required if the mnemonic is encrypted.
   * * `storage` - optional storage to get the wallet data from. Must be of type `AsyncStorage`
   *
   * @returns Promise that resolves to the address of the wallet
   */
  async load(options: LocalWalletLoadOptions): Promise<string> {
    if (this.ethersWallet) {
      throw new Error("wallet is already initialized");
    }

    const walletData = await this.getSavedData(options.storage);

    if (!walletData) {
      throw new Error("No Saved wallet found in storage");
    }

    // strategy mismatch
    if (walletData.strategy !== options.strategy) {
      throw new Error(
        `Saved wallet data is not ${options.strategy}, it is ${walletData.strategy}`,
      );
    }

    if (options.strategy === "encryptedJson") {
      return this.import({
        encryptedJson: walletData.data,
        password: options.password,
      });
    }

    // encryption mismatch
    if (walletData.isEncrypted && !options.encryption) {
      throw new Error(
        "Saved wallet data is encrypted, but no password is provided",
      );
    }

    if (!walletData.isEncrypted && options.encryption) {
      throw new Error(
        "Saved wallet data is not encrypted, but encryption config is provided",
      );
    }

    if (options.strategy === "privateKey") {
      return this.import({
        privateKey: walletData.data,
        encryption: options.encryption,
      });
    }

    if (options.strategy === "mnemonic") {
      return this.import({
        mnemonic: walletData.data,
        encryption: options.encryption,
      });
    }

    throw new Error("invalid load strategy");
  }

  /**
   * Save the wallet data to storage
   *
   * @example
   * ```javascript
   * wallet.save({
   *   strategy: "encryptedJson",
   *   password: "password",
   * });
   * ```
   *
   * @param options - The `options` object must be of type `LocalWalletSaveOptions`. It takes a `strategy` property and other properties depending on the strategy.
   *
   * ### strategy "encryptedJson"
   * Save the wallet data as encrypted JSON. The `options` object takes the following properties:
   * * `strategy` - must be "encryptedJson"
   * * `password` - the password to encrypt the wallet data
   * * `storage` - optional storage to save the wallet data to. Must be of type `AsyncStorage`
   *
   * ### strategy "privateKey"
   * Save the wallet data as a private key. The `options` object takes the following properties:
   * * `strategy` - must be "privateKey"
   * * `encryption` - optional encryption object of type `EncryptOptions` to encrypt the private key. This is only required if you want to encrypt the private key.
   * * `storage` - optional storage to save the wallet data to. Must be of type `AsyncStorage`
   *
   * ### strategy "mnemonic"
   * Save the wallet data as a mnemonic (seed phrase). The `options` object takes the following properties:
   * * `strategy` - must be "mnemonic"
   * * `encryption` - optional encryption object of type `EncryptOptions` to encrypt the mnemonic. This is only required if you want to encrypt the mnemonic.
   * * `storage` - optional storage to save the wallet data to. Must be of type `AsyncStorage`
   *
   */
  async save(options: LocalWalletSaveOptions): Promise<void> {
    const wallet = this.ethersWallet;
    if (!wallet) {
      throw new Error("Wallet is not initialized");
    }

    if (options.strategy === "encryptedJson") {
      const encryptedData = await wallet.encrypt(options.password, {
        scrypt: {
          N: 1 << 32,
        },
      });

      await this.#saveData(
        {
          address: wallet.address,
          data: encryptedData,
          strategy: "encryptedJson",
          isEncrypted: true,
        },
        options.storage,
      );
    }

    if (options.strategy === "privateKey") {
      const privateKey = await getEncryptor(options.encryption)(
        wallet.privateKey,
      );

      await this.#saveData(
        {
          address: wallet.address,
          data: privateKey,
          strategy: "privateKey",
          isEncrypted: !!options.encryption,
        },
        options.storage,
      );
    }

    if (options.strategy === "mnemonic") {
      if (!wallet.mnemonic) {
        throw new Error(
          "mnemonic can not be computed if wallet is created from a private key or generated using generate()",
        );
      }

      const mnemonic = await getEncryptor(options.encryption)(
        wallet.mnemonic.phrase,
      );
      await this.#saveData(
        {
          address: wallet.address,
          data: mnemonic,
          strategy: "mnemonic",
          isEncrypted: !!options.encryption,
        },
        options.storage,
      );
    }
  }

  /**
   * Check if the wallet data is saved in storage.
   *
   * @returns `true` if initialized wallet's data is saved in storage
   */
  async isSaved() {
    try {
      const data = await this.getSavedData();
      const address = await this.getAddress();
      if (data?.address === address) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Delete the saved wallet from storage. This action is irreversible, use with caution.
   *
   * @example
   * ```ts
   * await wallet.deleteSaved();
   * ```
   */
  async deleteSaved() {
    await this.#storage.removeItem(STORAGE_KEY_WALLET_DATA);
  }

  /**
   * Encrypts the wallet with a password in various formats and return it.
   *
   * @example
   * ```javascript
   * const data = await wallet.export({
   *   strategy: "encryptedJson",
   *   password: "password",
   * });
   * ```
   *
   * @param options - The `options` object must be of type `LocalWalletExportOptions`. It takes a `strategy` and other properties depending on the strategy.
   *
   * ### strategy - "encryptedJson"
   * Export wallet in encryptedJson format. The `options` object takes the following properties:
   * * `strategy` - must be "encryptedJson"
   * * `password` - the password to encrypt the wallet data
   *
   * ### strategy - "privateKey"
   * Encrypt the private key of the wallet. The `options` object takes the following properties:
   * * `strategy` - must be "privateKey"
   * * `encryption` - encryption object of type `EncryptOptions` to encrypt the private key. It takes a `password` property to encrypt the private key and an optional `encrypt` function to encrypt the private key. If `encrypt` function is not provided, it uses the default encryption.
   *
   * ### strategy - "mnemonic"
   * Encrypt the mnemonic (seed phrase) of the wallet. The `options` object takes the following properties:
   * * `strategy` - must be "mnemonic"
   * * `encryption` - encryption object of type `EncryptOptions` to encrypt the mnemonic. It takes a `password` property to encrypt the mnemonic and an optional `encrypt` function to encrypt the mnemonic. If `encrypt` function is not provided, it uses the default encryption.
   *
   * @returns Promise that resolves to a `string` that contains encrypted wallet data
   */
  async export(options: LocalWalletExportOptions): Promise<string> {
    const wallet = this.ethersWallet;
    if (!wallet) {
      throw new Error("Wallet is not initialized");
    }

    if (options.strategy === "encryptedJson") {
      return wallet.encrypt(options.password, {
        scrypt: {
          N: 1 << 32,
        },
      });
    }

    if (options.strategy === "privateKey") {
      return getEncryptor(options.encryption)(wallet.privateKey);
    }

    if (options.strategy === "mnemonic") {
      if (!wallet.mnemonic) {
        throw new Error(
          "mnemonic can not be computed if wallet is created from a private key or generated using generate()",
        );
      }

      return getEncryptor(options.encryption)(wallet.mnemonic.phrase);
    }

    throw new Error("Invalid export strategy");
  }

  /**
   * Get the saved wallet data from storage
   * @param storage - storage to get the wallet data from. Must be of type `AsyncStorage`
   *
   * @example
   * ```javascript
   * const someStorage = {
   *   getItem: (key) => {
   *     // Implement your own storage logic here
   *   },
   *   removeItem: (key) => {
   *     // Implement your own storage logic here
   *   },
   *   setItem: (key, value) => {
   *     // Implement your own storage logic here
   *   },
   * }
   *
   * wallet.getSaved(someStorage);
   * ```
   *
   * @returns `Promise` which resolves to a `WalletData` object containing the wallet data. It returns `null` if no wallet data is found in storage.
   * ```ts
   * {
   *     address: string;
   *     strategy: "mnemonic" | "privateKey" | "encryptedJson";
   *     data: string;
   *     isEncrypted: boolean;
   * }
   * ```
   */
  async getSavedData(storage?: AsyncStorage): Promise<WalletData | null> {
    const _storage = storage || this.#storage;

    try {
      const savedDataStr = await _storage.getItem(STORAGE_KEY_WALLET_DATA);
      if (!savedDataStr) {
        return null;
      }

      const savedData = JSON.parse(savedDataStr);
      if (!savedData) {
        return null;
      }

      return savedData as WalletData;
    } catch (e) {
      return null;
    }
  }

  /**
   * store the wallet data to storage
   */
  async #saveData(data: WalletData, storage?: AsyncStorage) {
    const _storage = storage || this.#storage;
    await _storage.setItem(STORAGE_KEY_WALLET_DATA, JSON.stringify(data));
  }

  /**
   * Disconnect the wallet
   */
  async disconnect() {
    await super.disconnect();
    this.ethersWallet = undefined;
  }
}

export type LocalWalletDecryptOptions =
  | {
      decrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

export type LocalWalletEncryptOptions =
  | {
      encrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

export type LocalWalletImportOptions =
  | {
      privateKey: string;
      encryption: LocalWalletDecryptOptions;
    }
  | {
      mnemonic: string;
      encryption: LocalWalletDecryptOptions;
    }
  | {
      encryptedJson: string;
      password: string;
    };

export type LocalWalletLoadOptions =
  | {
      strategy: "encryptedJson";
      password: string;
      storage?: AsyncStorage;
    }
  | {
      strategy: "privateKey";
      storage?: AsyncStorage;
      encryption: LocalWalletDecryptOptions;
    }
  | {
      strategy: "mnemonic";
      storage?: AsyncStorage;
      encryption: LocalWalletDecryptOptions;
    };

// omit the mnemonic strategy option from LoadOptions
export type LocalWalletLoadOrCreateOptions =
  | {
      strategy: "encryptedJson";
      password: string;
      storage?: AsyncStorage;
    }
  | {
      strategy: "privateKey";
      storage?: AsyncStorage;
      encryption: LocalWalletDecryptOptions;
    };

export type LocalWalletSaveOptions =
  | { strategy: "encryptedJson"; password: string; storage?: AsyncStorage }
  | {
      strategy: "privateKey";
      encryption: LocalWalletEncryptOptions;
      storage?: AsyncStorage;
    }
  | {
      strategy: "mnemonic";
      encryption: LocalWalletEncryptOptions;
      storage?: AsyncStorage;
    };

export type LocalWalletExportOptions =
  | { strategy: "encryptedJson"; password: string }
  | {
      strategy: "privateKey";
      encryption: LocalWalletEncryptOptions;
    }
  | {
      strategy: "mnemonic";
      encryption: LocalWalletEncryptOptions;
    };

// used in getDecryptor and getEncryptor below
async function noop(msg: string) {
  return msg;
}

/**
 * if encryption object is provided
 *  - return the encryption.decrypt function if given, else return the default decrypt function
 * if encryption object is not provided
 * - return a noop function
 * @returns
 */
function getDecryptor(encryption: LocalWalletDecryptOptions | undefined) {
  return encryption
    ? (msg: string) =>
        // we're using aesDecryptCompat here because we want to support legacy crypto-js ciphertext for the moment
        (encryption.decrypt || aesDecryptCompat)(msg, encryption.password)
    : noop;
}

/**
 * if encryption object is provided
 *  - return the encryption.encrypt function if given, else return the default encrypt function
 * if encryption object is not provided
 * - return a noop function
 * @returns
 */
function getEncryptor(encryption: LocalWalletEncryptOptions | undefined) {
  return encryption
    ? (msg: string) =>
        (encryption.encrypt || aesEncrypt)(msg, encryption.password)
    : noop;
}

/**
 * @internal
 */
export function isValidPrivateKey(value: string) {
  return !!value.match(/^(0x)?[0-9a-f]{64}$/i);
}

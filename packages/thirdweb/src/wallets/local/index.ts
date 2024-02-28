import { mnemonicToAccount } from "viem/accounts";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { privateKeyAccount, viemToThirdwebAccount } from "../private-key.js";
import {
  saveConnectParamsToStorage,
  walletStorage,
} from "../storage/walletStorage.js";
import type { WalletMetadata } from "../types.js";
import type { AsyncStorage } from "../storage/AsyncStorage.js";
import type {
  LocalWalletLoadOrCreateOptions,
  LocalWalletImportOptions,
  LocalWalletLoadOptions,
  LocalWalletSaveOptions,
  LocalWalletStorageData,
  LocalWalletExportOptions,
} from "./types.js";
import {
  getDecryptionFunction,
  getEncryptionFunction,
  isValidPrivateKey,
} from "./utils.js";
import { english, generateMnemonic } from "viem/accounts";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { toHex } from "../../utils/encoding/hex.js";

export type LocalWalletCreationOptions = {
  client: ThirdwebClient;
};

export type LocalWalletConnectionOptions = {
  chain?: Chain;
};

type SavedConnectParams = {
  chain?: Chain;
};

const STORAGE_KEY_WALLET_DATA = "tw:localWalletData";

export const localWalletMetadata: WalletMetadata = {
  id: "local",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzY0KSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV82NCkiPgo8cGF0aCBkPSJNNTguNzUgMTkuMTY2N0gyMS4yNUMxOC45NTgzIDE5LjE2NjcgMTcuMDgzMyAyMS4wNDE3IDE3LjA4MzMgMjMuMzMzNFY0OC4zMzM0QzE3LjA4MzMgNTAuNjI1IDE4Ljk1ODMgNTIuNSAyMS4yNSA1Mi41SDM1LjgzMzNMMzEuNjY2NyA1OC43NVY2MC44MzM0SDQ4LjMzMzNWNTguNzVMNDQuMTY2NyA1Mi41SDU4Ljc1QzYxLjA0MTcgNTIuNSA2Mi45MTY3IDUwLjYyNSA2Mi45MTY3IDQ4LjMzMzRWMjMuMzMzNEM2Mi45MTY3IDIxLjA0MTcgNjEuMDQxNyAxOS4xNjY3IDU4Ljc1IDE5LjE2NjdaTTU4Ljc1IDQ0LjE2NjdIMjEuMjVWMjMuMzMzNEg1OC43NVY0NC4xNjY3WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfNjQiIHgxPSI0MCIgeTE9IjAiIHgyPSI0MCIgeTI9IjgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNDRTExQUIiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTAwQkI1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMV82NCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1IDE1KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
  name: "Local Wallet",
};

/**
 * Allow users to connect to your app by generating a
 * [Local Wallet](https://portal.thirdweb.com/glossary/local-wallet) directly in your application.
 *
 * A local wallet is a low-level wallet that allows you to create wallets within your application or project.
 * It is a non-custodial solution that simplifies the onboarding process and improves the user experience for web3 apps in two ways:
 *
 * 1. It enables non-web3 native users to get started easily without having to create a wallet.
 * 2. It hides transaction confirmations from users.
 *
 * After generating wallets for your users, you can offer multiple persistence and backup options.
 * @param options - The options of type `LocalWalletCreationOptions`.
 * Refer to [`LocalWalletCreationOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletCreationOptions) for more details.
 * @example
 * Creating a `LocalWallet` instance requires a `client` object of type `ThirdwebClient`.
 * Refer to [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation to learn how to create a client.
 *
 * You can then use methods like `generate`, `import`, `load` to initialize the wallet
 * and `save` to save the wallet data to storage. You can also use `export` to get the wallet data in various formats.
 *
 * ```ts
 * import { LocalWallet } from "thirdweb/wallets";
 *
 * const wallet = new LocalWallet({
 * client,
 * })
 *
 * ```
 * @returns A `LocalWallet` instance
 */
export function localWallet(options: LocalWalletCreationOptions) {
  return new LocalWallet(options);
}

/**
 * Allow users to connect to your app by generating a
 * [Local Wallet](https://portal.thirdweb.com/glossary/local-wallet) directly in your application.
 *
 * A local wallet is a low-level wallet that allows you to create wallets within your application or project.
 * It is a non-custodial solution that simplifies the onboarding process and improves the user experience for web3 apps in two ways:
 *
 * 1. It enables non-web3 native users to get started easily without having to create a wallet.
 * 2. It hides transaction confirmations from users.
 *
 * After generating wallets for your users, you can offer multiple persistence and backup options.
 *
 *
 * ## Create a LocalWallet instance.
 *
 * Creating a `LocalWallet` instance requires a `client` object of type `ThirdwebClient`.
 * Refer to [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation to learn how to create a client.
 *
 * ```ts
 * import { LocalWallet } from "thirdweb/wallets";
 *
 * const wallet = new LocalWallet({
 *   client,
 * })
 *
 * ```
 *
 * You can then use methods like `generate`, `import`, `load` to initialize the wallet
 * and `save` to save the wallet data to storage. You can also use `export` to get the wallet data in various formats.
 *
 */
export class LocalWallet implements Wallet {
  metadata: Wallet["metadata"];

  private options: LocalWalletCreationOptions;
  private account?: Account;
  private chain?: Chain;

  // when generating a random wallet - we generate a mnemonic and save both mnemonic and private key
  // so that it can be exported in both mnemonic and private key format
  private privateKey?: string;
  private mnemonic?: string;

  /**
   * Create `LocalWallet` instance
   * @param options - The options of type `LocalWalletCreationOptions`.
   * Refer to [`LocalWalletCreationOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletCreationOptions) for more details.
   * @example
   * ```ts
   * const wallet = new LocalWallet({
   *  client,
   * });
   * ```
   */
  constructor(options: LocalWalletCreationOptions) {
    this.options = options;
    this.metadata = localWalletMetadata;
  }

  /**
   * Get the `Chain` object of the blockchain that the wallet is connected to.
   * @returns The `Chain` object
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   */
  getChain(): Chain | undefined {
    return this.chain;
  }

  /**
   * Get the connected `Account`
   * @returns The connected `Account` object
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   */
  getAccount(): Account | undefined {
    return this.account;
  }

  /**
   * Connect LocalWallet
   * @param options - The `options` object of type `LocalWalletConnectionOptions`.
   * Refer to [`LocalWalletConnectionOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletConnectionOptions) for more details.
   *
   * Before calling this method, wallet needs to be initialized using `generate`, `load` or `import` method.
   * @example
   * ```ts
   * await wallet.generate();
   * const account = await wallet.connect();
   * ```
   * @returns The connected `Account` object
   */
  async connect(options?: LocalWalletConnectionOptions) {
    this.chain = options?.chain || ethereum;
    if (!this.account) {
      throw new Error("Wallet is not initialized");
    }
    const params: SavedConnectParams = {
      chain: options?.chain,
    };
    saveConnectParamsToStorage(this.metadata.id, params);
    return this.account;
  }

  /**
   * Auto connect is not supported for Local Wallet because initializing the wallet the wallet requires user input ( password for decryption ) and password is not stored in storage.
   * @example
   * ```ts
   * await wallet.autoConnect(); // throws error
   * ```
   */
  async autoConnect(): Promise<Account> {
    throw new Error("Auto connect is not supported for Local Wallet");
  }

  /**
   * Switch the wallet to a different blockchain by passing the `Chain` object of it.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   * @param chain - The `Chain` object of the blockchain to switch to.
   * @example
   * ```ts
   * import { defineChain } from "thirdweb";
   * const mumbai = defineChain({
   *  id: 80001,
   * });
   * await wallet.switchChain(mumbai)
   * ```
   */
  async switchChain(chain: Chain) {
    this.chain = chain;
  }

  /**
   * Load the saved wallet from storage if it exists or generate a random wallet
   *
   * Once the wallet is loaded or created, you should call `connect` method to connect to get the `Account` object.
   * @example
   * ```js
   * await wallet.loadOrCreate({
   *   strategy: "privateKey",
   *   encryption: {
   *     password: "your-password",
   *   }
   * });
   * const account = await wallet.connect();
   * ```
   * @param options - Options object of type `LocalWalletLoadOrCreateOptions`.
   * Refer to [`LocalWalletLoadOrCreateOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletLoadOrCreateOptions) for more details.
   */
  async loadOrCreate(options: LocalWalletLoadOrCreateOptions) {
    if (await this.getSavedData(options.storage)) {
      await this.load(options);
    } else {
      await this.generate();
    }
  }

  /**
   * Generates a random `Account` by generating a random private key.
   *
   * Once the wallet is generated, you should call `connect` method to connect to get the `Account` object.
   *
   * If an account is already initialized, it throws an error to avoid overwriting the existing account.
   * @example
   * ```ts
   * await wallet.generate();
   * const account = await wallet.connect();
   * ```
   */
  async generate() {
    if (this.account) {
      throw new Error("Account is already initialized");
    }

    // generate a random mnemonic and get first account (private key)
    // we generate a mnemonic so that we can export the wallet in both mnemonic and private key format
    const mnemonic = generateMnemonic(english);
    const hdAccount = mnemonicToAccount(mnemonic);
    const hdKey = hdAccount.getHdKey();

    if (hdKey.privateKey) {
      this.privateKey = toHex(hdKey.privateKey);
    }

    this.mnemonic = mnemonic;

    this.account = viemToThirdwebAccount(hdAccount, this.options.client);
  }

  /**
   * Create local wallet from a private key, mnemonic or encrypted JSON.
   * @example
   * ```javascript
   * const address = await localWallet.import({
   *   privateKey: "...",
   *   encryption: false,
   * });
   * ```
   * @param options - The `options` object must be of type `LocalWalletImportOptions`
   * Refer to [`LocalWalletImportOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletImportOptions) for more details.
   */
  async import(options: LocalWalletImportOptions): Promise<void> {
    if (this.account) {
      throw new Error("wallet is already initialized");
    }

    if ("privateKey" in options) {
      if (!options.encryption && !isValidPrivateKey(options.privateKey)) {
        throw new Error("invalid private key");
      }

      const privateKey = await getDecryptionFunction(options.encryption)(
        options.privateKey,
      );

      if (
        options.encryption &&
        (privateKey === "" || !isValidPrivateKey(privateKey))
      ) {
        throw new Error("invalid password");
      }

      this.account = privateKeyAccount({
        client: this.options.client,
        privateKey,
      });

      this.privateKey = privateKey;
    } else if ("mnemonic" in options) {
      const mnemonic = await getDecryptionFunction(options.encryption)(
        options.mnemonic,
      );

      if (options.encryption && mnemonic === "") {
        throw new Error("invalid password");
      }

      const hdAccount = mnemonicToAccount(mnemonic);
      const hdKey = hdAccount.getHdKey();

      this.account = viemToThirdwebAccount(hdAccount, this.options.client);

      this.mnemonic = mnemonic;
      if (hdKey.privateKey) {
        this.privateKey = toHex(hdKey.privateKey);
      }
    } else {
      throw new Error("invalid import strategy");
    }
  }

  /**
   * Initialize the wallet from saved wallet data in storage
   * @param options - The `options` object of type `LocalWalletLoadOptions`.
   * Refer to [`LocalWalletLoadOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletLoadOptions) for more details.
   * @example
   * ```ts
   * await wallet.load({
   *  strategy: "privateKey",
   *  encryption: {
   *    password: "your-password",
   *  }
   * });
   * ```
   */
  async load(options: LocalWalletLoadOptions): Promise<void> {
    if (this.account) {
      throw new Error("wallet is already initialized");
    }

    const walletData = await this.getSavedData();

    if (!walletData) {
      throw new Error("No Saved wallet found in storage");
    }

    // strategy mismatch
    if (walletData.type !== options.strategy) {
      throw new Error(
        `Saved wallet data is not ${options.strategy}, it is ${walletData.type}`,
      );
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
      await this.import({
        privateKey: walletData.data,
        encryption: options.encryption,
      });
    } else if (options.strategy === "mnemonic") {
      await this.import({
        mnemonic: walletData.data,
        encryption: options.encryption,
      });
    } else {
      throw new Error("invalid load strategy");
    }
  }

  /**
   * Save the wallet data to storage in various formats.
   * Note: Saving wallet data in an encrypted format is highly recommended - especially when the storage is not secure. ( such as `window.localStorage` )
   * @example
   * ```js
   * wallet.save({
   *   strategy: "privateKey",
   *   encryption: {
   *    password: "your-password",
   *   }
   * });
   * ```
   * @param options - The `options` object must be of type `LocalWalletSaveOptions`.
   * Refer to [`LocalWalletSaveOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletSaveOptions) for more details.
   */
  async save(options: LocalWalletSaveOptions): Promise<void> {
    const account = this.account;
    if (!account) {
      throw new Error("Wallet is not initialized");
    }

    if (options.strategy === "privateKey") {
      if (!this.privateKey) {
        throw new Error(
          "No private key found - Failed to save wallet data in privateKey format",
        );
      }

      const privateKey = await getEncryptionFunction(options.encryption)(
        this.privateKey,
      );

      await this.saveData(
        {
          address: account.address,
          data: privateKey,
          type: "privateKey",
          isEncrypted: !!options.encryption,
        },
        options.storage,
      );
    }

    if (options.strategy === "mnemonic") {
      if (!this.mnemonic) {
        throw new Error(
          "No mnemonic found - Failed to save wallet data in mnemonic format",
        );
      }

      const mnemonic = await getEncryptionFunction(options.encryption)(
        this.mnemonic,
      );

      await this.saveData(
        {
          address: account.address,
          data: mnemonic,
          type: "mnemonic",
          isEncrypted: !!options.encryption,
        },
        options.storage,
      );
    }
  }

  /**
   * Check if the current initialized wallet's data is saved in storage.
   * @returns `true` if initialized wallet's data is saved in storage
   * @example
   * ```ts
   * const isSaved = await wallet.isSaved();
   * ```
   */
  async isSaved() {
    if (!this.account) {
      throw new Error("Wallet is not initialized");
    }

    try {
      const data = await this.getSavedData();
      if (data?.address === this.account.address) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Delete the saved wallet from storage.
   * This action is irreversible, use with caution.
   * @param storage - storage interface of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to delete the wallet data from. If not provided, it defaults to `window.localStorage`.
   * @example
   * ```ts
   * await wallet.deleteSaved();
   * ```
   */
  async deleteSaved(storage?: AsyncStorage) {
    const _storage = storage || walletStorage;
    await _storage.removeItem(STORAGE_KEY_WALLET_DATA);
  }

  /**
   * Encrypts the wallet's private key or mnemonic (seed phrase) and returns the encrypted data.
   * @example
   * ```ts
   * const data = await wallet.export({
   *   strategy: "privateKey",
   *   encryption: {
   *    password: "your-password",
   *   }
   * });
   * ```
   * @param options - The `options` object must be of type `LocalWalletExportOptions`.
   * Refer to [`LocalWalletExportOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletExportOptions) for more details.
   * @returns Promise that resolves to a `string` that contains encrypted wallet data
   */
  async export(options: LocalWalletExportOptions): Promise<string> {
    const account = this.account;
    if (!account) {
      throw new Error("Wallet is not initialized");
    }

    if (options.strategy === "privateKey") {
      if (!this.privateKey) {
        throw new Error(
          "Private key not found - Failed to export wallet data in privateKey format",
        );
      }
      return getEncryptionFunction(options.encryption)(this.privateKey);
    } else if (options.strategy === "mnemonic") {
      if (!this.mnemonic) {
        throw new Error(
          "Mnemonic not found - Failed to export wallet data in mnemonic format",
        );
      }

      return getEncryptionFunction(options.encryption)(this.mnemonic);
    } else {
      throw new Error("Invalid export strategy");
    }
  }

  /**
   * Get the saved wallet data from storage
   * @param storage - storage interface of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to get the wallet data from. If not provided, it defaults to `window.localStorage`.
   * @example
   * ```javascript
   * const savedData = await wallet.getSaved();
   * ```
   * @returns `Promise` which resolves to a `LocalWalletStorageData` object or `null` if no wallet data is found in storage.
   * Refer to [`LocalWalletStorageData`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletStorageData) for more details.
   */
  async getSavedData(
    storage?: AsyncStorage,
  ): Promise<LocalWalletStorageData | null> {
    try {
      const savedDataStr = await (storage || walletStorage).getItem(
        STORAGE_KEY_WALLET_DATA,
      );
      if (!savedDataStr) {
        return null;
      }

      const savedData = JSON.parse(savedDataStr);
      if (!savedData) {
        return null;
      }

      return savedData as LocalWalletStorageData;
    } catch (e) {
      return null;
    }
  }

  /**
   * Store the wallet data to storage
   * @param data - The wallet data of type [`LocalWalletStorageData`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletStorageData) to save to storage.
   * @param storage - storage interface of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to save the wallet data to. If not provided, it defaults to `window.localStorage`.
   * @example
   * ```js
   * await wallet.saveData(data);
   * ```
   */
  private async saveData(data: LocalWalletStorageData, storage?: AsyncStorage) {
    const _storage = storage || walletStorage;
    await _storage.setItem(STORAGE_KEY_WALLET_DATA, JSON.stringify(data));
  }

  /**
   * Disconnect the wallet
   * @example
   * ```ts
   * await wallet.disconnect();
   * ```
   */
  async disconnect() {
    this.account = undefined;
    this.chain = undefined;
    this.privateKey = undefined;
    this.mnemonic = undefined;
  }
}

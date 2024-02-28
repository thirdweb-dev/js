import type { AsyncStorage } from "../storage/AsyncStorage.js";

/**
 * Type of object that is saved in storage by [`LocalWallet`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet)
 * when [`save`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet#save) method is called.
 */
export type LocalWalletStorageData = {
  /**
   * Address of the wallet
   */
  address: string;
  /**
   * Type of the data saved in storage
   */
  type: "mnemonic" | "privateKey";
  /**
   * the wallet data - It can be a private key or a mnemonic string - encrypted or un-encrypted
   */
  data: string;
  /**
   * Flag to indicate if the data is encrypted or not
   */
  isEncrypted: boolean;
};

/**
 * Options for [`loadOrCreate`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet#loadOrCreate)
 * method of [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet)
 *
 * It contains the following properties:
 *
 * ### strategy
 * It can be either `"privateKey"` or `"mnemonic"`
 *
 * ### encryption
 * If the wallet data is encrypted, `encryption` proeperty must be given an object of type [`LocalWalletDecryptOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletDecryptOptions) to decrypt the wallet data.
 *
 * If the wallet data is not encrypted, `encryption` property must be `false`.
 *
 * ### storage (optional)
 * Object of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to get the wallet data from.
 *
 * If not provided, it defaults to `window.localStorage`.
 * @example
 * ```ts
 * const wallet = localWallet({ client });
 *
 * // load the saved wallet data if it exists, if the data is encrypted private key, and given password can successfully decrypt the data
 * await wallet.loadOrCreate({
 *  strategy: "privateKey",
 *  encryption: {
 *    password: "....",
 *  }
 * })
 *
 * await wallet.connect();
 * ```
 */
export type LocalWalletLoadOrCreateOptions = {
  strategy: "privateKey" | "mnemonic";
  storage?: AsyncStorage;
  encryption: LocalWalletDecryptOptions | false;
};

/**
 * Options to decrypt the [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet) wallet data.
 * It can be either an object or `false`.
 *
 * It contains the following properties on the object:
 *
 * ### password
 * The password to decrypt the wallet data
 *
 * ### decrypt (optional)
 * A function to decrypt the wallet data. This allows you to customize the decryption method.
 * If not provided, the wallet data will be decrypted using the default decryption method (AES)
 * @example
 * Decrypt the wallet data using the default decryption method (AES) using given password
 * ```ts
 * const options = {
 *  password: "....",
 * }
 * ```
 *
 * Decrypt the wallet data using a custom decryption method using given password
 *
 * ```ts
 * const options = {
 *  password: "....",
 *  decrypt: async (message, password) => {
 *    // custom decryption logic
 *    return decryptedMessage;
 *  }
 * }
 * ```
 */
export type LocalWalletDecryptOptions = {
  decrypt?: (message: string, password: string) => Promise<string>;
  password: string;
};

/**
 * Options for [`save`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet#save)
 * method of [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet)
 *
 * It contains the following properties:
 *
 * ### strategy
 * It can be either `"privateKey"` or `"mnemonic"`
 *
 * ### encryption
 * If the wallet data is encrypted, `encryption` property must be given an object of type [`LocalWalletDecryptOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletDecryptOptions) to decrypt the wallet data.
 *
 * If the wallet data is not encrypted, `encryption` property must be `false`.
 *
 * ### storage (optional)
 * object of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to get the wallet data from.
 *
 * If not provided, it defaults to `window.localStorage`.
 * @example
 * Encrypt the private key using given password and save it in storage
 * ```ts
 * const wallet = localWallet({ client });
 * await wallet.save({
 *  strategy: "privateKey",
 *  encryption: {
 *    password: "....",
 *  }
 * })
 * ```
 *
 * Save non-encrypted mnemonic in storage. Note: You should never save un-encrypted wallet data in unsecure storage like `localStorage`.
 * ```ts
 * const wallet = localWallet({ client });
 * await wallet.save({
 *  strategy: "mnemonic",
 *  encryption: false,
 * })
 * ```
 *
 * Save the un-encrypted private key in a custom storage.
 *
 * You can create a custom storage by creating an object of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage).
 *
 * ```ts
 * const wallet = localWallet({ client });
 * await wallet.save({
 *  strategy: "privateKey",
 *  encryption: false,
 *  storage: customStorage // customStorage is of type AsyncStorage
 * })
 * ```
 */
export type LocalWalletSaveOptions = {
  storage?: AsyncStorage;
  encryption: LocalWalletEncryptOptions | false;
  strategy: "privateKey" | "mnemonic";
};

/**
 * Options for [`import`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet#import)
 * method of [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet)
 *
 * It contains the following properties:
 *
 * ### encryption
 * If the wallet data is encrypted, `encryption` property must be given an object of type [`LocalWalletDecryptOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletDecryptOptions) to decrypt the wallet data.
 *
 * If the wallet data is not encrypted, `encryption` property must be `false`.
 *
 * ### privateKey or mnemonic
 * The other required property is either `privateKey` or `mnemonic`.
 * If you want to initialize the wallet with a private key, you must provide the `privateKey` property with the private key string.
 * If you want to initialize the wallet with a mnemonic, you must provide the `mnemonic` property with the mnemonic string.
 * @example
 * initialize the wallet with a non-encrypted private key
 * ```ts
 * const wallet = localWallet({ client })
 *
 * await wallet.import({
 *  privateKey: "....",
 *  encryption: false,
 * })
 * ```
 *
 * initialize the wallet with an encrypted private key. You also need to provide the password to decrypt the private key.
 * This password should be the same password that was used to encrypt the private key.
 *
 * If no `decrypt` function is provided, the default decryption method (AES) will be used.
 *
 * ```ts
 * const wallet = localWallet({ client })
 *
 * await wallet.import({
 *  privateKey: "....",
 *  encryption: {
 *    password: "....",
 *  },
 * })
 * ```
 *
 * You can also customize the decryption method by providing a custom `decrypt` function.
 * The encryption should also be done with its counterpart encryption function for the custom decryption function to work.
 *
 * ```ts
 * const wallet = localWallet({ client })
 *
 * await wallet.import({
 *  privateKey: "....",
 *  encryption: {
 *    password: "....",
 *    decrypt: async (message, password) => {
 *      // custom decryption logic
 *      return decryptedMessage;
 *    }
 *  },
 * })
 * ```
 */
export type LocalWalletImportOptions = {
  encryption: LocalWalletDecryptOptions | false;
} & (
  | {
      privateKey: string;
    }
  | {
      mnemonic: string;
    }
);

/**
 * Options to encrypt the [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet) wallet data.
 * It can be either an object or `false`.
 *
 * It contains the following properties on the object:
 *
 * ### password
 * The password to encrypt the wallet data
 *
 * ### encrypt (optional)
 * A function to encrypt the wallet data. This allows you to customize the encryption method.
 * If not provided, the wallet data will be encrypted using the default encryption method (AES)
 * @example
 * Decrypt the wallet data using the default decryption method (AES) using given password
 * ```ts
 * const options = {
 *  password: "....",
 * }
 * ```
 *
 * Encrypt the wallet data using a custom encryption method using given password
 *
 * ```ts
 * const options = {
 *  password: "....",
 *  encrypt: async (message, password) => {
 *    // custom encryption logic
 *    return encryptedMessage;
 *  }
 * }
 * ```
 */
export type LocalWalletEncryptOptions = {
  encrypt?: (message: string, password: string) => Promise<string>;
  password: string;
};

/**
 * Options for [`export`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet#export)
 * method of [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet)
 *
 * It contains the following properties:
 *
 * ### strategy
 * It can be either `"privateKey"` or `"mnemonic"`
 *
 * ### encryption
 * If the wallet data is encrypted, `encryption` property must be given an object of type [`LocalWalletEncryptOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletEncryptOptions) to encrypt the wallet data.
 *
 * If the wallet data is not encrypted, `encryption` property must be `false`.
 * @example
 * Encrypt the private key using given password and get the encrypted private key
 * ```ts
 * const wallet = localWallet({ client });
 * const encryptedPrivateKey = await wallet.export({
 *  strategy: "privateKey",
 *  encryption: {
 *    password: "....",
 *  }
 * })
 * ```
 *
 * Get non-encrypted mnemonic.
 * ```ts
 * const wallet = localWallet({ client });
 *
 * const mnemonic = await wallet.export({
 *  strategy: "mnemonic",
 *  encryption: false,
 * })
 * ```
 */
export type LocalWalletExportOptions = {
  encryption: LocalWalletEncryptOptions | false;
  strategy: "privateKey" | "mnemonic";
};

/**
 * Options for [`load`](https://portal.thirdweb.com/references/typescript/v5/LocalWallet#load)
 * method of [`LocalWallet`]((https://portal.thirdweb.com/references/typescript/v5/LocalWallet)
 *
 * The object contains below properties:
 *
 * ### strategy
 * It can be either `"privateKey"` or `"mnemonic"`
 *
 * ### encryption
 * If the wallet data is encrypted, `encryption` property must be given an object of type [`LocalWalletDecryptOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletDecryptOptions) to decrypt the wallet data.
 *
 * If the wallet data is not encrypted, `encryption` property must be `false`.
 * @example
 * Initialize the wallet by loading the encrypted privateKey from storage and decrypting it using given password
 * ```ts
 * await wallet.load({
 *  strategy: "privateKey",
 *  encryption: {
 *    password: "your-password",
 *  }
 * });
 * ```
 *
 * Initialize the wallet by loading the un-encrypted mnemonic from storage
 * ```ts
 * await wallet.load({
 *  strategy: "mnemonic",
 *  encryption: false
 * });
 * ```
 */
export type LocalWalletLoadOptions = {
  strategy: "privateKey" | "mnemonic";
  encryption: LocalWalletDecryptOptions | false;
};

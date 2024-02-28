import type { AsyncStorage } from "../storage/AsyncStorage.js";

// TODO: export all
// TODO: check encryption is supposed to be required or not

/**
 * Type of object that is saved in storage by `LocalWallet` when `save` method is called.
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
 * Options for `loadOrCreate` method of `LocalWallet`.
 *
 * It contains the following properties:
 *
 * ### strategy
 * It can be either `"privateKey"` or `"mnemonic"`
 *
 * ### encryption (optional)
 * The encryption object of type [`LocalWalletDecryptOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletDecryptOptions) to decrypt the wallet data.
 * It is only required if the wallet data is encrypted.
 *
 * ### storage (optional)
 * object of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to get the wallet data from.
 *
 * If not provided, it defaults to `window.localStorage`.
 */
export type LocalWalletLoadOrCreateOptions = {
  strategy: "privateKey" | "mnemonic";
  storage?: AsyncStorage;
  encryption: LocalWalletDecryptOptions;
};

export type LocalWalletDecryptOptions =
  | {
      decrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

export type LocalWalletSaveOptions = {
  storage?: AsyncStorage;
  encryption: LocalWalletEncryptOptions;
  strategy: "privateKey" | "mnemonic";
};

export type LocalWalletImportOptions = {
  encryption: LocalWalletDecryptOptions;
} & (
  | {
      privateKey: string;
    }
  | {
      mnemonic: string;
    }
);

export type LocalWalletEncryptOptions =
  | {
      encrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

export type LocalWalletExportOptions = {
  encryption: LocalWalletEncryptOptions;
  strategy: "privateKey" | "mnemonic";
};

/**
 * The options for `load` method of `LocalWallet`.
 * The object contains a `strategy` and `encryption` property. The `encryption` property is only required if the wallet data is encrypted.
 */
export type LocalWalletLoadOptions = {
  strategy: "privateKey" | "mnemonic";
  encryption: LocalWalletDecryptOptions;
};

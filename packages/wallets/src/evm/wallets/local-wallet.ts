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

export class LocalWallet extends AbstractClientWallet<
  LocalWalletOptions,
  LocalWalletConnectionArgs
> {
  connector?: Connector;
  options: WalletOptions<LocalWalletOptions>;
  ethersWallet?: Wallet;
  #storage: AsyncStorage;

  static id = walletIds.localWallet as string;

  static meta = {
    name: "Local Wallet",
    iconURL:
      "ipfs://QmbQzSNGvmNYZzem9jZRuYeLe9K2W4pqbdnVUp7Y6edQ8Y/local-wallet.svg",
  };

  public get walletName() {
    return "Local Wallet" as const;
  }

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
   * load saved wallet data from storage or generate a new one and save it.
   */
  async loadOrCreate(options: LoadOrCreateOptions) {
    if (await this.getSavedData(options.storage)) {
      await this.load(options);
    } else {
      await this.generate();
      await this.save(options);
    }
  }

  /**
   * creates a new random wallet
   * @returns the address of the newly created wallet
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
   * create local wallet from an "encryptedJson", "privateKey" or "mnemonic"
   * @returns
   */
  async import(options: ImportOptions): Promise<string> {
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
   * initialize the wallet from saved data on storage
   * @param password - password used for encrypting the wallet
   */
  async load(options: LoadOptions): Promise<string> {
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
   */
  async save(options: SaveOptions): Promise<void> {
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
   * @returns true if initialized wallet's data is saved in storage
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
   * deletes the saved wallet data from storage
   */
  async deleteSaved() {
    await this.#storage.removeItem(STORAGE_KEY_WALLET_DATA);
  }

  /**
   * encrypts the wallet with given password and returns the encrypted wallet
   * @param password - password for encrypting the wallet data
   */
  async export(options: ExportOptions): Promise<string> {
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

  async disconnect() {
    await super.disconnect();
    this.ethersWallet = undefined;
  }
}

type DecryptOptions =
  | {
      decrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

type EncryptOptions =
  | {
      encrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

type ImportOptions =
  | {
      privateKey: string;
      encryption: DecryptOptions;
    }
  | {
      mnemonic: string;
      encryption: DecryptOptions;
    }
  | {
      encryptedJson: string;
      password: string;
    };

type LoadOptions =
  | {
      strategy: "encryptedJson";
      password: string;
      storage?: AsyncStorage;
    }
  | {
      strategy: "privateKey";
      storage?: AsyncStorage;
      encryption: DecryptOptions;
    }
  | {
      strategy: "mnemonic";
      storage?: AsyncStorage;
      encryption: DecryptOptions;
    };

// omit the mnemonic strategy option from LoadOptions
type LoadOrCreateOptions =
  | {
      strategy: "encryptedJson";
      password: string;
      storage?: AsyncStorage;
    }
  | {
      strategy: "privateKey";
      storage?: AsyncStorage;
      encryption: DecryptOptions;
    };

type SaveOptions =
  | { strategy: "encryptedJson"; password: string; storage?: AsyncStorage }
  | {
      strategy: "privateKey";
      encryption: EncryptOptions;
      storage?: AsyncStorage;
    }
  | {
      strategy: "mnemonic";
      encryption: EncryptOptions;
      storage?: AsyncStorage;
    };

type ExportOptions =
  | { strategy: "encryptedJson"; password: string }
  | {
      strategy: "privateKey";
      encryption: EncryptOptions;
    }
  | {
      strategy: "mnemonic";
      encryption: EncryptOptions;
    };

async function defaultEncrypt(message: string, password: string) {
  // encrypt the message with the password using the browser's native crypto api
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const passwordData = encoder.encode(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = { name: "AES-GCM", iv: iv };
  const key = await crypto.subtle.importKey("raw", passwordData, alg, false, [
    "encrypt",
  ]);
  const encryptedData = await crypto.subtle.encrypt(alg, key, data);
  const buffer = new Uint8Array(encryptedData);
  const result = new Uint8Array(iv.length + buffer.length);
  result.set(iv);
  result.set(buffer, iv.length);
  return btoa(String.fromCharCode(...result));
}

async function defaultDecrypt(message: string, password: string) {
  // decrypt the message with the password using the browser's native crypto api
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const data = atob(message);
  const iv = data.slice(0, 12);
  const buffer = data.slice(12);
  const alg = {
    name: "AES-GCM",
    iv: Uint8Array.from(iv, (c) => c.charCodeAt(0)),
  };
  const passwordData = encoder.encode(password);
  const key = await crypto.subtle.importKey("raw", passwordData, alg, false, [
    "decrypt",
  ]);
  const decryptedData = await crypto.subtle.decrypt(
    alg,
    key,
    Uint8Array.from(buffer, (c) => c.charCodeAt(0)),
  );
  return decoder.decode(decryptedData);
}

/**
 * if encryption object is provided
 *  - return the encryption.decrypt function if given, else return the default decrypt function
 * if encryption object is not provided
 * - return a noop function
 * @returns
 */
function getDecryptor(encryption: DecryptOptions | undefined) {
  const noop = async (msg: string) => msg;
  return encryption
    ? (msg: string) =>
        (encryption.decrypt || defaultDecrypt)(msg, encryption.password)
    : noop;
}

/**
 * if encryption object is provided
 *  - return the encryption.encrypt function if given, else return the default encrypt function
 * if encryption object is not provided
 * - return a noop function
 * @returns
 */
function getEncryptor(encryption: EncryptOptions | undefined) {
  const noop = async (msg: string) => msg;
  return encryption
    ? (msg: string) =>
        (encryption.encrypt || defaultEncrypt)(msg, encryption.password)
    : noop;
}

export function isValidPrivateKey(value: string) {
  return !!value.match(/^(0x)?[0-9a-f]{64}$/i);
}

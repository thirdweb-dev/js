import type { TypedData } from "abitype";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedDataDefinition,
} from "viem";
import type {
  Wallet,
  WalletConnectionOptions,
} from "../../../interfaces/wallet.js";
import type { StorageType } from "../storage/type.js";
import type {
  CreateWalletOverrideType,
  SensitiveWalletDetailType,
  WalletDetailType,
} from "./type.js";

/**
 * Connect to Injected Wallet Provider
 * @param arg - The options for connecting to the embedded wallet Provider.
 * @param arg.storage - The storage options for the wallet sensitive information
 * @returns A Promise that resolves to a Wallet instance.
 * @throws Error if no injected provider is available or no accounts are available.
 * @example
 * ```ts
 * import { embeddedWallet } from "thirdweb/wallets";
 *
 * const storage = createManagedStorage({})
 * const wallet = await embeddedWallet({
 *  storage,
 * });
 *
 * ```
 */
export const embeddedWallet = async (arg: { storage: StorageType }) => {
  const wallet = new EmbeddedWallet({
    storage: arg.storage,
  });
  return wallet.loadOrCreateWallet();
};

class EmbeddedWallet implements Wallet {
  private storage: StorageType;
  private activeWallet: SensitiveWalletDetailType | null = null;
  private wallets: Record<string, SensitiveWalletDetailType> = {};

  public metadata = {
    id: "embedded-wallet",
    name: "Embedded Wallet",
    iconUrl: "TODO",
  };

  address: string;

  constructor(arg: { storage: StorageType }) {
    this.storage = arg.storage;
    this.address = "";
  }

  async loadOrCreateWallet() {
    const { getUserWalletDetail } = await import("./utils.js");
    const { EmbeddedWalletError } = await import("./error.js");

    if (!this.storage.authUser) {
      throw new Error(
        "Secret key for backend usage of embedded wallets is not implemented yet. Please use it with an authenticated user.",
      );
    }

    const wallets = await getUserWalletDetail({
      user: this.storage.authUser,
    });

    if (wallets.length === 0) {
      const newSensitiveWalletDetail = await this.createWallet();
      await this.saveWallet({
        walletDetail: newSensitiveWalletDetail,
      });
      return this;
    }

    const wallet = wallets[0];
    if (!wallet) {
      throw new EmbeddedWalletError(`BAD STATE: Wallets array is empty`);
    }
    await this.loadWallet({
      walletDetail: wallet,
    });
    return this;
  }

  async getWalletDetails() {
    const { getUserWalletDetail } = await import("./utils.js");
    if (!this.storage.authUser) {
      // todo: check secret key path
      return [];
    }
    const wallets = await getUserWalletDetail({
      user: this.storage.authUser,
    });
    return wallets;
  }

  async createWallet(arg?: { createWalletOverride: CreateWalletOverrideType }) {
    const { createWallet } = await import("./utils.js");
    const wallet = await createWallet({
      createWalletOverride: arg?.createWalletOverride,
      client: this.storage.client,
      format: this.storage.format,
      authUser: this.storage.authUser,
    });
    this.wallets[wallet.walletId] = wallet;
    return wallet;
  }

  async saveWallet(arg: {
    walletDetail: WalletDetailType;
    storageOverride?: StorageType;
  }) {
    const { saveWallet } = await import("./utils.js");
    const { EmbeddedWalletError } = await import("./error.js");

    const storage = arg.storageOverride ?? this.storage;
    let sensitiveWalletDetail = this.wallets[arg.walletDetail.walletId];
    if (!sensitiveWalletDetail) {
      sensitiveWalletDetail = await this.loadWallet({
        walletDetail: arg.walletDetail,
      });
    }
    if (!sensitiveWalletDetail) {
      throw new EmbeddedWalletError(
        "Unauthorized. Attempting to save a wallet that cannot be loaded by given credentials.",
      );
    }
    return await saveWallet({
      walletDetail: sensitiveWalletDetail,
      storage,
    });
  }

  async loadWallet({
    walletDetail,
    storageOverride,
  }: {
    walletDetail: WalletDetailType;
    storageOverride?: StorageType;
  }) {
    const { loadWallet } = await import("./utils.js");

    const storage = storageOverride ?? this.storage;

    const sensitiveWalletDetail = await loadWallet({
      walletDetail,
      storage,
    });

    await this.setActiveWallet({
      walletDetail: sensitiveWalletDetail,
    });
    return sensitiveWalletDetail;
  }

  async setActiveWallet(arg: {
    walletDetail: SensitiveWalletDetailType | WalletDetailType;
  }) {
    if (this.wallets[arg.walletDetail.walletId]) {
      const wallet = this.wallets[arg.walletDetail.walletId];
      if (!wallet) {
        throw new Error(`BAD STATE: wallet is empty even after check.`);
      }
      this.activeWallet = wallet;
    } else if ("keyMaterial" in arg.walletDetail) {
      this.wallets[arg.walletDetail.walletId] = arg.walletDetail;
      this.activeWallet = arg.walletDetail;
    } else {
      await this.loadWallet({
        walletDetail: arg.walletDetail,
      });
    }
    this.address = arg.walletDetail.address;
    return arg.walletDetail;
  }

  // TODO: DRY this with PrivateKeyWallet and figure out what connect takes
  public async connect(options: WalletConnectionOptions | undefined) {
    // hack to satisfy linter
    void options;
    return this;
  }

  public async signMessage({ message }: { message: SignableMessage }) {
    const { privateKeyToAccount } = await import("viem/accounts");

    if (!this.activeWallet) {
      throw new Error("not connected");
    }

    const account = privateKeyToAccount(this.activeWallet.keyMaterial as Hex);
    return account.signMessage({ message });
  }

  public async signTransaction(tx: TransactionSerializable) {
    const { privateKeyToAccount } = await import("viem/accounts");

    if (!this.activeWallet) {
      throw new Error("not connected");
    }

    const account = privateKeyToAccount(this.activeWallet.keyMaterial as Hex);
    return account.signTransaction(tx);
  }

  public async signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(typedData: TypedDataDefinition<typedData, primaryType>) {
    const { privateKeyToAccount } = await import("viem/accounts");

    if (!this.activeWallet) {
      throw new Error("not connected");
    }

    const account = privateKeyToAccount(this.activeWallet.keyMaterial as Hex);
    return account.signTypedData(typedData);
  }

  // tx functions
  async sendTransaction(
    // TODO: figure out how we would pass our "chain" object in here?
    // maybe we *do* actually have to take in a tx object instead of the raw tx?
    tx: TransactionSerializable & { chainId: number },
  ) {
    if (!this.activeWallet || !this.address) {
      throw new Error("not connected");
    }
    const { getRpcClient, eth_sendRawTransaction } = await import(
      "../../../../rpc/index.js"
    );

    const rpcRequest = getRpcClient({
      client: this.storage.client,
      chain: tx.chainId,
    });
    const signedTx = await this.signTransaction(tx);
    const transactionHash = await eth_sendRawTransaction(rpcRequest, signedTx);
    return {
      transactionHash,
    };
  }

  public async autoConnect() {
    return this;
  }

  public async disconnect() {
    this.activeWallet = null;
  }
}

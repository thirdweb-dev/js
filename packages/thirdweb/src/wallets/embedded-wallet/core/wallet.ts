import type { AbiFunction, TypedData } from "abitype";
import type {
  Hash,
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedDataDefinition,
} from "viem";
import { type Address } from "viem/accounts";
import type { Transaction } from "../../../transaction/transaction.js";
import type { IWallet } from "../../interfaces/wallet.js";
import type { StorageType } from "./storage.type.js";
import type {
  CreateWalletOverrideType,
  SaveWalletArgType,
  SensitiveWalletDetailType,
  WalletDetailType,
} from "./wallet.type.js";

export const embeddedWallet = async (arg: { storage: StorageType }) => {
  const wallet = new EmbeddedWallet({
    storage: arg.storage,
  });
  return wallet.loadOrCreateWallet();
};

type EmbeddedWalletConnectOptions = Record<string, never>;

class EmbeddedWallet implements IWallet<EmbeddedWalletConnectOptions> {
  private storage: StorageType;
  private activeWallet: SensitiveWalletDetailType | null = null;
  private wallets: Record<string, SensitiveWalletDetailType> = {};

  get address() {
    return this.activeWallet?.address || null;
  }

  constructor(arg: { storage: StorageType }) {
    this.storage = arg.storage;
  }

  async loadOrCreateWallet() {
    const { getUserWalletDetail } = await import("./wallet.utils.js");

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
      const sensitiveWalletDetail = await this.saveWallet({
        walletDetail: newSensitiveWalletDetail,
      });
      this.wallets[sensitiveWalletDetail.walletId] = sensitiveWalletDetail;
      await this.setActiveWallet({
        wallet: sensitiveWalletDetail,
      });
      return this;
    }

    const wallet = wallets[0];
    if (!wallet) {
      throw new Error(`BAD STATE: Wallets array is empty`);
    }
    await this.loadWallet({
      walletDetail: wallet,
    });
    return this;
  }

  async getWalletDetails() {
    const { getUserWalletDetail } = await import("./wallet.utils.js");
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
    const { createWallet } = await import("./wallet.utils.js");
    return await createWallet({
      createWalletOverride: arg?.createWalletOverride,
      client: this.storage.client,
      format: this.storage.format,
      authUser: this.storage.authUser,
    });
  }

  async saveWallet(
    arg: Omit<SaveWalletArgType, "storage"> & { storageOverride?: StorageType },
  ) {
    const storage = arg.storageOverride ?? this.storage;
    const { saveWallet } = await import("./wallet.utils.js");
    return await saveWallet({
      walletDetail: arg.walletDetail,
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
    const { loadWallet } = await import("./wallet.utils.js");

    const storage = storageOverride ?? this.storage;

    const sensitiveWalletDetail = await loadWallet({
      walletDetail,
      storage,
    });
    this.wallets[sensitiveWalletDetail.walletId] = sensitiveWalletDetail;

    await this.setActiveWallet({
      wallet: sensitiveWalletDetail,
    });
    return sensitiveWalletDetail;
  }

  async setActiveWallet(arg: {
    wallet: SensitiveWalletDetailType | WalletDetailType;
  }) {
    if ("keyMaterial" in arg.wallet) {
      this.activeWallet = arg.wallet;
    } else {
      await this.loadWallet({
        walletDetail: arg.wallet,
      });
    }
  }

  // TODO: DRY this with PrivateKeyWallet and figure out what connect takes
  public async connect(options: EmbeddedWalletConnectOptions) {
    // hack to satisfy linter
    void options;
    return this;
  }

  public async signMessage(message: SignableMessage) {
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
  public async sendTransaction<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ) {
    if (!this.activeWallet || !this.address) {
      throw new Error("not connected");
    }
    const { getRpcClient } = await import("../../../rpc/index.js");
    const rpcRequest = getRpcClient(tx.client, { chainId: tx.chainId });

    const [getDefaultGasOverrides, encode, transactionCount] =
      await Promise.all([
        import("../../../gas/fee-data.js").then(
          (m) => m.getDefaultGasOverrides,
        ),
        import("../../../transaction/actions/encode.js").then((m) => m.encode),
        import("../../../rpc/methods.js").then((m) => m.transactionCount),
      ]);

    const [gasOverrides, encodedData, nextNonce, estimatedGas] =
      await Promise.all([
        getDefaultGasOverrides(tx.client, tx.chainId),
        encode(tx),
        transactionCount(rpcRequest, this.address),
        this.estimateGas(tx),
      ]);

    const signedTx = await this.signTransaction({
      gas: estimatedGas,
      to: tx.contractAddress as Address,
      chainId: tx.chainId,
      data: encodedData,
      nonce: nextNonce,
      ...gasOverrides,
    });

    // send the tx
    // TODO: move into rpc/methods
    const { result } = await rpcRequest({
      method: "eth_sendRawTransaction",
      params: [signedTx],
    });
    tx.transactionHash = result as Hash;

    return {
      transactionHash: result as Hash,
    };
  }

  public async estimateGas<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ): Promise<bigint> {
    if (!this.activeWallet) {
      throw new Error("not connected");
    }
    const { estimateGas } = await import(
      "../../../transaction/actions/estimate-gas.js"
    );
    return estimateGas(tx, this);
  }

  public async disconnect() {
    this.activeWallet = null;
  }
}

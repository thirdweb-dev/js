import type { AbiFunction, TypedData } from "abitype";
import type { ThirdwebClient } from "src/client/client.js";
import { fakeUuid } from "src/utils/uuid.js";
import type { IWallet } from "src/wallets/interfaces/wallet.js";
import {
  type Hash,
  type Hex,
  type PrivateKeyAccount,
  type SignableMessage,
  type TransactionSerializable,
  type TypedDataDefinition,
} from "viem";
import type { Transaction } from "../../../transaction/transaction.js";

import { generatePrivateKey, type Address } from "viem/accounts";
import type { AuthUserType } from "./authentication.type.js";
import type { StorageType } from "./storage.type.js";
import type { WalletDetailType } from "./wallet.type.js";

export const getUserWalletDetail = async (arg: { user: AuthUserType }) => {
  const { ROUTE_FETCH_USER_WALLETS } = await import("./routes.js");

  const resp = await fetch(ROUTE_FETCH_USER_WALLETS(), {
    headers: {
      Authorization: arg.user.authToken,
    },
  });
  const result = await resp.json();
  return result as WalletDetailType;
};

export const embeddedWallet = async (arg: {
  storage: StorageType;
  client: ThirdwebClient;
}) => {
  const wallet = new EmbeddedWallet({
    client: arg.client,
    storage: arg.storage,
  });
  return wallet.loadOrCreateWallet();
};

export const createWallet = async (arg: {
  client: ThirdwebClient;
}): Promise<WalletDetailType> => {
  const { privateKeyWallet } = await import("../../private-key.js");
  const privateKey = generatePrivateKey();
  const factory = privateKeyWallet(arg.client);
  const wallet = await factory.connect({ pkey: privateKey });
  const address = wallet.address;
  if (!address) {
    throw new Error("address not found");
  }
  return {
    address: wallet.address,
    walletId: fakeUuid(),
    keyGenerationSource: "thirdweb",
    walletState: "loaded",
    format: "sharded",
    client: arg.client,
    createdAt: new Date().getTime(),
  };
};

type EmbeddedWalletConnectOptions = {
  pkey: string;
};

class EmbeddedWallet implements IWallet<EmbeddedWalletConnectOptions> {
  private client: ThirdwebClient;
  private storage: StorageType;
  private account: PrivateKeyAccount | null = null;

  get address() {
    return this.account?.address || null;
  }

  constructor(arg: { client: ThirdwebClient; storage: StorageType }) {
    this.client = arg.client;
    this.storage = arg.storage;
  }

  async loadOrCreateWallet() {
    // TODO: implement
    return this;
  }

  // TODO: DRY this with PrivateKeyWallet
  public async connect(options: EmbeddedWalletConnectOptions) {
    let pkey = options.pkey;
    const { privateKeyToAccount } = await import("viem/accounts");
    // auto prefix
    if (typeof pkey === "string" && !pkey.startsWith("0x")) {
      pkey = "0x" + pkey;
    }
    this.account = privateKeyToAccount(pkey as Hex);
    return this;
  }

  public async signMessage(message: SignableMessage) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signMessage({ message });
  }

  public async signTransaction(tx: TransactionSerializable) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signTransaction(tx);
  }

  public async signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(typedData: TypedDataDefinition<typedData, primaryType>) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signTypedData(typedData);
  }

  // tx functions

  public async sendTransaction<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ) {
    if (!this.account || !this.address) {
      throw new Error("not connected");
    }
    const { getRpcClient } = await import("../../../rpc/index.js");
    const rpcRequest = getRpcClient(tx.client, { chainId: tx.inputs.chainId });

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
        getDefaultGasOverrides(tx.client, tx.inputs.chainId),
        encode(tx),
        transactionCount(rpcRequest, this.address),
        this.estimateGas(tx),
      ]);

    const signedTx = await this.signTransaction({
      gas: estimatedGas,
      to: tx.inputs.address as Address,
      chainId: tx.inputs.chainId,
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
    if (!this.account) {
      throw new Error("not connected");
    }
    const { estimateGas } = await import(
      "../../../transaction/actions/estimate-gas.js"
    );
    return estimateGas(tx, this);
  }

  public async disconnect() {
    this.account = null;
  }
}

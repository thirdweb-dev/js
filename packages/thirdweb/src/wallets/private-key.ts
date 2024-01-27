import type {
  Hash,
  Hex,
  PrivateKeyAccount,
  SignableMessage,
  TransactionSerializable,
  TypedDataDefinition,
} from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { TypedData } from "abitype";

import type { IWallet } from "./interfaces/wallet.js";

export function privateKeyWallet({ client }: { client: ThirdwebClient }) {
  return new PrivateKeyWallet(client);
}

type PrivateKeyWalletConnectOptions = {
  pkey: string;
};

class PrivateKeyWallet implements IWallet<PrivateKeyWalletConnectOptions> {
  private account: PrivateKeyAccount | null = null;
  private client: ThirdwebClient;

  get address() {
    return this.account?.address || null;
  }

  constructor(client: ThirdwebClient) {
    this.client = client;
  }

  public async connect(options: PrivateKeyWalletConnectOptions) {
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
  public async signTransaction(tx: TransactionSerializable) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signTransaction(tx);
  }

  public async sendTransaction(
    tx: TransactionSerializable & { chainId: number },
  ) {
    if (!this.account || !this.address) {
      throw new Error("not connected");
    }

    const { getRpcClient } = await import("../rpc/index.js");
    const rpcRequest = getRpcClient(this.client, {
      chainId: tx.chainId,
    });

    const signedTx = await this.signTransaction(tx);

    // send the tx
    // TODO: move into rpc/methods
    const result = await rpcRequest({
      method: "eth_sendRawTransaction",
      params: [signedTx],
    });

    return result as Hash;
  }

  public async disconnect() {
    this.account = null;
  }
}

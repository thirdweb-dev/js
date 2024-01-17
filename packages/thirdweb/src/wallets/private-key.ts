import type {
  Hex,
  PrivateKeyAccount,
  SignableMessage,
  TransactionSerializable,
  TypedDataDefinition,
} from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { IWallet } from "./utils/wallet.js";
import { privateKeyToAccount } from "viem/accounts";
import type { AbiFunction, TypedData } from "abitype";
import type { Transaction } from "../transaction/index.js";
import { estimateGas } from "../transaction/actions/estimate-gas.js";
import { execute } from "../transaction/actions/execute.js";

export function privateKeyWallet(client: ThirdwebClient) {
  return new PrivateKeyWallet(client);
}

type PrivateKeyWalletConnectOptions = {
  pkey: string;
};

class PrivateKeyWallet implements IWallet {
  // private _client: ThirdwebClient;
  private account: PrivateKeyAccount | null = null;

  get address() {
    return this.account?.address || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_client: ThirdwebClient) {
    // this._client = client;
  }

  public async connect(options: PrivateKeyWalletConnectOptions) {
    const { pkey } = options;
    this.account = privateKeyToAccount(pkey as Hex);
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

  public async estimateGas<abiFn extends AbiFunction>(tx: Transaction<abiFn>) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return estimateGas(tx, this);
  }

  public async execute<abiFn extends AbiFunction>(tx: Transaction<abiFn>) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return execute(tx, this);
  }

  public async disconnect() {
    this.account = null;
  }
}

import type {
  Address,
  Hash,
  Hex,
  PrivateKeyAccount,
  SignableMessage,
  TransactionSerializable,
  TypedDataDefinition,
} from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { AbiFunction, TypedData } from "abitype";
import type { Transaction } from "../transaction/transaction.js";
import type { IWallet } from "./interfaces/wallet.js";

export function privateKeyWallet({ client }: { client: ThirdwebClient }) {
  return new PrivateKeyWallet(client);
}

type PrivateKeyWalletConnectOptions = {
  pkey: string;
};

class PrivateKeyWallet implements IWallet<PrivateKeyWalletConnectOptions> {
  private account: PrivateKeyAccount | null = null;

  get address() {
    return this.account?.address || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_client: ThirdwebClient) {
    // this.client = client;
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
    const { getRpcClient } = await import("../rpc/index.js");
    const rpcRequest = getRpcClient(tx.contract, {
      chainId: tx.contract.chainId,
    });

    const [getDefaultGasOverrides, encode, transactionCount] =
      await Promise.all([
        import("../gas/fee-data.js").then((m) => m.getDefaultGasOverrides),
        import("../transaction/actions/encode.js").then((m) => m.encode),
        import("../rpc/methods.js").then((m) => m.transactionCount),
      ]);

    const [gasOverrides, encodedData, nextNonce, estimatedGas] =
      await Promise.all([
        getDefaultGasOverrides(tx.contract, tx.contract.chainId),
        encode(tx),
        transactionCount(rpcRequest, this.address),
        this.estimateGas(tx),
      ]);

    const signedTx = await this.signTransaction({
      gas: estimatedGas,
      to: tx.contract.address as Address,
      chainId: tx.contract.chainId,
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

    return {
      transactionHash: result as Hash,
      wait: async () => {
        const { waitForReceipt } = await import(
          "../transaction/actions/wait-for-tx-receipt.js"
        );
        return waitForReceipt({
          contract: tx.contract,
          transactionHash: result,
        });
      },
    };
  }

  public async estimateGas<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ): Promise<bigint> {
    if (!this.account) {
      throw new Error("not connected");
    }
    const { estimateGas } = await import(
      "../transaction/actions/estimate-gas.js"
    );
    return estimateGas(tx, this);
  }

  public async disconnect() {
    this.account = null;
  }
}

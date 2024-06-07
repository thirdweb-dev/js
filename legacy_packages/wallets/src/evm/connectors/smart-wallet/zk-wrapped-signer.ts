import {
  getDefaultGasOverrides,
  signTypedDataInternal,
} from "@thirdweb-dev/sdk";
import {
  Bytes,
  Signer,
  providers,
  TypedDataDomain,
  TypedDataField,
  Wallet,
  ethers,
  BigNumber,
  BigNumberish,
} from "ethers";
import { BytesLike, Deferrable, defineReadOnly } from "ethers/lib/utils";
import { HttpRpcClient } from "./lib/http-rpc-client";
import { ZkTransactionInput } from "./types";

type Eip712Meta = {
  /** The maximum amount of gas the user is willing to pay for a single byte of pubdata. */
  gasPerPubdata?: BigNumberish;
  /** An array of bytes containing the bytecode of the contract being deployed and any related contracts it can deploy. */
  factoryDeps?: BytesLike[];
  /** Custom signature used for cases where the signer's account is not an EOA. */
  customSignature?: BytesLike;
  /** Parameters for configuring the custom paymaster for the transaction. */
  paymasterParams?: PaymasterParams;
};

type PaymasterParams = {
  /** The address of the paymaster. */
  paymaster: string;
  /** The bytestream input for the paymaster. */
  paymasterInput: BytesLike;
};

export class ZkWrappedSigner extends Signer {
  protected httpRpcClient: HttpRpcClient;

  constructor(
    private signer: ethers.Signer,
    httpRpcClient: HttpRpcClient,
  ) {
    super();
    defineReadOnly(this, "provider", signer.provider);
    this.httpRpcClient = httpRpcClient;
  }

  override async getAddress(): Promise<string> {
    return await this.signer.getAddress();
  }

  override async signMessage(message: Bytes | string): Promise<string> {
    return await this.signer.signMessage(message);
  }

  override async signTransaction(
    transaction: providers.TransactionRequest,
  ): Promise<string> {
    return await this.signer.signTransaction(transaction);
  }

  override connect(provider: providers.Provider): Signer {
    return new ZkWrappedSigner(
      this.signer.connect(provider),
      this.httpRpcClient,
    );
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
  ): Promise<string> {
    return (this.signer as any)._signTypedData(domain, types, value);
  }

  override async sendTransaction(
    transaction: Deferrable<providers.TransactionRequest>,
  ): Promise<providers.TransactionResponse> {
    return await this.sendZkSyncTransaction(transaction);
  }

  async sendZkSyncTransaction(
    _transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  ): Promise<ethers.providers.TransactionResponse> {
    const transaction = await this.populateTransaction(_transaction);
    if (!transaction.chainId) {
      throw new Error("ChainId is required to send a ZkSync transaction");
    }

    console.log("sendZkSyncTransaction", transaction);

    const pmDataResult = await this.httpRpcClient?.zkPaymasterData(transaction);
    const zkTx = {
      txType: 0x71,
      from: BigInt(transaction.from || (await this.getAddress())).toString(),
      to: BigInt(transaction.to || "0x0").toString(),
      gasLimit: transaction.gasLimit,
      gasPerPubdataByteLimit: 50000,
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
      paymaster: BigInt(pmDataResult.paymaster).toString(),
      nonce: transaction.nonce,
      value: transaction.value,
      data: transaction.data || "0x",
      factoryDeps: [],
      paymasterInput: ethers.utils.arrayify(pmDataResult.paymasterInput),
    };

    console.log("zkTx", zkTx);

    const EIP712_TYPES = {
      Transaction: [
        { name: "txType", type: "uint256" },
        { name: "from", type: "uint256" },
        { name: "to", type: "uint256" },
        { name: "gasLimit", type: "uint256" },
        { name: "gasPerPubdataByteLimit", type: "uint256" },
        { name: "maxFeePerGas", type: "uint256" },
        { name: "maxPriorityFeePerGas", type: "uint256" },
        { name: "paymaster", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "factoryDeps", type: "bytes32[]" },
        { name: "paymasterInput", type: "bytes" },
      ],
    };

    console.log("EIP712_TYPES", EIP712_TYPES);

    const signature = (
      await signTypedDataInternal(
        this,
        {
          name: "zkSync",
          version: "2",
          chainId: transaction.chainId as number,
        } as any,
        EIP712_TYPES,
        zkTx,
      )
    ).signature;

    console.log("signature", signature);

    transaction.customData = {
      factoryDeps: [],
      paymasterParams: {
        paymaster: pmDataResult.paymaster,
        paymasterInput: pmDataResult.paymasterInput,
      } as Eip712Meta,
    };

    transaction.type = 0x71;
    transaction.gasLimit = 25000000;
    transaction.maxFeePerGas = 25000000;
    transaction.maxPriorityFeePerGas = 25000000;

    console.log("finalTx", transaction);

    const serializedTx = this.serialize(transaction, signature);

    console.log("serializedTx", serializedTx);

    const zkSignedTx: ZkTransactionInput = {
      from: transaction.from?.toString() || (await this.getAddress()),
      to: transaction.to?.toString() || "",
      gas: transaction.gasLimit?.toString() || "",
      maxFeePerGas: transaction.maxFeePerGas?.toString() || "0",
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString() || "0",
      signedTransaction: serializedTx,
      paymaster: pmDataResult.paymaster,
    };

    console.log("zkSignedTx", zkSignedTx);

    const broadcastResult =
      await this.httpRpcClient?.zkBroadcastTransaction(zkSignedTx);

    console.log("broadcastResult", broadcastResult);

    const hash = broadcastResult.transactionHash;
    return (await this.provider?.getTransaction(
      hash,
    )) as ethers.providers.TransactionResponse;
  }

  serialize(
    transaction: ethers.providers.TransactionRequest,
    signature?: any,
  ): string {
    if (!transaction.customData && transaction.type !== 0x71) {
      return ethers.utils.serializeTransaction(
        transaction as ethers.PopulatedTransaction,
        signature,
      );
    }
    if (!transaction.chainId) {
      throw Error("Transaction chainId isn't set!");
    }

    function formatNumber(value: BigNumberish, name: string): Uint8Array {
      const result = ethers.utils.stripZeros(
        BigNumber.from(value).toHexString(),
      );
      if (result.length > 32) {
        throw new Error(`Invalid length for ${name}!`);
      }
      return result;
    }

    if (!transaction.from) {
      throw new Error(
        "Explicitly providing `from` field is required for EIP712 transactions!",
      );
    }
    const from = transaction.from;

    const meta: Eip712Meta = transaction.customData ?? {};

    const maxFeePerGas = transaction.maxFeePerGas || transaction.gasPrice || 0;
    const maxPriorityFeePerGas =
      transaction.maxPriorityFeePerGas || maxFeePerGas;

    const fields: any[] = [
      formatNumber(transaction.nonce || 0, "nonce"),
      formatNumber(maxPriorityFeePerGas, "maxPriorityFeePerGas"),
      formatNumber(maxFeePerGas, "maxFeePerGas"),
      formatNumber(transaction.gasLimit || 0, "gasLimit"),
      transaction.to ? ethers.utils.getAddress(transaction.to) : "0x",
      formatNumber(transaction.value || 0, "value"),
      transaction.data || "0x",
    ];

    if (signature) {
      const sig = ethers.utils.splitSignature(signature);
      fields.push(formatNumber(sig.recoveryParam, "recoveryParam"));
      fields.push(ethers.utils.stripZeros(sig.r));
      fields.push(ethers.utils.stripZeros(sig.s));
    } else {
      fields.push(formatNumber(transaction.chainId, "chainId"));
      fields.push("0x");
      fields.push("0x");
    }
    fields.push(formatNumber(transaction.chainId, "chainId"));
    fields.push(ethers.utils.getAddress(from));

    // Add meta
    fields.push(formatNumber(meta.gasPerPubdata || 50000, "gasPerPubdata"));
    fields.push(
      (meta.factoryDeps ?? []).map(
        (
          dep: number | bigint | ethers.utils.BytesLike | ethers.utils.Hexable,
        ) => ethers.utils.hexlify(dep),
      ),
    );

    if (
      meta.customSignature &&
      ethers.utils.arrayify(meta.customSignature).length === 0
    ) {
      throw new Error("Empty signatures are not supported!");
    }
    fields.push(meta.customSignature || "0x");

    if (meta.paymasterParams) {
      fields.push([
        meta.paymasterParams.paymaster,
        ethers.utils.hexlify(meta.paymasterParams.paymasterInput),
      ]);
    } else {
      fields.push([]);
    }

    return ethers.utils.hexConcat([[0x71], ethers.utils.RLP.encode(fields)]);
  }
}

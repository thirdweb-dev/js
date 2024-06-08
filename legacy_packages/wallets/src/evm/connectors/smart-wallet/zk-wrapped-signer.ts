import {
  Bytes,
  Signer,
  providers,
  TypedDataDomain,
  TypedDataField,
  ethers,
  BigNumber,
  BigNumberish,
  utils,
} from "ethers";
import { BytesLike, Deferrable, defineReadOnly } from "ethers/lib/utils";
import { HttpRpcClient } from "./lib/http-rpc-client";
import { ZkTransactionInput } from "./types";

type Eip712Meta = {
  gasPerPubdata?: BigNumberish;
  factoryDeps?: BytesLike[];
  customSignature?: BytesLike;
  paymasterParams?: PaymasterParams;
};

type PaymasterParams = {
  paymaster: string;
  paymasterInput: BytesLike;
};

type EIP712Transaction = {
  txType: number;
  from: string;
  to: string;
  gasLimit: number;
  gasPerPubdataByteLimit: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  paymaster: string;
  nonce: number;
  value: number;
  data: BytesLike;
  factoryDeps: BytesLike[];
  paymasterInput: BytesLike;
};

const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;

const EIP712_TX_TYPE = 0x71;

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
    let transaction = await this.populateTransaction(_transaction);
    if (!transaction.chainId) {
      throw new Error("ChainId is required to send a ZkSync transaction");
    }

    if (!this.provider) {
      throw new Error("Provider is required to send a ZkSync transaction");
    }

    const address = await this.getAddress();
    const gasLimit = ethers.BigNumber.from(
      transaction.gasLimit || (await this.provider.estimateGas(transaction)),
    ).mul(3);
    const gasPrice = ethers.BigNumber.from(
      transaction.gasPrice || (await this.provider.getGasPrice()),
    ).mul(2);

    if (!transaction.maxFeePerGas) {
      transaction.maxFeePerGas = gasPrice;
    } else {
      transaction.maxFeePerGas = (
        transaction.maxFeePerGas as ethers.BigNumber
      ).mul(2);
    }

    if (!transaction.maxPriorityFeePerGas) {
      transaction.maxPriorityFeePerGas = gasPrice;
    } else {
      transaction.maxPriorityFeePerGas = (
        transaction.maxPriorityFeePerGas as ethers.BigNumber
      ).mul(2);
    }

    transaction = {
      ...transaction,
      from: address,
      gasLimit,
      gasPrice,
      chainId: (await this.provider.getNetwork()).chainId,
      nonce: await this.provider.getTransactionCount(address),
      type: 113,
      value: BigInt(0),
    };

    const pmDataResult = await this.httpRpcClient?.zkPaymasterData(transaction);

    transaction.customData = {
      gasPerPubdata: DEFAULT_GAS_PER_PUBDATA_LIMIT,
      factoryDeps: [],
      paymasterParams: {
        paymaster: pmDataResult.paymaster,
        paymasterInput: pmDataResult.paymasterInput,
      } as Eip712Meta,
    };

    const eip712tx: EIP712Transaction = {
      txType: EIP712_TX_TYPE,
      from: BigInt(transaction.from || (await this.getAddress())).toString(),
      to: BigInt(transaction.to || "0x0").toString(),
      gasLimit: transaction.gasLimit ? Number(transaction.gasLimit) : 0,
      gasPerPubdataByteLimit: DEFAULT_GAS_PER_PUBDATA_LIMIT,
      maxFeePerGas: ethers.BigNumber.from(transaction.maxFeePerGas).toNumber(),
      maxPriorityFeePerGas: ethers.BigNumber.from(
        transaction.maxPriorityFeePerGas,
      ).toNumber(),
      paymaster: BigInt(pmDataResult.paymaster).toString(),
      nonce: ethers.BigNumber.from(transaction.nonce).toNumber(),
      value: ethers.BigNumber.from(transaction.value).toNumber(),
      data: transaction.data || "0x",
      factoryDeps: [],
      paymasterInput: ethers.utils.arrayify(pmDataResult.paymasterInput),
    };

    const signature = await this._signTypedData(
      {
        name: "zkSync",
        version: "2",
        chainId: transaction.chainId as number,
      },
      EIP712_TYPES,
      eip712tx,
    );

    const serializedTx = this.serialize(transaction, signature);

    const zkSignedTx: ZkTransactionInput = {
      from: transaction.from?.toString() || (await this.getAddress()),
      to: transaction.to?.toString() || "",
      gas: transaction.gasLimit?.toString() || "",
      maxFeePerGas: transaction.maxFeePerGas?.toString() || "0",
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString() || "0",
      signedTransaction: serializedTx,
      paymaster: pmDataResult.paymaster,
    };

    const broadcastResult =
      await this.httpRpcClient?.zkBroadcastTransaction(zkSignedTx);

    const hash = broadcastResult.transactionHash;
    return (await this.provider?.getTransaction(
      hash,
    )) as ethers.providers.TransactionResponse;
  }

  serialize(
    transaction: ethers.providers.TransactionRequest,
    signature?: string,
  ): string {
    if (!transaction.customData && transaction.type !== EIP712_TX_TYPE) {
      return utils.serializeTransaction(
        transaction as ethers.PopulatedTransaction,
        signature,
      );
    }
    if (!transaction.chainId) {
      throw Error("Transaction chainId isn't set!");
    }

    function formatNumber(value: BigNumberish, name: string): Uint8Array {
      const result = utils.stripZeros(BigNumber.from(value).toHexString());
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
      transaction.to ? utils.getAddress(transaction.to) : "0x",
      formatNumber(transaction.value || 0, "value"),
      transaction.data || "0x",
    ];

    if (signature) {
      const sig = utils.splitSignature(signature);
      fields.push(formatNumber(sig.recoveryParam, "recoveryParam"));
      fields.push(utils.stripZeros(sig.r));
      fields.push(utils.stripZeros(sig.s));
    } else {
      fields.push(formatNumber(transaction.chainId, "chainId"));
      fields.push("0x");
      fields.push("0x");
    }
    fields.push(formatNumber(transaction.chainId, "chainId"));
    fields.push(utils.getAddress(from));

    // Add meta
    fields.push(
      formatNumber(
        meta.gasPerPubdata || DEFAULT_GAS_PER_PUBDATA_LIMIT,
        "gasPerPubdata",
      ),
    );
    fields.push((meta.factoryDeps ?? []).map((dep) => utils.hexlify(dep)));

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

    return utils.hexConcat([[EIP712_TX_TYPE], utils.RLP.encode(fields)]);
  }
}

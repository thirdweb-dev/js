import type { TransactionSerializable } from "viem";
import type { Address } from "../../../utils/address.js";
import type {
  EIP712SerializedTransaction,
  EIP712TransactionOptions,
} from "../../prepare-transaction.js";

export type EIP721TransactionSerializable = TransactionSerializable & {
  from: Address;
} & EIP712TransactionOptions;
export const gasPerPubdataDefault = 50000n;

export const getEip712Domain = (transaction: EIP721TransactionSerializable) => {
  const message = transactionToMessage(transaction);

  return {
    domain: {
      name: "zkSync",
      version: "2",
      chainId: transaction.chainId,
    },
    types: {
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
    },
    primaryType: "Transaction",
    message: message,
  };
};

function transactionToMessage(
  transaction: EIP721TransactionSerializable,
): EIP712SerializedTransaction {
  const {
    gas,
    nonce,
    to,
    from,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    paymaster,
    paymasterInput,
    gasPerPubdata,
    data,
  } = transaction;

  return {
    txType: 113n,
    from: BigInt(from),
    to: to ? BigInt(to) : 0n,
    gasLimit: gas ?? 0n,
    gasPerPubdataByteLimit: gasPerPubdata ?? gasPerPubdataDefault,
    maxFeePerGas: maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
    paymaster: paymaster ? BigInt(paymaster) : 0n,
    nonce: nonce ? BigInt(nonce) : 0n,
    value: value ?? 0n,
    data: data ? data : "0x0",
    // TODO suport factoryDeps
    factoryDeps: [],
    paymasterInput: paymasterInput ? paymasterInput : "0x",
  };
}

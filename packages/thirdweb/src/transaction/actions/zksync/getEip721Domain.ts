import { hashBytecode } from "viem/zksync";
import type { Address } from "../../../utils/address.js";
import { toHex } from "../../../utils/encoding/hex.js";
import type {
  EIP712SerializedTransaction,
  EIP712TransactionOptions,
} from "../../prepare-transaction.js";
import type { SerializableTransaction } from "../../serialize-transaction.js";

export type EIP721TransactionSerializable = SerializableTransaction & {
  from: Address;
} & EIP712TransactionOptions;
export const gasPerPubdataDefault = 50000n;

export const getEip712Domain = (transaction: EIP721TransactionSerializable) => {
  const message = transactionToMessage(transaction);

  return {
    domain: {
      chainId: transaction.chainId,
      name: "zkSync",
      version: "2",
    },
    message: message,
    primaryType: "Transaction",
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
    factoryDeps,
  } = transaction;

  return {
    data: data ? data : "0x0",
    factoryDeps: factoryDeps?.map((dep) => toHex(hashBytecode(dep))) ?? [],
    from: BigInt(from),
    gasLimit: gas ?? 0n,
    gasPerPubdataByteLimit: gasPerPubdata ?? gasPerPubdataDefault,
    maxFeePerGas: maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
    nonce: nonce ? BigInt(nonce) : 0n,
    paymaster: paymaster ? BigInt(paymaster) : 0n,
    paymasterInput: paymasterInput ? paymasterInput : "0x",
    to: to ? BigInt(to) : 0n,
    txType: 113n,
    value: value ?? 0n,
  };
}

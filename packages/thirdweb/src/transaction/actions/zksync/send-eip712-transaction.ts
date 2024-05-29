import { toRlp } from "viem";
import { eth_sendRawTransaction } from "../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { toBigInt } from "../../../utils/bigint.js";
import { concatHex } from "../../../utils/encoding/helpers/concat-hex.js";
import { type Hex, numberToHex, toHex } from "../../../utils/encoding/hex.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../prepare-transaction.js";
import { encode } from "../encode.js";
import { toSerializableTransaction } from "../to-serializable-transaction.js";
import type { WaitForReceiptOptions } from "../wait-for-tx-receipt.js";
import {
  type EIP721TransactionSerializable,
  gasPerPubdataDefault,
  getEip712Domain,
} from "./getEip721Domain.js";

export type SendEip712TransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
};

/**
 * Sends a transaction using the provided wallet.
 * @param options - The options for sending the transaction.
 * @returns A promise that resolves to the transaction hash.
 * @throws An error if the wallet is not connected.
 * @transaction
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 *
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction
 * });
 * ```
 */
export async function sendEip712Transaction(
  options: SendEip712TransactionOptions,
): Promise<WaitForReceiptOptions> {
  const { account, transaction } = options;

  let [
    data,
    to,
    value,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasPerPubdata,
  ] = await Promise.all([
    encode(transaction),
    resolvePromisedValue(transaction.to),
    resolvePromisedValue(transaction.value),
    resolvePromisedValue(transaction.gas),
    resolvePromisedValue(transaction.maxFeePerGas),
    resolvePromisedValue(transaction.maxPriorityFeePerGas),
    resolvePromisedValue(transaction.eip712).then(
      (eip712) => eip712?.gasPerPubdata,
    ),
  ]);
  if (!gas || !maxFeePerGas || !maxPriorityFeePerGas) {
    // fetch fees and gas
    const rpc = getRpcClient(transaction);
    const result = (await rpc({
      // biome-ignore lint/suspicious/noExplicitAny: TODO add to RPC method types
      method: "zks_estimateFee" as any,
      params: [
        {
          from: account.address,
          to,
          data,
          value: value ? numberToHex(value) : undefined,
          // biome-ignore lint/suspicious/noExplicitAny: TODO add to RPC method types
        } as any,
      ],
    })) as {
      gas_limit: string;
      max_fee_per_gas: string;
      max_priority_fee_per_gas: string;
      gas_per_pubdata_limit: string;
    };
    gas = toBigInt(result.gas_limit);
    maxFeePerGas = toBigInt(result.max_fee_per_gas);
    maxPriorityFeePerGas = toBigInt(result.max_priority_fee_per_gas);
    gasPerPubdata = toBigInt(result.gas_per_pubdata_limit);
  }

  // serialize the transaction (with fees, gas, nonce)
  const serializableTransaction = await toSerializableTransaction({
    transaction: {
      ...transaction,
      gas,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
    from: account.address,
  });

  const eip712Transaction = {
    ...serializableTransaction,
    ...options.transaction.eip712,
    gasPerPubdata,
    from: account.address as Hex,
  };

  // EIP712 signing of the serialized tx
  const eip712Domain = getEip712Domain(eip712Transaction);

  const customSignature = await account.signTypedData({
    // biome-ignore lint/suspicious/noExplicitAny: TODO type properly
    ...(eip712Domain as any),
  });

  const hash = serializeTransactionEIP712({
    ...eip712Transaction,
    customSignature,
  });

  const rpc = getRpcClient(transaction);
  const result = await eth_sendRawTransaction(rpc, hash);

  return {
    transactionHash: result,
    chain: transaction.chain,
    client: transaction.client,
  };
}

function serializeTransactionEIP712(
  transaction: EIP721TransactionSerializable & {
    chainId: number;
    customSignature: Hex;
  },
): Hex {
  const {
    chainId,
    gas,
    nonce,
    to,
    from,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    customSignature,
    factoryDeps,
    paymaster,
    paymasterInput,
    gasPerPubdata,
    data,
  } = transaction;

  const serializedTransaction = [
    nonce ? toHex(nonce) : "0x",
    maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? toHex(maxFeePerGas) : "0x",
    gas ? toHex(gas) : "0x",
    to ?? "0x",
    value ? toHex(value) : "0x",
    data ?? "0x0",
    toHex(chainId),
    toHex(""),
    toHex(""),
    toHex(chainId),
    from ?? "0x",
    gasPerPubdata ? toHex(gasPerPubdata) : toHex(gasPerPubdataDefault),
    factoryDeps ?? [],
    customSignature ?? "0x", // EIP712 signature
    paymaster && paymasterInput ? [paymaster, paymasterInput] : [],
  ];

  // @ts-ignore - TODO: fix types
  return concatHex(["0x71", toRlp(serializedTransaction)]);
}

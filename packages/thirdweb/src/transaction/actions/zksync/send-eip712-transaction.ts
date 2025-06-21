import { hexToBytes, toRlp } from "viem";
import { eth_sendRawTransaction } from "../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { type Address, getAddress } from "../../../utils/address.js";
import { replaceBigInts, toBigInt } from "../../../utils/bigint.js";
import { concatHex } from "../../../utils/encoding/helpers/concat-hex.js";
import { type Hex, toHex } from "../../../utils/encoding/hex.js";
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

type SendEip712TransactionOptions = {
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

  const eip712Transaction = await populateEip712Transaction(options);

  const hash = await signEip712Transaction({
    account,
    chainId: transaction.chain.id,
    eip712Transaction,
  });

  const rpc = getRpcClient(transaction);
  const result = await eth_sendRawTransaction(rpc, hash);

  return {
    chain: transaction.chain,
    client: transaction.client,
    transactionHash: result,
  };
}

export async function signEip712Transaction(options: {
  account: Account;
  eip712Transaction: EIP721TransactionSerializable;
  chainId: number;
}): Promise<Hex> {
  const { account, eip712Transaction, chainId } = options;
  // EIP712 signing of the serialized tx
  const eip712Domain = getEip712Domain(eip712Transaction);

  const customSignature = await account.signTypedData({
    // biome-ignore lint/suspicious/noExplicitAny: TODO type properly
    ...(eip712Domain as any),
  });

  return serializeTransactionEIP712({
    ...eip712Transaction,
    chainId,
    customSignature,
  });
}

/**
 * Populate a prepared transaction to be serialized as a EIP712 transaction
 * @param options
 * @internal
 */
export async function populateEip712Transaction(
  options: SendEip712TransactionOptions,
): Promise<EIP721TransactionSerializable> {
  const { account, transaction } = options;
  const { gas, maxFeePerGas, maxPriorityFeePerGas, gasPerPubdata } =
    await getZkGasFees({ from: getAddress(account.address), transaction });

  // serialize the transaction (with fees, gas, nonce)
  const serializableTransaction = await toSerializableTransaction({
    from: account.address,
    transaction: {
      ...transaction,
      gas,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  });

  return {
    ...serializableTransaction,
    ...transaction.eip712,
    from: account.address as Hex,
    gasPerPubdata,
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

export async function getZkGasFees(args: {
  transaction: PreparedTransaction;
  from?: Address;
}) {
  const { transaction, from } = args;
  let [gas, maxFeePerGas, maxPriorityFeePerGas, eip712] = await Promise.all([
    resolvePromisedValue(transaction.gas),
    resolvePromisedValue(transaction.maxFeePerGas),
    resolvePromisedValue(transaction.maxPriorityFeePerGas),
    resolvePromisedValue(transaction.eip712),
  ]);
  let gasPerPubdata = eip712?.gasPerPubdata;
  if (
    gas === undefined ||
    maxFeePerGas === undefined ||
    maxPriorityFeePerGas === undefined
  ) {
    const rpc = getRpcClient(transaction);
    const params = await formatTransaction({ from, transaction });
    const result = (await rpc({
      // biome-ignore lint/suspicious/noExplicitAny: TODO add to RPC method types
      method: "zks_estimateFee" as any,
      // biome-ignore lint/suspicious/noExplicitAny: TODO add to RPC method types
      params: [replaceBigInts(params, toHex)] as any,
    })) as {
      gas_limit: string;
      max_fee_per_gas: string;
      max_priority_fee_per_gas: string;
      gas_per_pubdata_limit: string;
    };
    gas = toBigInt(result.gas_limit) * 2n; // overestimating to avoid issues when not accounting for paymaster extra gas ( we should really pass the paymaster input above for better accuracy )
    const baseFee = toBigInt(result.max_fee_per_gas);
    maxFeePerGas = baseFee * 2n; // bumping the base fee per gas to ensure fast inclusion
    maxPriorityFeePerGas = toBigInt(result.max_priority_fee_per_gas) || 1n;
    gasPerPubdata = toBigInt(result.gas_per_pubdata_limit) * 2n; // doubling for fast inclusion;
    if (gasPerPubdata < 50000n) {
      // enforce a minimum gas per pubdata limit
      gasPerPubdata = 50000n;
    }
  }
  return {
    gas,
    gasPerPubdata,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
}

async function formatTransaction(args: {
  transaction: PreparedTransaction;
  from?: Address;
}) {
  const { transaction, from } = args;
  const [data, to, value, eip712] = await Promise.all([
    encode(transaction),
    resolvePromisedValue(transaction.to),
    resolvePromisedValue(transaction.value),
    resolvePromisedValue(transaction.eip712),
  ]);
  const gasPerPubdata = eip712?.gasPerPubdata;
  return {
    data,
    eip712Meta: {
      ...eip712,
      factoryDeps: eip712?.factoryDeps?.map((dep) =>
        Array.from(hexToBytes(dep)),
      ),
      gasPerPubdata: gasPerPubdata || 50000n,
    },
    from,
    gasPerPubdata,
    to,
    type: "0x71",
    value,
  };
}

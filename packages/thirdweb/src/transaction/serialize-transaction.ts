import {
  type ExactPartial,
  type SerializedTransactionReturnType,
  type Signature,
  type TransactionSerializable,
  type TransactionSerializableEIP1559,
  type TransactionSerializableEIP2930,
  type TransactionSerializableEIP4844,
  type TransactionSerializableLegacy,
  type TransactionSerializedEIP1559,
  type TransactionSerializedEIP2930,
  type TransactionSerializedLegacy,
  serializeTransaction as _serializeTransaction,
  assertTransactionEIP1559,
  assertTransactionEIP2930,
  assertTransactionLegacy,
  serializeAccessList,
  toRlp,
} from "viem";
import { trim } from "../utils/encoding/helpers/trim.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";

export type SerializeTransactionOptions<
  _transaction extends TransactionSerializable,
> = {
  transaction: _transaction;
};

/**
 * Serializes a legacy, EIP-1559, EIP-2930, or EIP-4844 transaction object.
 *
 * @param options - The serialization options.
 * @param options.transaction - The transaction object to be serialized, including the signature parameters if necessary.
 * @returns The serialized transaction.
 * @throws An error if the provided transaction object is invalid.
 * @transaction
 * @example
 * ```ts
 * import { serializeTransaction } from "thirdweb";
 *
 * const serializedTransaction = serializeTransaction({ transaction: {
 *    to: "0x",
 *    value: 0n,
 *  }
 * });
 * ```
 */
export function serializeTransaction<
  _transaction extends TransactionSerializable,
>(
  options: SerializeTransactionOptions<_transaction>,
): SerializedTransactionReturnType<_transaction> {
  const { transaction } = options;

  if (
    transaction.type === "eip4844" || // explicit type checks required for viem parity
    typeof transaction.blobs !== "undefined" ||
    typeof transaction.blobVersionedHashes !== "undefined" ||
    typeof transaction.maxFeePerBlobGas !== "undefined" ||
    typeof transaction.sidecars !== "undefined"
  ) {
    // default to viem's 4844 serialization until we have blob utilities
    return _serializeTransaction<TransactionSerializableEIP4844>(
      transaction,
    ) as SerializedTransactionReturnType<_transaction>;
  }

  if (
    transaction.type === "eip1559" ||
    typeof transaction.maxFeePerGas !== "undefined" ||
    typeof transaction.maxPriorityFeePerGas !== "undefined"
  ) {
    return serializeEIP1559Transaction({
      transaction,
    }) as SerializedTransactionReturnType<_transaction>;
  }

  if (
    transaction.type === "eip2930" ||
    (typeof transaction.gasPrice !== "undefined" &&
      typeof transaction.accessList !== "undefined")
  ) {
    return serializeEIP2930Transaction({
      transaction,
    }) as SerializedTransactionReturnType<_transaction>;
  }

  if (
    transaction.type === "legacy" ||
    typeof transaction.gasPrice !== "undefined"
  ) {
    return serializeTransactionLegacy({
      transaction: transaction as TransactionSerializableLegacy,
    }) as SerializedTransactionReturnType<_transaction>;
  }

  throw new Error(
    `Invalid transaction to serialize.\n\n${JSON.stringify(
      transaction,
      (_, v) => (typeof v === "bigint" ? `${v.toString()}n` : v),
      2,
    )}`,
  );
}

type SerializeEIP1559TransactionOptions = {
  transaction: TransactionSerializableEIP1559;
};

function serializeEIP1559Transaction(
  options: SerializeEIP1559TransactionOptions,
): TransactionSerializedEIP1559 {
  assertTransactionEIP1559(options.transaction);

  const {
    transaction: {
      chainId,
      gas,
      nonce,
      to,
      value,
      maxFeePerGas,
      maxPriorityFeePerGas,
      accessList,
      data,
      r,
      s,
      v,
      yParity,
    },
  } = options;

  const serializedAccessList = serializeAccessList(accessList);

  const serializedTransaction = [
    toHex(chainId),
    nonce ? toHex(nonce) : "0x",
    maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? toHex(maxFeePerGas) : "0x",
    gas ? toHex(gas) : "0x",
    // To fix when migrating to our own version of TransactionSerializable (the viem type is downgraded from Address to string when importing)
    (to ?? "0x") as Hex,
    value ? toHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray({ r, s, v, yParity }),
  ];

  return `0x02${toRlp(serializedTransaction).slice(2)}`;
}

type SerializeEIP2930TransactionOptions = {
  transaction: TransactionSerializableEIP2930;
};

function serializeEIP2930Transaction(
  options: SerializeEIP2930TransactionOptions,
): TransactionSerializedEIP2930 {
  assertTransactionEIP2930(options.transaction);

  const {
    transaction: {
      chainId,
      gas,
      gasPrice,
      nonce,
      to,
      value,
      accessList,
      data,
      r,
      s,
      v,
      yParity,
    },
  } = options;

  const serializedAccessList = serializeAccessList(accessList);

  const serializedTransaction = [
    toHex(chainId),
    nonce ? toHex(nonce) : "0x",
    gasPrice ? toHex(gasPrice) : "0x",
    gas ? toHex(gas) : "0x",
    (to ?? "0x") as Hex,
    value ? toHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray({ r, s, v, yParity }),
  ];

  return `0x01${toRlp(serializedTransaction).slice(2)}`;
}

type SerializeLegacyTransactionOptions = {
  transaction: TransactionSerializableLegacy;
};

function serializeTransactionLegacy(
  options: SerializeLegacyTransactionOptions,
): TransactionSerializedLegacy {
  assertTransactionLegacy(options.transaction);

  const {
    chainId = 0,
    gas,
    data,
    nonce,
    to,
    value,
    gasPrice,
    r,
    s,
    v,
  } = options.transaction;

  let serializedTransaction = [
    nonce ? toHex(nonce) : "0x",
    gasPrice ? toHex(gasPrice) : "0x",
    gas ? toHex(gas) : "0x",
    (to ?? "0x") as Hex,
    value ? toHex(value) : "0x",
    data ?? "0x",
  ];

  if (typeof v !== "undefined") {
    const v_ = (() => {
      // EIP-155 (inferred chainId)
      if (v >= 35n) {
        const inferredChainId = (v - 35n) / 2n;
        if (inferredChainId > 0) return v;
        return 27n + (v === 35n ? 0n : 1n);
      }

      // EIP-155 (explicit chainId)
      if (chainId > 0) return BigInt(chainId * 2) + BigInt(35n + v - 27n);

      // Pre-EIP-155 (no chainId)
      const v_ = 27n + (v === 27n ? 0n : 1n);
      if (v !== v_) throw new Error(`Invalid legacy signature value v: ${v}`);
      return v_;
    })();

    if (typeof r === "undefined")
      throw new Error(`Invalid legacy signature value r: ${r}`);
    if (typeof s === "undefined")
      throw new Error(`Invalid legacy signature value s: ${s}`);

    serializedTransaction = [...serializedTransaction, toHex(v_), r, s];
  } else if (chainId > 0) {
    serializedTransaction = [
      ...serializedTransaction,
      toHex(chainId),
      "0x",
      "0x",
    ];
  }

  return toRlp(serializedTransaction) as TransactionSerializedLegacy;
}

export function toYParitySignatureArray(
  signature: ExactPartial<Signature>,
): Hex[] {
  const { r, s, v, yParity } = signature;
  if (typeof r === "undefined") return [];
  if (typeof s === "undefined") return [];
  if (typeof v === "undefined" && typeof yParity === "undefined") return [];

  const yParity_ = (() => {
    if (yParity === 1 || yParity === 0) return yParity ? toHex(1) : "0x";
    if (typeof yParity !== "undefined")
      throw new Error(`Invalid signature value for yParity: ${yParity}`);

    if (v === 0n || v === 27n) return "0x";
    if (v === 1n || v === 28n) return toHex(1);
    throw new Error(`Invalid signature value v: ${v}`);
  })();
  return [yParity_, trim(r), trim(s)];
}

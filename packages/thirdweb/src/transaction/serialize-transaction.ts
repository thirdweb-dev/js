import * as ox__Hex from "ox/Hex";
import * as ox__Signature from "ox/Signature";
import * as ox__TransactionEnvelopeEip1559 from "ox/TransactionEnvelopeEip1559";
import * as ox__TransactionEnvelopeEip2930 from "ox/TransactionEnvelopeEip2930";
import * as ox__TransactionEnvelopeEip7702 from "ox/TransactionEnvelopeEip7702";
import * as ox__TransactionEnvelopeLegacy from "ox/TransactionEnvelopeLegacy";
import type { Hex } from "../utils/encoding/hex.js";

export type SerializableTransaction = {
  type?: string | undefined;
  r?: Hex | bigint;
  s?: Hex | bigint;
  v?: bigint | number;
  yParity?: bigint | number;
  accessList?:
    | ox__TransactionEnvelopeEip2930.TransactionEnvelopeEip2930["accessList"]
    | undefined;
  chainId?: number | undefined;
  gasPrice?: bigint | undefined;
  maxFeePerGas?: bigint | undefined;
  maxPriorityFeePerGas?: bigint | undefined;
  data?: Hex | undefined;
  to?: string | null | undefined; // Must allow null for backwards compatibility
  nonce?: number | bigint | undefined;
  value?: bigint | undefined;
  gas?: bigint | undefined;
  gasLimit?: bigint | undefined;
  authorizationList?:
    | ox__TransactionEnvelopeEip7702.TransactionEnvelopeEip7702["authorizationList"]
    | undefined;
};

export type SerializeTransactionOptions = {
  transaction: SerializableTransaction;
  signature?:
    | ox__Signature.Signature<true, Hex>
    | ox__Signature.Legacy<Hex, bigint>
    | undefined;
};

/**
 * Serializes a legacy, EIP-1559, EIP-2930, EIP-4844, or EIP-7702 transaction object.
 *
 * @param options - The serialization options.
 * @param options.transaction - The transaction object to be serialized.
 * @param [options.signature] - The signature to include with the transaction, if necessary.
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
export function serializeTransaction(
  options: SerializeTransactionOptions,
): Hex {
  const { transaction } = options;

  const type = getTransactionEnvelopeType(transaction);

  // This is to maintain compatibility with our old interface (including the signature in the transaction object)
  const signature = (() => {
    if (options.signature) {
      if (
        "v" in options.signature &&
        typeof options.signature.v !== "undefined"
      ) {
        return ox__Signature.fromLegacy({
          r: ox__Hex.toBigInt(options.signature.r),
          s: ox__Hex.toBigInt(options.signature.s),
          v: Number(options.signature.v),
        });
      }

      return {
        r: ox__Hex.toBigInt(options.signature.r),
        s: ox__Hex.toBigInt(options.signature.s),
        // We force the Signature type here because we filter for legacy type above
        yParity: (options.signature as unknown as ox__Signature.Signature)
          .yParity,
      };
    }
    if (
      typeof transaction.v === "undefined" &&
      typeof transaction.yParity === "undefined"
    ) {
      return undefined;
    }

    if (transaction.r === undefined || transaction.s === undefined) {
      throw new Error("Invalid signature provided with transaction");
    }

    return {
      r:
        typeof transaction.r === "bigint"
          ? transaction.r
          : ox__Hex.toBigInt(transaction.r),
      s:
        typeof transaction.s === "bigint"
          ? transaction.s
          : ox__Hex.toBigInt(transaction.s),
      yParity:
        typeof transaction.v !== "undefined" &&
        typeof transaction.yParity === "undefined"
          ? ox__Signature.vToYParity(Number(transaction.v))
          : Number(transaction.yParity),
    };
  })();

  if (type === "eip1559") {
    const typedTransaction =
      transaction as ox__TransactionEnvelopeEip1559.TransactionEnvelopeEip1559;
    ox__TransactionEnvelopeEip1559.assert(typedTransaction);

    return ox__TransactionEnvelopeEip1559.serialize(typedTransaction, {
      signature,
    });
  }

  if (type === "legacy") {
    const typedTransaction =
      transaction as ox__TransactionEnvelopeLegacy.TransactionEnvelopeLegacy;
    ox__TransactionEnvelopeLegacy.assert(typedTransaction);

    return ox__TransactionEnvelopeLegacy.serialize(typedTransaction, {
      signature,
    });
  }

  if (type === "eip2930") {
    const typedTransaction =
      transaction as ox__TransactionEnvelopeEip2930.TransactionEnvelopeEip2930;
    ox__TransactionEnvelopeEip2930.assert(typedTransaction);

    return ox__TransactionEnvelopeEip2930.serialize(typedTransaction, {
      signature,
    });
  }

  if (type === "eip7702") {
    const typedTransaction =
      transaction as ox__TransactionEnvelopeEip7702.TransactionEnvelopeEip7702;
    ox__TransactionEnvelopeEip7702.assert(typedTransaction);

    return ox__TransactionEnvelopeEip7702.serialize(typedTransaction, {
      signature,
    });
  }

  throw new Error("Invalid transaction type");
}

/**
 * @internal
 */
function getTransactionEnvelopeType(
  transactionEnvelope: SerializableTransaction,
) {
  if (typeof transactionEnvelope.type !== "undefined") {
    return transactionEnvelope.type;
  }

  if (typeof transactionEnvelope.authorizationList !== "undefined") {
    return "eip7702";
  }

  if (
    typeof transactionEnvelope.maxFeePerGas !== "undefined" ||
    typeof transactionEnvelope.maxPriorityFeePerGas !== "undefined"
  ) {
    return "eip1559";
  }

  if (typeof transactionEnvelope.gasPrice !== "undefined") {
    if (typeof transactionEnvelope.accessList !== "undefined") {
      return "eip2930";
    }
    return "legacy";
  }

  throw new Error("Invalid transaction type");
}

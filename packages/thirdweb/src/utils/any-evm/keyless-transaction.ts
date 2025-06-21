import * as ox__Hash from "ox/Hash";
import * as ox__Hex from "ox/Hex";
import * as ox__Signature from "ox/Signature";
import { recoverAddress } from "viem";
import {
  type SerializableTransaction,
  serializeTransaction,
} from "../../transaction/serialize-transaction.js";
import type { Hex } from "../encoding/hex.js";

type GetKeylessTransactionOptions = {
  transaction: SerializableTransaction;
  signature:
    | ox__Signature.Signature<true, Hex>
    | ox__Signature.Legacy<Hex, bigint>;
};

/**
 * Retrieves the keyless transaction information.
 *
 * @param options - The options for retrieving the keyless transaction.
 * @returns An object containing the signer address and the signed serialized transaction string.
 * @internal
 */
export async function getKeylessTransaction(
  options: GetKeylessTransactionOptions,
) {
  // 1. Create serialized txn string
  const hash = ox__Hash.keccak256(
    serializeTransaction({ transaction: options.transaction }),
  );

  const yParity = (() => {
    if (
      "yParity" in options.signature &&
      typeof options.signature.yParity !== "undefined"
    ) {
      return options.signature.yParity;
    }

    if (
      "v" in options.signature &&
      typeof options.signature.v !== "undefined"
    ) {
      return ox__Signature.vToYParity(Number(options.signature.v));
    }

    throw new Error(
      "Invalid recovered signature provided with transaction, missing v or yParity",
    );
  })();

  // 2. Determine signer address from custom signature + txn
  const address = await recoverAddress({
    hash,
    signature: ox__Signature.toHex({
      r: ox__Hex.toBigInt(options.signature.r),
      s: ox__Hex.toBigInt(options.signature.s),
      yParity,
    }),
  });

  // 3. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const transaction = serializeTransaction({
    signature: options.signature,
    transaction: options.transaction,
  });

  return {
    signerAddress: address,
    transaction,
  };
}

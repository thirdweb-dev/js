import { sign } from "../../utils/signatures/sign.js";
import type { Hex } from "../../utils/encoding/hex.js";
import { keccak256 } from "../../utils/hashing/keccak256.js";
import { serializeTransaction, type TransactionSerializable } from "viem";

export type SignTransactionOptions = {
  transaction: TransactionSerializable;
  privateKey: Hex;
  // TODO: Add optional custom serializer here
};

// TODO: Setup more advanced transaction result typing
export function signTransaction(options: SignTransactionOptions): Hex {
  // We don't need to worry about sidecars yet since we're on an older version of viem
  // TODO: Add eip4844 type check when upgrading viem past 2.8.0

  const serializedTransaction = serializeTransaction(options.transaction);

  const signature = sign({
    hash: keccak256(serializedTransaction),
    privateKey: options.privateKey,
  });
  return serializeTransaction(options.transaction, signature);
}

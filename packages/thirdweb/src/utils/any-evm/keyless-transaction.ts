import {
  type Signature,
  type TransactionSerializable,
  recoverAddress,
  serializeTransaction,
  signatureToHex,
} from "viem";
import { keccak256 } from "../hashing/keccak256.js";

type GetKeylessTransactionOptions = {
  transaction: TransactionSerializable;
  signature: Signature;
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
  const hash = keccak256(serializeTransaction(options.transaction));

  // 2. Determine signer address from custom signature + txn
  const address = await recoverAddress({
    hash,
    signature: signatureToHex(options.signature),
  });

  // 3. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const transaction = serializeTransaction(
    options.transaction,
    options.signature,
  );

  return {
    signerAddress: address,
    transaction,
  };
}

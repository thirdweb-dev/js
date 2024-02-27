import { utils, type UnsignedTransaction } from "ethers";
import { KeylessTransaction } from "../../types/any-evm/deploy-data";

/**
 * Generate a transaction to be sent with a keyless signer.
 * @deploy
 * @public
 * @param transaction - Unsigned transaction object
 * @param signature - Signature bytes
 */
export function getKeylessTxn(
  transaction: UnsignedTransaction,
  signature: string,
): KeylessTransaction {
  // 1. Create serialized txn string
  const digest = utils.arrayify(
    utils.keccak256(utils.serializeTransaction(transaction)),
  );

  // 2. Determine signer address from custom signature + txn
  const signer = utils.recoverAddress(digest, signature);

  // 3. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const signedSerializedTx = utils.serializeTransaction(transaction, signature);

  return {
    signer: signer,
    transaction: signedSerializedTx,
  };
}

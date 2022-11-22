import { TransactionResult } from "../types/common";
import {
  getSignerHistogram,
  Metaplex,
  TransactionBuilder,
} from "@metaplex-foundation/js";

export async function sendMultipartTransaction(
  builders: TransactionBuilder[],
  metaplex: Metaplex,
): Promise<TransactionResult[]> {
  const block = await metaplex.connection.getLatestBlockhash();
  const txns = builders.map((builder) => {
    const builderTx = builder.setFeePayer(metaplex.identity());

    const dropSigners = [metaplex.identity(), ...builderTx.getSigners()];
    const { keypairs } = getSignerHistogram(dropSigners);
    const tx = builderTx.toTransaction({
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
    });

    if (keypairs.length > 0) {
      tx.partialSign(...keypairs);
    }
    return tx;
  });

  // make the connected wallet sign all transactions
  const signedTx = await metaplex.identity().signAllTransactions(txns);

  // send the signed transactions
  let signatures = [];
  for (const tx of signedTx) {
    const signature = await metaplex.connection.sendRawTransaction(
      tx.serialize(),
    );
    signatures.push(signature);
  }

  // wait for confirmations in parallel
  const confirmations = await Promise.all(
    signatures.map((sig) => {
      return metaplex.rpc().confirmTransaction(sig, {
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
      });
    }),
  );

  if (confirmations.length === 0) {
    throw new Error("Transaction failed");
  }

  return signatures.map((signature) => ({ signature }));
}

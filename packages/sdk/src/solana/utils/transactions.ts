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

  // send the signed transactions in batches
  const batchSize = 200; // sends 200 raw tx in parallel
  const batches = [];
  for (let i = 0; i < signedTx.length; i += batchSize) {
    batches.push(signedTx.slice(i, i + batchSize));
  }
  let signatures: string[][] = [];
  for (const txs of batches) {
    const signature = await Promise.all(
      txs.map((tx) => metaplex.connection.sendRawTransaction(tx.serialize())),
    );
    signatures.push(signature);
  }

  // wait for confirmations in parallel batches
  let confirmations = [];
  for (let i = 0; i < signatures.length; i += 1) {
    await delay(1000); // add delay to avoid rate limiting
    const sigs = signatures[i];
    const confirmationBatch = await Promise.all(
      sigs.map((sig) => {
        return metaplex.rpc().confirmTransaction(sig, {
          blockhash: block.blockhash,
          lastValidBlockHeight: block.lastValidBlockHeight,
        });
      }),
    );
    confirmations.push(...confirmationBatch);
  }

  if (confirmations.length === 0) {
    throw new Error("Transaction failed");
  }

  return signatures.flatMap((sig) => sig).map((signature) => ({ signature }));
}

async function delay(delayMs: number) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

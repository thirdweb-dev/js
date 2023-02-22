import { Transaction } from "../core/classes/transactions";
import { TransactionResult } from "../core/types";

export function buildTransactionFunction<TResult = TransactionResult>(
  fn: (...args: any[]) => Promise<Transaction<TResult>>,
) {
  async function executeFn(...args: any[]): Promise<TResult> {
    const tx = await fn(...args);
    return tx.execute();
  }

  executeFn.transaction = fn;
  return executeFn;
}

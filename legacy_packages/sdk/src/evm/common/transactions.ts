import type {
  DeployTransaction,
  Transaction,
} from "../core/classes/transactions";
import type { TransactionResult } from "../core/types";

export function buildDeployTransactionFunction<TArgs extends any[]>(
  fn: (...args: TArgs) => Promise<DeployTransaction>,
) {
  async function executeFn(...args: TArgs): Promise<string> {
    const tx = await fn(...args);
    return tx.execute();
  }

  executeFn.prepare = fn;
  return executeFn;
}

export function buildTransactionFunction<
  TArgs extends any[],
  TResult = TransactionResult,
>(fn: (...args: TArgs) => Promise<Transaction<TResult>>) {
  async function executeFn(...args: TArgs): Promise<TResult> {
    const tx = await fn(...args);
    return tx.execute();
  }

  executeFn.prepare = fn;
  return executeFn;
}

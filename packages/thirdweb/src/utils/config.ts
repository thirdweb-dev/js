import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import type { Account } from "../wallets/interfaces/wallet.js";

let transactionDecorator:
  | ((args: {
      account: Account;
      transaction: PreparedTransaction;
    }) => Promise<{ account: Account; transaction: PreparedTransaction }>)
  | null = null;

export function setTransactionDecorator(
  decoratorFunction: (args: {
    account: Account;
    transaction: PreparedTransaction;
  }) => Promise<{ account: Account; transaction: PreparedTransaction }>,
) {
  transactionDecorator = decoratorFunction;
}

export function clearTransactionDecorator() {
  transactionDecorator = null;
}

export function getTransactionDecorator() {
  return transactionDecorator;
}

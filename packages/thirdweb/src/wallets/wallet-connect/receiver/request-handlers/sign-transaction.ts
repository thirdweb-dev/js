import {
  type Hex,
  hexToBigInt,
  hexToNumber,
} from "../../../../utils/encoding/hex.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { WalletConnectTransactionRequestParams } from "../types.js";
import { validateAccountAddress } from "../utils.js";

/**
 * @internal
 */
export async function handleSignTransactionRequest(options: {
  account: Account;
  params: WalletConnectTransactionRequestParams;
}): Promise<Hex> {
  const {
    account,
    params: [transaction],
  } = options;

  if (!account.signTransaction) {
    throw new Error(
      "The current account does not support signing transactions",
    );
  }

  if (transaction.from !== undefined) {
    validateAccountAddress(account, transaction.from);
  }

  return account.signTransaction({
    gas: transaction.gas ? hexToBigInt(transaction.gas) : undefined,
    gasPrice: transaction.gasPrice
      ? hexToBigInt(transaction.gasPrice)
      : undefined,
    value: transaction.value ? hexToBigInt(transaction.value) : undefined,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
    to: transaction.to,
    data: transaction.data,
  });
}

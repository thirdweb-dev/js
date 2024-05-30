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
export async function handleSendTransactionRequest(options: {
  account: Account;
  chainId: number;
  params: WalletConnectTransactionRequestParams;
}): Promise<Hex> {
  const {
    account,
    chainId,
    params: [transaction],
  } = options;

  if (transaction.from !== undefined) {
    validateAccountAddress(account, transaction.from);
  }
  const txResult = await account.sendTransaction({
    gas: transaction.gas ? hexToBigInt(transaction.gas) : undefined,
    gasPrice: transaction.gasPrice
      ? hexToBigInt(transaction.gasPrice)
      : undefined,
    value: transaction.value ? hexToBigInt(transaction.value) : undefined,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
    to: transaction.to,
    data: transaction.data,
    chainId,
  });
  return txResult.transactionHash;
}

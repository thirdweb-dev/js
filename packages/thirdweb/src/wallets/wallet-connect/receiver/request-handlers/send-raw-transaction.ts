import type { Hex } from "../../../../utils/encoding/hex.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { WalletConnectRawTransactionRequestParams } from "../types.js";

/**
 * @internal
 */
export async function handleSendRawTransactionRequest(options: {
  account: Account;
  chainId: number;
  params: WalletConnectRawTransactionRequestParams;
}): Promise<Hex> {
  const {
    account,
    chainId,
    params: [rawTransaction],
  } = options;

  if (!account.sendRawTransaction) {
    throw new Error(
      "The current account does not support sending raw transactions",
    );
  }

  const txResult = await account.sendRawTransaction({
    rawTransaction,
    chainId,
  });
  return txResult.transactionHash;
}

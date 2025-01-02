import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { type Hex, hexToBigInt } from "../../../../utils/encoding/hex.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { WalletConnectTransactionRequestParams } from "../types.js";
import { validateAccountAddress } from "../utils.js";

/**
 * @internal
 */
export async function handleSendTransactionRequest(options: {
  account: Account;
  chainId: number;
  thirdwebClient: ThirdwebClient;
  params: WalletConnectTransactionRequestParams;
}): Promise<Hex> {
  const {
    account,
    chainId,
    thirdwebClient,
    params: [transaction],
  } = options;

  if (transaction.from !== undefined) {
    validateAccountAddress(account, transaction.from);
  }

  const preparedTransaction = prepareTransaction({
    gas: transaction.gas ? hexToBigInt(transaction.gas) : undefined,
    gasPrice: transaction.gasPrice
      ? hexToBigInt(transaction.gasPrice)
      : undefined,
    value: transaction.value ? hexToBigInt(transaction.value) : undefined,
    to: transaction.to,
    data: transaction.data,
    chain: getCachedChain(chainId),
    client: thirdwebClient,
  });

  const txResult = await sendTransaction({
    transaction: preparedTransaction,
    account,
  });

  return txResult.transactionHash;
}

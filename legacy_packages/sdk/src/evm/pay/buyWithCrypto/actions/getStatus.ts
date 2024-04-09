import { createThirdwebClient } from "thirdweb";
import type { BuyWithCryptoStatus } from "thirdweb/pay";
import { getBuyWithCryptoStatus as getBuyWithCryptoStatusV5 } from "thirdweb/pay";

export type BuyWithCryptoTransaction = {
  clientId: string;
  transactionHash: string;
};

export { type BuyWithCryptoStatus } from "thirdweb/pay";

/**
 * Gets the status of a buy with crypto transaction
 * @param buyWithCryptoTransaction - Object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @example
 *
 * ```ts
 * import { getBuyWithCryptoStatus, getBuyWithCryptoQuote } @thirdweb-dev/sdk";
 *
 * // get a quote between two tokens
 * const quote = await getBuyWithCryptoQuote(quoteParams);
 * // if approval is required, send the approval transaction
 * if (quote.approval) {
 *   const response = await signer.sendTransaction(quote.approval);
 * }
 * // send the quoted transaction
 * const transactionResult = await signer.sendTransaction(
 *   quote.transactionRequest,
 * );
 * // keep polling the status of the quoted transaction until it * returns a success or failure status
 * const status = await getBuyWithCryptoStatus({
 *   clientId: "YOUR_CLIENT_ID",
 *   transactionHash: transactionResult.hash,
 * });
 * ```
 * @returns Object of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoStatus)
 */
export async function getBuyWithCryptoStatus(
  buyWithCryptoTransaction: BuyWithCryptoTransaction,
): Promise<BuyWithCryptoStatus> {
  return getBuyWithCryptoStatusV5({
    ...buyWithCryptoTransaction,
    client: createThirdwebClient({
      clientId: buyWithCryptoTransaction.clientId,
    }),
  });
}

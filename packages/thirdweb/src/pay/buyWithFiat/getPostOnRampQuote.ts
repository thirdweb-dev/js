import type { ThirdwebClient } from "../../client/client.js";
import {
  getBuyWithCryptoQuote,
  type BuyWithCryptoQuote,
} from "../buyWithCrypto/getQuote.js";
import {
  BuyWithFiatTransactionStatus,
  type BuyWithFiatStatus,
} from "./getStatus.js";

export type GetPostOnRampQuoteParams = {
  client: ThirdwebClient;
  onrampStatus: BuyWithFiatStatus;
};

export async function getPostOnRampQuote({
  client,
  onrampStatus,
}: GetPostOnRampQuoteParams): Promise<BuyWithCryptoQuote | null> {
  if (!("intentId" in onrampStatus)) {
    // transaction not found
    return null;
  }

  if (
    onrampStatus.status === BuyWithFiatTransactionStatus.CRYPTO_SWAP_REQUIRED
  ) {
    return getBuyWithCryptoQuote({
      client,
      fromAddress: onrampStatus.toAddress,
      fromChainId: onrampStatus.quote.onRampToken.chainId,
      fromTokenAddress: onrampStatus.quote.onRampToken.tokenAddress,
      toChainId: onrampStatus.quote.toToken.chainId,
      toTokenAddress: onrampStatus.quote.toToken.tokenAddress,
      toAmount: onrampStatus.quote.estimatedToTokenAmount,
    });
  }

  // nothing to do yet
  return null;
}

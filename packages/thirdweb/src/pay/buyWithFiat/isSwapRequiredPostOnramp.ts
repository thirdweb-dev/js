import type { BuyWithFiatQuote } from "./getQuote.js";

// if the toToken is the same as the onRampToken, no swap is required
export function isSwapRequiredPostOnramp(buyWithFiatQuote: BuyWithFiatQuote) {
  const sameChain =
    buyWithFiatQuote.toToken.chainId ===
    buyWithFiatQuote.onRampToken.token.chainId;

  const sameToken =
    buyWithFiatQuote.toToken.tokenAddress ===
    buyWithFiatQuote.onRampToken.token.tokenAddress;

  return !(sameChain && sameToken);
}

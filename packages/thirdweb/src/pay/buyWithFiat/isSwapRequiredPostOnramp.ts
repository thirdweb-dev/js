import type { BuyWithFiatQuote } from "./getQuote.js";

/**
 * Check if a Swap is required after on-ramp is done when buying a token with fiat currency.
 *
 * @param buyWithFiatQuote - The quote of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote) returned
 * by the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function.
 * @buyFiat
 */
export function isSwapRequiredPostOnramp(
  buyWithFiatQuote: Pick<BuyWithFiatQuote, "toToken" | "onRampToken">,
) {
  const sameChain =
    buyWithFiatQuote.toToken.chainId ===
    buyWithFiatQuote.onRampToken.token.chainId;

  const sameToken =
    buyWithFiatQuote.toToken.tokenAddress ===
    buyWithFiatQuote.onRampToken.token.tokenAddress;

  return !(sameChain && sameToken);
}

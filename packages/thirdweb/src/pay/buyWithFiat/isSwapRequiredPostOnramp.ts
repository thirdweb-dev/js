import { getAddress } from "../../utils/address.js";
import type { PayTokenInfo } from "../utils/commonTypes.js";
import type { BuyWithFiatQuote } from "./getQuote.js";

/**
 * Check if a Swap is required after on-ramp when buying a token with fiat currency.
 *
 * If `quote.toToken` and `quote.onRampToken` are the same (same token and chain),
 * it means on-ramp provider can directly send the desired token to the user's wallet and no swap is required.
 *
 * If `quote.toToken` and `quote.onRampToken` are different (different token or chain), A swap is required to swap the on-ramp token to the desired token.
 *
 * @param buyWithFiatQuote - The quote of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote) returned
 * by the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function.
 * @deprecated
 * @buyCrypto
 */
export function isSwapRequiredPostOnramp(
  buyWithFiatQuote: Pick<BuyWithFiatQuote, "toToken" | "onRampToken">,
) {
  const sameChain =
    buyWithFiatQuote.toToken.chainId ===
    buyWithFiatQuote.onRampToken.token.chainId;

  const sameToken =
    getAddress(buyWithFiatQuote.toToken.tokenAddress) ===
    getAddress(buyWithFiatQuote.onRampToken.token.tokenAddress);

  return !(sameChain && sameToken);
}

export function getOnRampSteps(
  buyWithFiatQuote: BuyWithFiatQuote,
): OnRampStep[] {
  const isSwapRequired = isSwapRequiredPostOnramp(buyWithFiatQuote);

  if (!isSwapRequired) {
    return [
      {
        action: "buy",
        amount: buyWithFiatQuote.estimatedToAmountMin,
        token: buyWithFiatQuote.toToken,
      },
    ];
  }

  if (buyWithFiatQuote.routingToken) {
    return [
      {
        action: "buy",
        amount: buyWithFiatQuote.onRampToken.amount,
        token: buyWithFiatQuote.onRampToken.token,
      },
      {
        action: "swap",
        amount: buyWithFiatQuote.routingToken.amount,
        token: buyWithFiatQuote.routingToken.token,
      },
      {
        action: "bridge",
        amount: buyWithFiatQuote.estimatedToAmountMin,
        token: buyWithFiatQuote.toToken,
      },
    ];
  }

  return [
    {
      action: "buy",
      amount: buyWithFiatQuote.onRampToken.amount,
      token: buyWithFiatQuote.onRampToken.token,
    },
    {
      action: "swap",
      amount: buyWithFiatQuote.estimatedToAmountMin,
      token: buyWithFiatQuote.toToken,
    },
  ];
}

export type OnRampStep = {
  action: "buy" | "swap" | "bridge";
  token: PayTokenInfo;
  amount: string;
};

import type { SwapWidgetPlaygroundOptions } from "./types";

const SWAP_WIDGET_IFRAME_BASE_URL = "https://thirdweb.com/bridge/swap-widget";

export function buildSwapIframeUrl(
  options: SwapWidgetPlaygroundOptions,
  type: "code" | "preview" = "preview",
) {
  const url = new URL(SWAP_WIDGET_IFRAME_BASE_URL);

  if (type === "preview") {
    // always set it to false so playground doesn't show last used tokens
    url.searchParams.set("persistTokenSelections", "false");
  }

  // Buy token params
  if (options.prefill?.buyToken?.chainId) {
    url.searchParams.set("buyChain", String(options.prefill.buyToken.chainId));

    if (options.prefill.buyToken.tokenAddress) {
      url.searchParams.set(
        "buyTokenAddress",
        options.prefill.buyToken.tokenAddress,
      );
    }

    if (options.prefill.buyToken.amount) {
      url.searchParams.set("buyAmount", options.prefill.buyToken.amount);
    }
  }

  // Sell token params
  if (options.prefill?.sellToken?.chainId) {
    url.searchParams.set(
      "sellChain",
      String(options.prefill.sellToken.chainId),
    );

    if (options.prefill.sellToken.tokenAddress) {
      url.searchParams.set(
        "sellTokenAddress",
        options.prefill.sellToken.tokenAddress,
      );
    }

    if (options.prefill.sellToken.amount) {
      url.searchParams.set("sellAmount", options.prefill.sellToken.amount);
    }
  }

  // Theme (only add if light, dark is default)
  if (options.theme.type === "light") {
    url.searchParams.set("theme", "light");
  }

  // Currency (only add if not USD, USD is default)
  if (options.currency && options.currency !== "USD") {
    url.searchParams.set("currency", options.currency);
  }

  // Branding
  if (options.showThirdwebBranding === false) {
    url.searchParams.set("showThirdwebBranding", "false");
  }

  return url.toString();
}

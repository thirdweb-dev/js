import type { BridgeWidgetPlaygroundOptions } from "./types";

const BRIDGE_WIDGET_IFRAME_BASE_URL = "https://thirdweb.com/bridge/widget";

export function buildIframeUrl(
  options: BridgeWidgetPlaygroundOptions,
  type: "code" | "preview",
) {
  const url = new URL(BRIDGE_WIDGET_IFRAME_BASE_URL);

  if (type === "preview") {
    // always set it to false so playground doesn't show last used tokens
    url.searchParams.set("persistTokenSelections", "false");
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

  // Sell token (input)
  if (options.prefill?.sellToken) {
    url.searchParams.set(
      "inputChain",
      String(options.prefill.sellToken.chainId),
    );
    if (options.prefill.sellToken.tokenAddress) {
      url.searchParams.set(
        "inputCurrency",
        options.prefill.sellToken.tokenAddress,
      );
    }
    if (options.prefill.sellToken.amount) {
      url.searchParams.set(
        "inputCurrencyAmount",
        options.prefill.sellToken.amount,
      );
    }
  }

  // Buy token (output)
  if (options.prefill?.buyToken) {
    url.searchParams.set(
      "outputChain",
      String(options.prefill.buyToken.chainId),
    );
    if (options.prefill.buyToken.tokenAddress) {
      url.searchParams.set(
        "outputCurrency",
        options.prefill.buyToken.tokenAddress,
      );
    }
    if (options.prefill.buyToken.amount) {
      url.searchParams.set(
        "outputCurrencyAmount",
        options.prefill.buyToken.amount,
      );
    }
  }

  return url.toString();
}

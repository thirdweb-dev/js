import type { BridgeComponentsPlaygroundOptions } from "./types";

const BUY_WIDGET_IFRAME_BASE_URL = "https://thirdweb.com/bridge/buy-widget";

export function buildBuyIframeUrl(options: BridgeComponentsPlaygroundOptions) {
  const url = new URL(BUY_WIDGET_IFRAME_BASE_URL);

  // Chain (optional)
  if (options.payOptions.buyTokenChain?.id) {
    url.searchParams.set("chain", String(options.payOptions.buyTokenChain.id));
  }

  // Token address (optional - if not set, native token is used)
  if (options.payOptions.buyTokenAddress) {
    url.searchParams.set("tokenAddress", options.payOptions.buyTokenAddress);
  }

  // Amount (optional)
  if (options.payOptions.buyTokenAmount) {
    url.searchParams.set("amount", options.payOptions.buyTokenAmount);
  }

  // Receiver address (optional)
  if (options.payOptions.receiverAddress) {
    url.searchParams.set("receiver", options.payOptions.receiverAddress);
  }

  // Theme (only add if light, dark is default)
  if (options.theme.type === "light") {
    url.searchParams.set("theme", "light");
  }

  // Currency (only add if not USD, USD is default)
  if (options.payOptions.currency && options.payOptions.currency !== "USD") {
    url.searchParams.set("currency", options.payOptions.currency);
  }

  // Branding
  if (options.payOptions.showThirdwebBranding === false) {
    url.searchParams.set("showThirdwebBranding", "false");
  }

  // Product info
  if (options.payOptions.title) {
    url.searchParams.set("title", options.payOptions.title);
  }

  if (options.payOptions.description) {
    url.searchParams.set("description", options.payOptions.description);
  }

  if (options.payOptions.image) {
    url.searchParams.set("image", options.payOptions.image);
  }

  if (options.payOptions.buttonLabel) {
    url.searchParams.set("buttonLabel", options.payOptions.buttonLabel);
  }

  // Payment methods
  if (
    options.payOptions.paymentMethods &&
    options.payOptions.paymentMethods.length === 1
  ) {
    url.searchParams.set(
      "paymentMethods",
      options.payOptions.paymentMethods[0],
    );
  }

  return url.toString();
}

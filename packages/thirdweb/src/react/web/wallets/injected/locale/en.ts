import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Awaiting Confirmation",
    failed: "Connection failed",
    instruction: `Accept the connection request in ${wallet}`,
    retry: "Try Again",
  },
  getStartedScreen: {
    instruction: `Scan the QR code to download the ${wallet} app`,
  },
  scanScreen: {
    instruction: `Scan the QR code with the ${wallet} app to connect`,
  },
  getStartedLink: `Don't have ${wallet}?`,
  download: {
    chrome: "Download Chrome Extension",
    android: "Download on Google Play",
    iOS: "Download on App Store",
  },
});

export default injectedWalletLocaleEn;

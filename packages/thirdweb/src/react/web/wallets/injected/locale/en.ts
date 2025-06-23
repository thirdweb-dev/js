import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Connection failed",
    inProgress: "Awaiting Confirmation",
    instruction: `Accept the connection request in ${wallet}`,
    retry: "Try Again",
  },
  download: {
    android: "Download on Google Play",
    chrome: "Download Chrome Extension",
    iOS: "Download on App Store",
  },
  getStartedLink: `Don't have ${wallet}?`,
  getStartedScreen: {
    instruction: `Scan the QR code to download the ${wallet} app`,
  },
  scanScreen: {
    instruction: `Scan the QR code with the ${wallet} app to connect`,
  },
});

export default injectedWalletLocaleEn;

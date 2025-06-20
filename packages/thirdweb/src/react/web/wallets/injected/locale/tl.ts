import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleTl = (walletName: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Nabigo ang Pagkakonekta",
    inProgress: "Naghihintay ng Kumpirmasyon",
    instruction: `Tanggapin ang connection request sa ${walletName} wallet`,
    retry: "Subukan Muli",
  },
  download: {
    android: "I-download sa Google Play",
    chrome: "I-download ang Chrome Extension",
    iOS: "I-download sa App Store",
  },
  getStartedLink: `Wala kang ${walletName} wallet?`,
  getStartedScreen: {
    instruction: `I-scan ang QR code para ma-download ang ${walletName} app`,
  },
  scanScreen: {
    instruction: `I-scan ang QR code gamit ang ${walletName} app para makonekta`,
  },
});

export default injectedWalletLocaleTl;

import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleTl = (walletName: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Naghihintay ng Kumpirmasyon",
    failed: "Nabigo ang Pagkakonekta",
    instruction: `Tanggapin ang connection request sa ${walletName} wallet`,
    retry: "Subukan Muli",
  },
  getStartedScreen: {
    instruction: `I-scan ang QR code para ma-download ang ${walletName} app`,
  },
  scanScreen: {
    instruction: `I-scan ang QR code gamit ang ${walletName} wallet app para makonekta`,
  },
  getStartedLink: `Wala kang ${walletName} wallet?`,
});

export default injectedWalletLocaleTl;

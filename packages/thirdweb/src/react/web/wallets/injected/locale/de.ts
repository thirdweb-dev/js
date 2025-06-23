import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Verbindung fehlgeschlagen",
    inProgress: "Verbindung wird hergestellt",
    instruction: `Akzeptiere die Verbindung in ${wallet}`,
    retry: "Erneut versuchen",
  },
  download: {
    android: "Von Google Play herunterladen",
    chrome: "Chrome Extension installieren",
    iOS: "Von App Store herunterladen",
  },
  getStartedLink: `Du hast ${wallet} nicht?`,
  getStartedScreen: {
    instruction: `Scanne den QR Code um ${wallet} herunterzuladen`,
  },
  scanScreen: {
    instruction: `Scanne den QR Code um ${wallet} zu verbinden`,
  },
});

export default injectedWalletLocaleEn;

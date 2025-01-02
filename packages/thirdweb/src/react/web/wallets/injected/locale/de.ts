import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Verbindung wird hergestellt",
    failed: "Verbindung fehlgeschlagen",
    instruction: `Akzeptiere die Verbindung in ${wallet}`,
    retry: "Erneut versuchen",
  },
  getStartedScreen: {
    instruction: `Scanne den QR Code um ${wallet} herunterzuladen`,
  },
  scanScreen: {
    instruction: `Scanne den QR Code um ${wallet} zu verbinden`,
  },
  getStartedLink: `Du hast ${wallet} nicht?`,
  download: {
    chrome: "Chrome Extension installieren",
    android: "Von Google Play herunterladen",
    iOS: "Von App Store herunterladen",
  },
});

export default injectedWalletLocaleEn;

import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "En attente de confirmation",
    failed: "Connexion échouée",
    instruction: `Acceptez la demande de connexion dans ${wallet}`,
    retry: "Réessayer",
  },
  getStartedScreen: {
    instruction: `Scannez le code QR pour télécharger l'application ${wallet}`,
  },
  scanScreen: {
    instruction: `Scannez le code QR avec l'application ${wallet} pour vous connecter`,
  },
  getStartedLink: `Vous n'avez pas ${wallet} ?`,
  download: {
    chrome: "Télécharger l'extension Chrome",
    android: "Télécharger sur Google Play",
    iOS: "Télécharger sur l'App Store",
  },
});

export default injectedWalletLocaleEn;

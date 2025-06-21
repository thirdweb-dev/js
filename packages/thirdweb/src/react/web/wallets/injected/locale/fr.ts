import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Connexion échouée",
    inProgress: "En attente de confirmation",
    instruction: `Acceptez la demande de connexion dans ${wallet}`,
    retry: "Réessayer",
  },
  download: {
    android: "Télécharger sur Google Play",
    chrome: "Télécharger l'extension Chrome",
    iOS: "Télécharger sur l'App Store",
  },
  getStartedLink: `Vous n'avez pas ${wallet} ?`,
  getStartedScreen: {
    instruction: `Scannez le code QR pour télécharger l'application ${wallet}`,
  },
  scanScreen: {
    instruction: `Scannez le code QR avec l'application ${wallet} pour vous connecter`,
  },
});

export default injectedWalletLocaleEn;

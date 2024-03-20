import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleEs = (walletName: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Esperando confirmación",
    failed: "Conexión fallida",
    instruction: `Acepta la solicitud de conexión en tu cartera ${walletName}`,
    retry: "Intentar de nuevo",
  },
  getStartedScreen: {
    instruction: `Escanea el código QR para descargar la aplicación ${walletName}`,
  },
  scanScreen: {
    instruction: `Escanea el código QR con la aplicación de cartera ${walletName} para conectarte`,
  },
  getStartedLink: `¿No tienes la cartera ${walletName}?`,
});

export default injectedWalletLocaleEs;

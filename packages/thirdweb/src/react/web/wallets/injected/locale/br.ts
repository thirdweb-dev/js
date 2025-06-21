import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocalePtBr = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Falha na conexão",
    inProgress: "Aguardando Confirmação",
    instruction: `Aceite a solicitação de conexão no ${wallet}`,
    retry: "Tentar novamente",
  },
  download: {
    android: "Baixar no Google Play",
    chrome: "Baixar extensão para Chrome",
    iOS: "Baixar na App Store",
  },
  getStartedLink: `Não tem o ${wallet}?`,
  getStartedScreen: {
    instruction: `Escaneie o código QR para baixar o aplicativo ${wallet}`,
  },
  scanScreen: {
    instruction: `Escaneie o código QR com o aplicativo ${wallet} para conectar`,
  },
});

export default injectedWalletLocalePtBr;

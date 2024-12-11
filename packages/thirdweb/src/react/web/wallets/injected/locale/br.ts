import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocalePtBr = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Aguardando Confirmação",
    failed: "Falha na conexão",
    instruction: `Aceite a solicitação de conexão no ${wallet}`,
    retry: "Tentar novamente",
  },
  getStartedScreen: {
    instruction: `Escaneie o código QR para baixar o aplicativo ${wallet}`,
  },
  scanScreen: {
    instruction: `Escaneie o código QR com o aplicativo ${wallet} para conectar`,
  },
  getStartedLink: `Não tem o ${wallet}?`,
  download: {
    chrome: "Baixar extensão para Chrome",
    android: "Baixar no Google Play",
    iOS: "Baixar na App Store",
  },
});

export default injectedWalletLocalePtBr;

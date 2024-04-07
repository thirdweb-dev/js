import type { LocaleId } from "../../ui/types.js";

// because this locale is so small, we can just put it all in single file

export type WalletConnectLocale = {
  scanInstruction: string;
  openWCModal: string;
};

export const walletConnectLocales: Record<LocaleId, WalletConnectLocale> = {
  en_US: {
    scanInstruction: "Scan this with your wallet app to connect",
    openWCModal: "Open Official WalletConnect Modal",
  },
  ja_JP: {
    scanInstruction:
      '接続するためにウォレットアプリでこちらをスキャンしてください"',
    openWCModal: "Open Official WalletConnect Modal", // TODO translate
  },
  tl_PH: {
    scanInstruction: "I-scan ito gamit ang iyong wallet app para makakonekta",
    openWCModal: "Open Official WalletConnect Modal", // TODO translate
  },
  es_ES: {
    scanInstruction: "Escanea esto con tu aplicación de cartera para conectar",
    openWCModal: "Open Official WalletConnect Modal", // TODO translate
  },
};

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
    openWCModal: "公式のWalletConnectモーダルを開く",
  },
  tl_PH: {
    scanInstruction: "I-scan ito gamit ang iyong wallet app para makakonekta",
    openWCModal: "Buksan ang Opisyal na WalletConnect Modal",
  },
  es_ES: {
    scanInstruction: "Escanea esto con tu aplicación de cartera para conectar",
    openWCModal: "Abre el Modal Oficial de WalletConnect",
  },
  vi_VN: {
    scanInstruction: "Quét mã QR bằng ứng dụng ví để kết nối",
    openWCModal: "Mở giao diện WalletConnect",
  },
  de_DE: {
    scanInstruction: "Scanne dies mit deiner Wallet-App, um zu verbinden",
    openWCModal: "Offizielles WalletConnect-Modal öffnen",
  },
  ko_KR: {
    scanInstruction: "지갑 앱으로 이 QR 코드를 스캔하여 연결하세요",
    openWCModal: "공식 WalletConnect 모달 열기",
  },
  fr_FR: {
    scanInstruction:
      "Scannez ce code avec votre application de portefeuille pour vous connecter",
    openWCModal: "Ouvrir le modal WalletConnect officiel",
  },
};

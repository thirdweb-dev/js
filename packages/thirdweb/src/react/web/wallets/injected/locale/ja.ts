import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleJa = (walletName: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "確認待ち",
    failed: "接続に失敗しました",
    instruction: `${walletName}のウォレットで接続リクエストを承認してください`,
    retry: "再試行",
  },
  getStartedScreen: {
    instruction: `QRコードをスキャンして${walletName}アプリをダウンロードしてください`,
  },
  scanScreen: {
    instruction: `${walletName}のウォレットアプリでQRコードをスキャンして接続してください`,
  },
  getStartedLink: `${walletName}のウォレットを持っていませんか？`,
  download: {
    chrome: "Chrome拡張をダウンロード",
    android: "Google Playでダウンロード",
    iOS: "App Storeでダウンロード",
  },
});

export default injectedWalletLocaleJa;

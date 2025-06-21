import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocale = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "接続に失敗しました",
    inProgress: "確認を待っています",
    instruction: `${wallet}で接続リクエストを承認してください`,
    retry: "再試行",
  },
  download: {
    android: "Google Playでダウンロード",
    chrome: "Chrome拡張機能をダウンロード",
    iOS: "App Storeでダウンロード",
  },
  getStartedLink: `${wallet}をお持ちではありませんか？`,
  getStartedScreen: {
    instruction: `QRコードをスキャンして${wallet}アプリをダウンロードしてください`,
  },
  scanScreen: {
    instruction: `${wallet}アプリでQRコードをスキャンして接続してください`,
  },
});
export default injectedWalletLocale;

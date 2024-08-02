import type { InjectedWalletLocale } from "./types.js";
/**
 * @internal
 */
const injectedWalletLocale = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "確認を待っています",
    failed: "接続に失敗しました",
    instruction: `${wallet}で接続リクエストを承認してください`,
    retry: "再試行",
  },
  getStartedScreen: {
    instruction: `QRコードをスキャンして${wallet}アプリをダウンロードしてください`,
  },
  scanScreen: {
    instruction: `${wallet}アプリでQRコードをスキャンして接続してください`,
  },
  getStartedLink: `${wallet}をお持ちではありませんか？`,
  download: {
    chrome: "Chrome拡張機能をダウンロード",
    android: "Google Playでダウンロード",
    iOS: "App Storeでダウンロード",
  },
});
export default injectedWalletLocale;

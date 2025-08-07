import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleZh = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "连接失败",
    inProgress: "等待用户确认",
    instruction: `请在 ${wallet} 中接受连接请求`,
    retry: "重试",
  },
  download: {
    android: "从 Google Play 下载",
    chrome: "下载 Chrome 扩展",
    iOS: "从 App Store 下载",
  },
  getStartedLink: `没有 ${wallet}？`,
  getStartedScreen: {
    instruction: `扫描二维码下载 ${wallet} 应用`,
  },
  scanScreen: {
    instruction: `用 ${wallet} 扫描二维码连接`,
  },
});

export default injectedWalletLocaleZh;

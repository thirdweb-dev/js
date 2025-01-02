import type { InjectedWalletLocale } from "./types.js";
/**
 * @internal
 */
const injectedWalletLocale = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "확인 대기 중",
    failed: "연결 실패",
    instruction: `${wallet}에서 연결 요청을 수락하세요`,
    retry: "다시 시도하세요",
  },
  getStartedScreen: {
    instruction: `Scan the QR code to download the ${wallet} app`,
  },
  scanScreen: {
    instruction: `Scan the QR code with the ${wallet} app to connect`,
  },
  getStartedLink: `Don't have ${wallet}?`,
  download: {
    chrome: "Chrome 확장 프로그램 다운로드",
    android: "Google Play에서 다운로드",
    iOS: "App Store에서 다운로드",
  },
});
export default injectedWalletLocale;

import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleVi = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Đang đợi xác nhận",
    failed: "Kết nối thất bại",
    instruction: `Kết nối bằng ứng dụng ${wallet}`,
    retry: "Thử lại",
  },
  getStartedScreen: {
    instruction: `Quét mã QR để tải ứng dụng ${wallet}`,
  },
  scanScreen: {
    instruction: `Quét mã QR bằng ứng dụng ${wallet} để kết nối`,
  },
  getStartedLink: `Tôi không có ứng dụng ${wallet}`,
  download: {
    chrome: "Tải cho trình duyệt Chrome",
    android: "Tải trên Google Play",
    iOS: "Tải trên App Store",
  },
});

export default injectedWalletLocaleVi;

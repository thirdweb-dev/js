import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleVi = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Kết nối thất bại",
    inProgress: "Đang đợi xác nhận",
    instruction: `Kết nối bằng ứng dụng ${wallet}`,
    retry: "Thử lại",
  },
  download: {
    android: "Tải trên Google Play",
    chrome: "Tải cho trình duyệt Chrome",
    iOS: "Tải trên App Store",
  },
  getStartedLink: `Tôi không có ứng dụng ${wallet}`,
  getStartedScreen: {
    instruction: `Quét mã QR để tải ứng dụng ${wallet}`,
  },
  scanScreen: {
    instruction: `Quét mã QR bằng ứng dụng ${wallet} để kết nối`,
  },
});

export default injectedWalletLocaleVi;

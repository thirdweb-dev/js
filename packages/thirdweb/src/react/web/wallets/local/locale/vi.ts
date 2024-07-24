import type { LocalWalletLocale } from "./types.js";

const localWalletLocaleVi: LocalWalletLocale = {
  passwordLabel: "Mật khẩu",
  confirmPasswordLabel: "Xác nhận mật khẩu",
  enterYourPassword: "Nhập mật khẩu của bạn",
  warningScreen: {
    title: "Cảnh báo",
    warning:
      "Ví hiện tại sẽ bị xoá nếu bạn tạo một ví mới. Hãy cân nhắc sao lưu ví về thiết bị",
    backupWallet: "Sao lưu ví",
    skip: "Bỏ qua",
  },
  reconnectScreen: {
    title: "Kết nối bằng ví đã lưu",
    savedWallet: "Ví đã lưu",
    continue: "Tiếp tục",
    createNewWallet: "Tạo ví mới",
  },
  createScreen: {
    instruction:
      "Chọn một mật khẩu cho ví của bạn. Bạn có thể dùng mật khẩu đã đặt để truy cập và sao lưu ví sau này",
    importWallet: "Thêm ví",
    createNewWallet: "Tạo ví mới",
    connecting: "Đang kết nối",
  },
  exportScreen: {
    downloadMessage: "Một tệp chứa private key sẽ được tải về thiết bị của bạn",
    decryptMessage: "Nhập mật khẩu để giải mã private key",
    walletAddress: "Địa chỉ ví",
    download: "Tải về",
    title: "Sao lưu ví",
  },
  importScreen: {
    title: "Thêm ví mới",
    description1:
      "Ứng dụng này có thể tự do giao dịch mà không cần sự cho phép của bạn",
    description2: "Bạn chỉ nên kết nối ví với những ứng dụng đáng tin cậy",
    passwordDescription:
      "Chọn một mật khẩu để mã hoá private key. Private key đã mã hoá sẽ được lưu trên trình duyệt",
    import: "Thêm",
    uploadJSON: "Tải lên tệp JSON",
    uploadedSuccessfully: "Tải lên thành công",
    invalidPrivateKey: "Private Key không hợp lệ",
  },
};

export default localWalletLocaleVi;

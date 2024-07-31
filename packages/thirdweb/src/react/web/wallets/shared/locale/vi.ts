import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Google",
  signInWithFacebook: "Facebook",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  emailPlaceholder: "Địa chỉ email",
  submitEmail: "Tiếp tục",
  signIn: "Đăng nhập",
  or: "Hoặc",
  emailRequired: "Vui lòng nhập địa chỉ email",
  invalidEmail: "Địa chỉ email không hợp lệ",
  maxAccountsExceeded:
    "Số tài khoản vượt quá mức quy định. Vui lòng liên hệ với lập trình viên của ứng dụng này",
  socialLoginScreen: {
    title: "Đăng nhập",
    instruction: "Đăng nhập ở cửa sổ hiện lên",
    failed: "Đăng nhập thất bại",
    retry: "Thử lại",
  },
  emailLoginScreen: {
    title: "Đăng nhập",
    enterCodeSendTo: "Nhập mã xác nhận được gửi tới",
    newDeviceDetected: "Bạn đang đăng nhập trên một thiết bị mới",
    enterRecoveryCode:
      "Nhập mã khôi phục mà bạn nhận được khi đăng nhập lần đầu",
    invalidCode: "Mã xác nhận không hợp lệ",
    invalidCodeOrRecoveryCode: "Mã xác nhận hoặc mã khôi phục bị sai",
    verify: "Xác nhận",
    failedToSendCode: "Gửi mã xác nhận thất bại",
    sendingCode: "Đang gửi mã xác nhận",
    resendCode: "Gửi lại mã xác nhận",
  },
  createPassword: {
    title: "Tạo mật khẩu",
    instruction:
      "Đặt mật khẩu cho tài khoản của bạn. Bạn cần mật khẩu này mỗi khi đăng nhập trên một thiết bị mới",
    saveInstruction: "Vui lòng sao lưu mật khẩu",
    inputPlaceholder: "Nhập mật khẩu của bạn",
    confirmation: "Tôi đã sao lưu mật khẩu",
    submitButton: "Đặt mật khẩu",
    failedToSetPassword: "Đặt mật khẩu thất bại",
  },
  enterPassword: {
    title: "Nhập mật khẩu",
    instruction: "Nhập mật khẩu cho tài khoản của bạn",
    inputPlaceholder: "Nhập mật khẩu của bạn",
    submitButton: "Xác nhân",
    wrongPassword: "Sai mật khẩu",
  },
  signInWithEmail: "Đăng nhập bằng email",
  invalidPhone: "Số điện thoại không hợp lệ",
  phonePlaceholder: "Số điện thoại",
  signInWithPhone: "Đăng nhập bằng số điện thoại",
  phoneRequired: "Vui lòng nhập số điện thoại",
} satisfies InAppWalletLocale;

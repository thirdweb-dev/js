import type { LocalWalletLocale } from "./types.js";
const localWalletLocaleEn: LocalWalletLocale = {
  passwordLabel: "비밀번호",
  confirmPasswordLabel: "비밀번호 확인",
  enterYourPassword: "비밀번호를 입력하세요",
  warningScreen: {
    title: "경고",
    warning:
      "새 지갑을 생성하면 현재 지갑이 삭제됩니다. 새 지갑을 생성하기 전에 지갑을 기기에 백업하세요",
    backupWallet: "지갑 백업",
    skip: "건너뛰기",
  },
  reconnectScreen: {
    title: "저장된 지갑에 연결",
    savedWallet: "저장된 지갑",
    continue: "계속하기",
    createNewWallet: "새 지갑 생성",
  },
  createScreen: {
    instruction:
      "지갑의 비밀번호를 선택하세요. 동일한 비밀번호로 이 지갑에 접근하고 내보낼 수 있습니다",
    importWallet: "지갑 가져오기",
    createNewWallet: "새 지갑 생성",
    connecting: "연결 중",
  },
  exportScreen: {
    downloadMessage:
      "이 작업은 지갑 개인 키가 포함된 텍스트 파일을 기기에 다운로드합니다.",
    decryptMessage: "개인 키를 복호화하려면 이 지갑의 비밀번호를 입력하세요.",
    walletAddress: "지갑 주소",
    download: "다운로드",
    title: "지갑 백업",
  },
  importScreen: {
    title: "지갑 가져오기",
    description1:
      "애플리케이션은 지갑 소유자의 승인 없이 모든 거래를 승인할 수 있습니다.",
    description2: "신뢰할 수 있는 애플리케이션에만 연결할 것을 권장합니다",
    passwordDescription:
      "개인 키를 암호화할 비밀번호를 선택하세요. 암호화된 개인 키는 브라우저에 저장됩니다",
    import: "가져오기",
    uploadJSON: "JSON 파일을 업로드하세요",
    uploadedSuccessfully: "업로드 성공",
    invalidPrivateKey: "잘못된 개인 키",
  },
};
export default localWalletLocaleEn;

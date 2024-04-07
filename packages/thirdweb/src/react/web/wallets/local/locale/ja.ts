import type { LocalWalletLocale } from "./types.js";

const localWalletLocaleJa: LocalWalletLocale = {
  passwordLabel: "パスワード",
  confirmPasswordLabel: "パスワードを確認",
  enterYourPassword: "パスワードを入力してください",
  warningScreen: {
    title: "警告",
    warning:
      "新しいウォレットを作成すると、現在のウォレットは削除されます。新しいウォレットを作成する前に、ウォレットのバックアップをデバイスに保存してください",
    backupWallet: "ウォレットのバックアップ",
    // TODO: translate
    skip: "Skip",
  },
  reconnectScreen: {
    title: "保存されたウォレットへの接続",
    savedWallet: "保存されたウォレット",
    continue: "続ける",
    createNewWallet: "新しいウォレットを作成",
  },
  createScreen: {
    instruction:
      "ウォレットのパスワードを選択してください。このパスワードで、このウォレットにアクセスしたり、同じパスワードでエクスポートすることができます",
    importWallet: "ウォレットをインポート",
    createNewWallet: "新しいウォレットを作成",
    connecting: "接続中",
  },
  exportScreen: {
    // TODO: translate
    downloadMessage:
      "This will download a text file containing the wallet private key onto your device",
    decryptMessage:
      "Enter the password of this wallet to decrypt the private key",
    walletAddress: "ウォレットアドレス",
    download: "ダウンロード",
    title: "ウォレットのバックアップ",
  },
  importScreen: {
    title: "ウォレットをインポート",
    description1:
      "アプリケーションは、ウォレットの代わりに任意の取引を承認なしで認証することができます",
    description2: "信頼できるアプリケーションにのみ接続することをお勧めします",
    // TODO: translate
    passwordDescription:
      "Choose a password to encrypt the private key. Encrypted private key will be stored in browser",
    import: "インポート",
    uploadJSON: "JSONファイルをアップロードしてください",
    uploadedSuccessfully: "正常にアップロードされました",
    // TODO
    invalidPrivateKey: "Invalid Private Key",
  },
};

export default localWalletLocaleJa;

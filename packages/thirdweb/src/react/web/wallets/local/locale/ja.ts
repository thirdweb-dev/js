import type { LocalWalletLocale } from "./types.js";
const localWalletLocaleEn: LocalWalletLocale = {
  passwordLabel: "パスワード",
  confirmPasswordLabel: "パスワードを確認",
  enterYourPassword: "パスワードを入力してください",
  warningScreen: {
    title: "警告",
    warning:
      "新しいウォレットを作成すると、現在のウォレットが削除されます。新しいウォレットを作成する前に、ウォレットをデバイスにバックアップしてください",
    backupWallet: "ウォレットをバックアップ",
    skip: "スキップ",
  },
  reconnectScreen: {
    title: "保存されたウォレットに接続",
    savedWallet: "保存されたウォレット",
    continue: "続行",
    createNewWallet: "新しいウォレットを作成",
  },
  createScreen: {
    instruction:
      "ウォレットのパスワードを選択してください。同じパスワードでこのウォレットにアクセスしてエクスポートできます",
    importWallet: "ウォレットをインポート",
    createNewWallet: "新しいウォレットを作成",
    connecting: "接続中",
  },
  exportScreen: {
    downloadMessage:
      "これにより、ウォレットの秘密鍵を含むテキストファイルがデバイスにダウンロードされます",
    decryptMessage:
      "秘密鍵を復号するために、このウォレットのパスワードを入力してください",
    walletAddress: "ウォレットアドレス",
    download: "ダウンロード",
    title: "ウォレットをバックアップ",
  },
  importScreen: {
    title: "ウォレットをインポート",
    description1:
      "アプリケーションは、ウォレットの代理として任意のトランザクションを承認できます",
    description2: "信頼できるアプリケーションにのみ接続することをお勧めします",
    passwordDescription:
      "秘密鍵を暗号化するためのパスワードを選択してください。暗号化された秘密鍵はブラウザに保存されます",
    import: "インポート",
    uploadJSON: "JSONファイルをアップロードしてください",
    uploadedSuccessfully: "正常にアップロードされました",
    invalidPrivateKey: "無効な秘密鍵",
  },
};
export default localWalletLocaleEn;

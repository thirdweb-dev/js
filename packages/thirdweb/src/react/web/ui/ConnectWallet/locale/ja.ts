import type { ConnectLocale } from "./types.js";

const connectWalletLocalJa: ConnectLocale = {
  agreement: {
    and: "および",
    prefix: "接続することで、以下に同意したことになります：",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
  },
  backupWallet: "ウォレットのバックアップ",
  buy: "購入",
  confirmInWallet: "ウォレットで確認",
  connectAWallet: "ウォレットを接続する",
  connectedToSmartWallet: "スマートウォレットに接続済み",
  connecting: "接続中",
  continueAsGuest: "ゲストとして続ける",
  copyAddress: "アドレスをコピー",
  currentNetwork: "現在のネットワーク",
  defaultButtonTitle: "ウォレット接続",
  defaultModalTitle: "接続",
  disconnectWallet: "ウォレットの切断",
  getStarted: "始める",
  goBackButton: "戻る",
  guest: "ゲスト",
  guestWalletWarning:
    "これは一時的なゲストウォレットです。アクセスできなくなることを防ぐため、バックアップをしてください",
  id: "ja_JP",
  installed: "インストール済み",
  manageWallet: {
    connectAnApp: "アプリを接続",
    exportPrivateKey: "秘密鍵をエクスポート",
    linkedProfiles: "リンクされたプロファイル",
    linkProfile: "プロフィールをリンクする",
    title: "ウォレットを管理",
  },
  networkSelector: {
    addCustomNetwork: "カスタムネットワークを追加",
    allNetworks: "すべて",
    categoryLabel: {
      others: "全てのネットワーク",
      popular: "人気",
      recentlyUsed: "最近使用したもの",
    },
    failedToSwitch: "ネットワークの切替に失敗しました",
    inputPlaceholder: "ネットワーク名またはチェーンIDを検索",
    loading: "読み込み中",
    mainnets: "メインネット",
    testnets: "テストネット",
    title: "ネットワークの選択",
  },
  newToWallets: "ウォレットは初めてですか？",
  or: "または",
  passkeys: {
    linkPasskey: "パスキーをリンクする",
    title: "パスキー",
  },
  payTransactions: "支払い取引",
  personalWallet: "パーソナルウォレット",
  receive: "受け取る", // Used in "Switch to <Wallet-Name>"
  receiveFundsScreen: {
    instruction:
      "このウォレットに資金を送るためのウォレットアドレスをコピーしてください",
    title: "資金を受け取る",
  },
  recommended: "推奨",
  requestTestnetFunds: "テストネットの資金をリクエストする",
  send: "送る",
  sendFundsScreen: {
    amount: "金額",
    insufficientFunds: "資金が不足しています",
    invalidAddress: "無効なアドレス",
    noTokensFound: "トークンが見つかりません",
    searchToken: "トークンのアドレスを検索するか、貼り付けてください",
    selectTokenTitle: "トークンを選択",
    sending: "送信中",
    sendTo: "送信先",
    submitButton: "送信",
    successMessage: "取引成功",
    title: "資金の送付",
    token: "トークン",
    transactionFailed: "取引に失敗しました",
    transactionRejected: "取引が拒否されました",
  },
  signatureScreen: {
    instructionScreen: {
      disconnectWallet: "ウォレットの切断",
      instruction:
        "続行するためにウォレットでメッセージリクエストにサインしてください",
      signInButton: "サインイン",
      title: "サインイン",
    },
    signingScreen: {
      approveTransactionInSafe: "Safeで取引を承認",
      failedToSignIn: "サインインに失敗しました",
      inProgress: "確認待ち",
      prompt: "ウォレットで署名リクエストにサインしてください",
      promptForSafe:
        "ウォレットで署名リクエストにサインし、Safeで取引を承認してください",
      title: "サインイン中",
      tryAgain: "再試行",
    },
  },
  signIn: "サインイン",
  smartWallet: "スマートウォレット", // TODO - check translation
  switchAccount: "アカウントを切り替える",
  switchingNetwork: "ネットワークの切替中",
  switchNetwork: "ネットワークを切り替える",
  switchTo: "切り替え先",
  transactions: "取引",
  viewAllTransactions: "全ての取引を表示",
  viewFunds: {
    title: "資金を表示",
    viewAssets: "資産を表示",
    viewNFTs: "NFTを表示",
    viewTokens: "トークンを表示",
  },
  walletTransactions: "ウォレット取引",
  welcomeScreen: {
    defaultSubtitle: "始めるためにウォレットを接続してください",
    defaultTitle: "分散型世界へのゲートウェイ",
  },
};

export default connectWalletLocalJa;

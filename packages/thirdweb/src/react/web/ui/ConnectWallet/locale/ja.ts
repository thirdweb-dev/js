import type { ConnectLocale } from "./types.js";

const connectWalletLocalJa: ConnectLocale = {
  signIn: "サインイン",
  defaultButtonTitle: "ウォレット接続",
  connecting: "接続中",
  switchNetwork: "ネットワークを切り替える",
  switchingNetwork: "ネットワークの切替中",
  defaultModalTitle: "接続",
  recommended: "推奨",
  installed: "インストール済み",
  continueAsGuest: "ゲストとして続ける",
  connectAWallet: "ウォレットを接続する",
  newToWallets: "ウォレットは初めてですか？",
  getStarted: "始める",
  guest: "ゲスト",
  send: "送る",
  receive: "受け取る",
  currentNetwork: "現在のネットワーク",
  switchAccount: "アカウントを切り替える",
  requestTestnetFunds: "テストネットの資金をリクエストする",
  buy: "Buy", // TODO
  transactions: "Transactions", // TODO
  viewAllTransactions: "View All Transactions", // TODO
  backupWallet: "ウォレットのバックアップ",
  guestWalletWarning:
    "これは一時的なゲストウォレットです。アクセスできなくなることを防ぐため、バックアップをしてください",
  switchTo: "切り替え先", // Used in "Switch to <Wallet-Name>"
  connectedToSmartWallet: "スマートウォレットに接続済み",
  confirmInWallet: "ウォレットで確認",
  disconnectWallet: "ウォレットの切断",
  copyAddress: "アドレスをコピー",
  personalWallet: "パーソナルウォレット",
  smartWallet: "スマートウォレット",
  or: "または",
  goBackButton: "戻る", // TODO - check translation
  welcomeScreen: {
    defaultTitle: "分散型世界へのゲートウェイ",
    defaultSubtitle: "始めるためにウォレットを接続してください",
  },
  agreement: {
    prefix: "接続することで、以下に同意したことになります：",
    termsOfService: "利用規約",
    and: "および",
    privacyPolicy: "プライバシーポリシー",
  },
  networkSelector: {
    title: "ネットワークの選択",
    mainnets: "メインネット",
    testnets: "テストネット",
    allNetworks: "すべて",
    addCustomNetwork: "カスタムネットワークを追加",
    inputPlaceholder: "ネットワーク名またはチェーンIDを検索",
    categoryLabel: {
      recentlyUsed: "最近使用したもの",
      popular: "人気",
      others: "全てのネットワーク",
    },
    loading: "読み込み中",
    failedToSwitch: "ネットワークの切替に失敗しました",
  },
  receiveFundsScreen: {
    title: "資金を受け取る",
    instruction:
      "このウォレットに資金を送るためのウォレットアドレスをコピーしてください",
  },
  sendFundsScreen: {
    title: "資金の送付",
    submitButton: "送信",
    token: "トークン",
    sendTo: "送信先",
    amount: "金額",
    successMessage: "取引成功",
    invalidAddress: "無効なアドレス",
    noTokensFound: "トークンが見つかりません",
    searchToken: "トークンのアドレスを検索するか、貼り付けてください",
    transactionFailed: "取引に失敗しました",
    transactionRejected: "取引が拒否されました",
    insufficientFunds: "資金が不足しています",
    selectTokenTitle: "トークンを選択",
    sending: "送信中",
  },
  signatureScreen: {
    instructionScreen: {
      title: "サインイン",
      instruction:
        "続行するためにウォレットでメッセージリクエストにサインしてください",
      signInButton: "サインイン",
      disconnectWallet: "ウォレットの切断",
    },
    signingScreen: {
      title: "サインイン中",
      prompt: "ウォレットで署名リクエストにサインしてください",
      promptForSafe:
        "ウォレットで署名リクエストにサインし、Safeで取引を承認してください",
      approveTransactionInSafe: "Safeで取引を承認",
      tryAgain: "再試行",
      failedToSignIn: "サインインに失敗しました",
      inProgress: "確認待ち",
    },
  },
};

export default connectWalletLocalJa;
